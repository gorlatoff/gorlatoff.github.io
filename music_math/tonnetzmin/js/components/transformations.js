// Component that handles transformations

let transformations = {
    data:function(){return {
        translateInterval:1,
        translateRange: Array.from(range(-11,12)),
        rotateCenter:'auto'
    }},
    computed:{
        strings: function(){return this.$root.strings},
        rotateCenters: function(){
            let A5 = 81;
            let result = [];
            for(i of range(0,12)){
                result.push({value:A5+i/2,name:`${this.strings.get('notes.0')} ⇄ ${this.strings.get(['notes',i])}`});
            }
            return result;
        }
    },
    methods:{
        translate: function(translate=1){
            this.$emit('stop')
            this.translateTrajectory(translate);
            // Does the player really need to be reassigned ?
            this.player=this.SMF.player();
            this.player.connect(midiBus.midiThru);

            this.player.play();
        },
        //Simple version operating on pitches alone
        rotateTrajectory : function (SMF,symmetryCenter) {
            for (SMFTrack of SMF){
                for (SME of SMFTrack){
                    let note = SME.getNote();
                    if(note !== undefined){
                        if (symmetryCenter === undefined || symmetryCenter === 'auto'){
                            symmetryCenter = note;
                        }else {
                            note = this.rotateNote(note, symmetryCenter);
                        }
                        SME.setNote(note);
                    }
                }
            }
        },
        rotateNote: function rotateNote(note, symmetryCenter) {
            if (SME.getChannel() != 9){ // Ignore drums
                noteIntervalClass = mod(2 * (symmetryCenter - note), 12);
                // If the interval is a fifth or more, take the descending interval instead
                if (noteIntervalClass > 6) {
                    note += noteIntervalClass - 12;
                } else {
                    note += noteIntervalClass;
                }
            }
            return note;
        },
        // Transposes a recording by a given number of semitones
        translateTrajectory : function (SMF,translate) {
            for (SMFTrack of SMF){
                for (SME of SMFTrack){
                    let note = SME.getNote();
                    if(note !== undefined){
                        SME.setNote(note+translate);
                    }
                }
            }
        },
    },
    template: `
    <div>
        <div>
            <button id=rotate @click='$emit("transform",rotateTrajectory,[rotateCenter])'>{{ strings.get('rotate') }}</button>
            <select v-model.number="rotateCenter">
                <option v-for="center in rotateCenters" :value="center.value"> {{ center.name }} </option>
            </select>
        </div>
        <br>
        <div>
            <button id=translate @click='$emit("transform",translateTrajectory,[translateInterval])'>{{ strings.get('translate') }}</button>
            <select v-model.number="translateInterval">
                <option v-for="tr in translateRange"> {{ tr }} </option>
            </select> {{ strings.get('semitones') }}
        </div>
    </div>
    `
}




var Tonnetz_transformations = true;