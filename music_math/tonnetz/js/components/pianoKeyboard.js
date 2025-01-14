// A wrapper component for JZZ's keyboard element
let pianoKeyboard = {
    props:{
        id:{
            type:String,
            default: 'piano'
        },
        keybinds:{
            type:Boolean,
            default: false
        }
    },
    data:function(){return{
        piano:undefined
    }},
    template: `
        <div :id="id">
        </div>
    `,
    mounted: function(){
        this.piano = JZZ.input.Kbd(
            {
                at:this.id, 
                from:'C3', 
                to:'B7', 
                onCreate:function() {
                    this.getBlackKeys().setStyle({color:'#fff'});
                }
            });
        if(this.keybinds){
            this.piano.getKey('C5').setInnerHTML('<span class=inner>W</span>');
            this.piano.getKey('C#5').setInnerHTML('<span class=inner>S</span>');
            this.piano.getKey('D5').setInnerHTML('<span class=inner>X</span>');
            this.piano.getKey('D#5').setInnerHTML('<span class=inner>D</span>');
            this.piano.getKey('E5').setInnerHTML('<span class=inner>C</span>');
            this.piano.getKey('F5').setInnerHTML('<span class=inner>V</span>');
            this.piano.getKey('F#5').setInnerHTML('<span class=inner>G</span>');
            this.piano.getKey('G5').setInnerHTML('<span class=inner>B</span>');
            this.piano.getKey('G#5').setInnerHTML('<span class=inner>H</span>');
            this.piano.getKey('A5').setInnerHTML('<span class=inner>N</span>');
            this.piano.getKey('A#5').setInnerHTML('<span class=inner>J</span>');
            this.piano.getKey('B5').setInnerHTML('<span class=inner>M</span>');
        }
        for (key of this.piano.getKeys().keys){
            this.piano.getKey(key).setStyle({},{backgroundColor: colorMap[mod(Number(key)+3, 12)]})
        }
        midiBus.midiThru.connect(this.piano);
        this.piano.connect(midiBus.midiThru);
    }
}

var Tonnetz_piano = true