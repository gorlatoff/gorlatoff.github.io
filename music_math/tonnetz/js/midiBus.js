// Empty Vue instance to act as a bus for note interaction Events
var midiBus=new Vue({
    data: function(){return {
        midiThru:JZZ.Widget()
    }},
    methods:{
        connect: function(output){
            this.midiThru.connect(output)
        },
        disconnect: function(output){
            this.midiThru.disconnect(output)
        }
    }
});

function connect_out(name){
    let out = undefined;
    for (outdevice of JZZ().info().inputs){
        if(outdevice.name.includes(name)){
            console.log(`Found device matching ${name}`)
            out = JZZ().openMidiOut(outdevice)
            break;
        }
    }
    if(name === undefined){
        out = JZZ().openMidiOut()
    }
    if(out !== undefined){
        midiBus.connect(out)
        // midiBus.midiThru.disconnect(proto.synth)
        proto.synth.close()
    }
}

var Tonnetz_midiBus = true;