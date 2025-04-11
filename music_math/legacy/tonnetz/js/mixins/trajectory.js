var trajectoryBus=[];
var _count1 = 0;
var _countDel = 0;
var __trajectory;

// Mixin that groups the trajectory functionnality. Calls on TonnetzLike properties and methods
let traceHandler = {
    props:{
        trace: {
            type: Boolean,
            default: false
        }
    },
    static: {
        delay: 50 // Notes within 50ms of each other are part of a chord 
    },
    data: function(){return {
        trajectory : [], // The array of the traversed note nodes. A trajectory element should be a pair of a MIDI event and its associated position
        active: [],
        visited: new Set(), // The string keys of all visited nodes and chords
        noteBuffer: [], // The notes waiting to be processed
        noteOffBuffer: [], // The Off notes waiting to be processed
        lastChords: [],
        chordTimer: undefined // The timer until bufferised notes are processed as a chord
    }},
    computed:{
        // The array of nodes (resp dichords and trichords) to be rendered, paired with their status
        nodeStateList: function(){
            return this.nodeList.map(node => ({node,status:this.status(node)}) );
        },
        dichordStateList: function(){
            return this.dichordList.map(nodes => ({nodes,status:this.chordStatus(nodes)}) );
        },
        trichordStateList: function(){
            return this.trichordList.map(nodes => ({nodes,status:this.chordStatus(nodes)}) );
        },
        memoNode2Notes: function(){ // Memoize so the returned objects evaluate as equal and no change is detected
            this.intervals && this.notes // Force dependency so the memo's cache is emptied
            return memo(this.node2Notes);
        },
        memoShape: function(){ // Memoize so the returned objects evaluate as equal and no change is detected
            return memo(this.shape);
        }
    },
    watch:{
        trace: function(){// If trace changes, either we don't need the trajectory anymore or we start a new one.
            this.resetTrajectory();
        },
        intervals : function(){// If intervals changes, the current trajectory is no longer valid
            this.resetTrajectory();
        }
    },
    mounted(){
        midiBus.connect(this.midiDispatch);
        __trajectory = this; // Easy debug acces
    },
    methods:{
        // Tells whether a given node is activated (2), was activated earlier (1) or is not (0), or lets the node decide (-1)
        status: function(node){
            if (this.trace){
                let isActive = this.active.some(nodeB => nodeB.x==node.x && nodeB.y==node.y);
                if(isActive){
                    return 2;
                }else{
                    if(this.visited.has(this.genKey([node]))){
                        return 1;
                    }
                    else{
                        return 0;
                    }
                }
            }else return -1; // Delegate activation control if trajectory mode is off (minimises recomputations)
        },
        // Same as above but for chords
        chordStatus: function(nodes){
            if(this.trace){
                if(nodes.every(node => this.active.some(nodeB => nodeB.x==node.x && nodeB.y==node.y))){
                    return 2;
                }else if(this.visited.has(this.genKey(nodes))){
                    return 1;
                }else{
                    return 0;
                }
            }else{
                return -1;
            }
        },
        resetTrajectory: function(){
            // Remove the old trajectory from the trajectory bus
            let index = trajectoryBus.findIndex(e => e[0]===this.trajectory);
            if(index!==-1){
                trajectoryBus.splice(index);
            }
            // Setup new trajectory
            this.trajectory = [];
            this.active = [];
            this.lastChords = [];
            this.visited.clear();
            // Track new trajectory in bus
            trajectoryBus.push([this.trajectory,this]);
        },
        //Returns the node matching the note closest to the provided node
        closestNode(node,note){
            // Dumb way: enumerate all neighbours up to distance 3 (max for 12 tone Tonnetze)
            const d1 = [{x:0,y:1},{x:0,y:-1},{x:1,y:0},{x:-1,y:0},{x:-1,y:1},{x:1,y:-1}]; // Neighbours of distance 1
            const d2 = [{x:0,y:2},{x:1,y:1},{x:0,y:2},{x:0,y:-2},{x:-1,y:-1},{x:-2,y:0}, //z=0
                        {x:-1,y:2},{x:-2,y:1},{x:1,y:-2},{x:2,y:-1},{x:-2,y:2},{x:2,y:-2}]; // Neighbours of distance 2
            const d3 = [{x:0,y:3},{x:1,y:2},{x:2,y:1},{x:3,y:0},{x:0,y:-3},{x:-1,y:-2},{x:-2,y:-1},{x:-3,y:0},
                        {x:-3,y:3},{x:-3,y:2},{x:-3,y:1},{x:3,y:-3},{x:3,y:-2},{x:3,y:-1},
                        {x:-2,y:3},{x:-1,y:3},{x:2,y:-3},{x:1,y:-3}]; // Neighbours of distance 3
            if(mod(this.nodesToPitches([node])[0]-57,12)==note){
                return node;
            }
            for(neighbourList of [d1,d2,d3]){ //This should be enough as no distance should exceed 3
                for(nodeOffset of neighbourList){
                    let newNode={x:node.x+nodeOffset.x,y:node.y+nodeOffset.y};
                    if(mod(this.nodesToPitches([newNode])[0]-57,12)==note){
                        return newNode;
                    }
                }
            }
            console.warn("Couldn't find closest neighbour");
        },
        // Marks active chords as visited
        updateChords: function(){
            for(node of this.active){
                for(dnode of [{x:1,y:0},{x:0,y:1},{x:-1,y:1}]){
                    if(this.active.some(nodeB => nodeB.x==node.x+dnode.x && nodeB.y==node.y+dnode.y)){
                        let nodes = [node,{x:node.x+dnode.x,y:node.y+dnode.y}];
                        this.visited.add(this.genKey(nodes));
                    }
                }
                for(dnodes of [{x1:1,x2:0,y1:0,y2:1},{x1:-1,x2:0,y1:1,y2:1}]){
                    if(this.active.some(nodeB => nodeB.x==node.x+dnodes.x1 && nodeB.y==node.y+dnodes.y1) 
                    && this.active.some(nodeB => nodeB.x==node.x+dnodes.x2 && nodeB.y==node.y+dnodes.y2)){
                        let nodes = [node,{x:node.x+dnodes.x1,y:node.y+dnodes.y1},{x:node.x+dnodes.x2,y:node.y+dnodes.y2}];
                        this.visited.add(this.genKey(nodes));
                    }
                }
            }
            this.lastChords.push(Array.from(this.active))
        },
        hasNote: function(node, pitch){
            return mod(this.nodesToPitches([node])[0],12) === mod(pitch,12);
        },
        activateNode: function(node){
            this.trajectory.push(node);
            this.active.push(node);
            this.visited.add(this.genKey([node]));
            this.$parent.$emit('pan',logicalToSvg(node));
        },
        placeWithOrigin: function(pitch,origin){
            // Find which of the origin nodes corresponds to the pitch
            for(node of origin.id){
                if(this.hasNote(node,pitch)){
                    this.activateNode(node)
                    break
                }
            }
        },
        placeRecursive: function(notes){
            // Place with reference to a previous chord, trying from the most recent first
            for(it = this.lastChords.length-1 ; it>=0 ;it--){
                console.log(`Comparing to chord n°${it}`)
                let prevPositions = this.lastChords[it].map(node => ({note:this.node2Notes(node).id,coords:node}))
                if(this.placeNextToChord(notes,prevPositions)){
                    console.log(`Placed chord ${_count1} with reference to chord n°${it}`);
                    console.log(this.lastChords[it])
                    return true;
                }
            }
            return false;
        },
        placeFallback: function(pitches){
            notes = new Set(pitches);
            let success = false
            while(!success){
                // First version: consider distance from 2 arbitrary notes of the chords
                let note = notes.values().next().value;
                let reference = this.trajectory.length > 0 ? this.trajectory[this.trajectory.length-1] : {x:0,y:0}
                let node = this.closestNode(reference, note);
                notes.delete(note);
                this.activateNode(node);
                success = this.placeRestOfChord(new Set([{note:note,coords:node}]),notes);
            }
            if(success){
                console.log("Placed with fallback")
            }
            return success
        },
        placeRestOfChord: function(positionned, notes){
            // let positions = Array.isArray(positionned) ? positionned : [positionned];
            positions = positionned
            let hasConverged = false;
            console.log('Placing rest of chord')
            console.log(positionned)
            console.log(notes)
            while(!hasConverged){
                let placedThisIteration = new Set()
                for(note of notes){
                    for(position of positions){
                        let newPosition = this.placeNextToNote(note, position);
                        if(newPosition !== undefined){
                            console.log(`Found position for ${note}`)
                            positions.add(newPosition)
                            this.activateNode(newPosition.coords)
                            placedThisIteration.add(note)
                            break;
                        }
                    }
                }
                notes = notes.difference(placedThisIteration)
                hasConverged = (placedThisIteration.size == 0)
            }
            return (notes.size == 0);
        },
        placeNextToNote: function(note, position){
            console.log(`Comparing ${note} to ${position.note}`)
            function offset(coords,delta){
                return {x:coords.x+delta.x,y:coords.y+delta.y}
            }
            let interval = mod(note - position.note,12);
            console.log(`Interval is ${interval}`)
            index = this.intervals.indexOf(interval)
            if(index !== -1 ){
                return {note:note,coords:offset(position.coords,[{x:-1,y:0},{x:1,y:-1},{x:0,y:1}][index])}
            }
            interval = 12-interval;
            index = this.intervals.indexOf(interval)
            if(index !== -1 ){
                return {note:note,coords:offset(position.coords,[{x:1,y:0},{x:-1,y:1},{x:0,y:-1}][index])}
            }
            return undefined;
        },
        placeNextToChord: function(notes, positions){
            // First check for common notes
            // TODO: keep all common notes
            let matchingPosFull = positions.filter(position => notes.has(position.note))
            console.log(`Found ${matchingPosFull.length} common notes`)
            if(matchingPosFull.length == 0){
                // TODO: Check for distance 1
                return false
            }
            let matchingPosUnique = new Set()
            for(pos of matchingPosFull){
                if(notes.has(pos.note)){ // Only activate for the first match
                    console.log(`Placing note ${pos.note} at position ${pos.coords}`)
                    notes.delete(pos.note)
                    this.activateNode(pos.coords);
                    matchingPosUnique.add(pos);
                }
            }
            console.log(`Attempting to place rest of chords: ${notes}`)
            success = this.placeRestOfChord(matchingPosUnique, notes);

            return success
        },
        placeChord: function(pitches){
            // Don't bother placing pitches that are not on the Tonnetz
            let notes = new Set(pitches.map(pitch => mod(pitch - 9,12)).filter(note => this.isReachable(note)));
            console.log(`Placing chord with ${notes.size} notes`)
            let positionMap;
            if(notes.size > 0){
                success = this.placeRecursive(notes)
                if(! success){
                    success = this.placeFallback(notes);
                }
                if(! success){
                    console.warn("Failed to place notes", notes);
                }
            }
            console.log(`Placed chord ${_count1}`)
            _count1 += 1
        },
        addToTrajectory: function(pitches, origin){
            if(this.trace){
                if(origin){
                    this.placeWithOrigin(pitches[0],origin) // Pitches with origins are not batched
                }else{
                    this.placeChord(pitches);
                }
                this.updateChords();
            }
        },
        removeActive: function(pitches){
            if(this.trace){
                _countDel += 1;
                for(pitch of pitches){
                    let firstMatch = this.active.findIndex(node => mod(this.nodesToPitches([node]),12) === mod(pitch,12));
                    let node = this.active[firstMatch];
                    if(firstMatch !== -1){
                        this.active.splice(firstMatch,1);
                        this.trajectory.push(node)
                    }else{
                        console.log(`Couldn't remove pitch ${pitch} from active nodes`);
                    }
                }
            }
        },
        midiDispatch: function(midiEvent){
            if(this.trace && midiEvent.getChannel() !== 9){ // Ignore drums events
                if(midiEvent.isNoteOn()){
                    let pitch = midiEvent.getNote();
                    if(midiEvent.trace === false){
                        return
                    }
                    if(this.isTonnetzOrigin(midiEvent.origin)){
                        //If the origin is known, no need to wait for the rest of the chord
                        this.addToTrajectory([pitch], midiEvent.origin)
                    }else{
                        this.queueForClustering(pitch);
                    }
                }else if(midiEvent.isNoteOff()){
                    this.dequeueForClustering(midiEvent.getNote());
                }
            }
        },
        dequeueForClustering: function(pitch){
            if(this.noteBuffer.length>0){
                this.noteOffBuffer.push(pitch); // The noteOn could be in the buffer, so wait for next processing
            }else{
                this.removeActive([pitch]);
            }
        },
        queueForClustering: function(pitch){
            this.noteBuffer.push(pitch)
            //Override the current timer
            if(this.chordTimer){clearTimeout(this.chordTimer)};
            let this2 = this;
            this.chordTimer = setTimeout( () => this2.processBuffer(), this.delay)
        },
        processBuffer: function(){
            this.addToTrajectory(this.noteBuffer);
            this.noteBuffer.length=0; // Clear the buffer
            for(noteOffPitch of this.noteOffBuffer){
                this.removeActive([noteOffPitch]);
            }
            this.noteOffBuffer.length=0;
        },
        isTonnetzOrigin(origin){
            return origin && origin.parent === this;
        },
        isReachable(noteNumber){
            let tonnetzGCD = this.intervals.reduce(gcd,12);
            return ! (noteNumber%tonnetzGCD)
        }
    }
}

var Tonnetz_trajectory = true