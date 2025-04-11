//Component to handle the keyboard input

let asciiBindings = {
    props:{
        bindMap:{
            default: function(){return {
                Z:'C5', S:'C#5', X:'D5', D:'D#5', C:'E5', V:'F5',
                G:'F#5', B:'G5', H:'Ab5', N:'A5', J:'Bb5', M:'B5'
            }}
        }
    },
    data: function(){return{
        JzzAscii: JZZ.input.ASCII(this.bindMap),
    }},
    mounted: function(){
        this.JzzAscii.connect(midiBus.midiThru);
    },
    //Dummy template 
    template:`
        <div style="display: none"/>
    `
}

var Tonnetz_ascii = true;