/* Loads libraries required by the application using fallback
First attempt to retrieve them online, otherwise load local copies */

// Find the script's directory to use paths relative to it and not the html
let scripts= document.getElementsByTagName('script');
let path= scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
let mydir= path.split('/').slice(0, -1).join('/')+'/';  // remove last filename part of path

fallback.load({
    //Vue: Main framework for reactive elements
    Vue: [
        'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js',
        mydir+'../lib/Vue/vue.min.js'
    ],
    //JZZ: Midi library
    JZZ: [
        'https://cdn.jsdelivr.net/npm/jzz@0.8.8/javascript/JZZ.min.js',
        mydir+'../lib/JZZ/jzz.js'
    ],
    //JZZ.Tiny: Basic Synthetizer
    'JZZ.synth.Tiny': [
        'https://cdn.jsdelivr.net/npm/jzz-synth-tiny',
        mydir+'../lib/JZZ/JZZ.synth.Tiny.min.js'
    ],

    //JZZ.Tiny: Basic Synthetizer
    'JZZ.synth.MIDIjs': [
        "https://jazz-soft.net//script/JZZ.synth.MIDIjs.js"
    ],
    'MIDI':[
        'https://jazz-soft.net//script/MIDI.js'
    ],

    //JZZ.Kbd: Keyboard bindings and virtual piano keyboard
    'JZZ.input.Kbd': [
        'https://cdn.jsdelivr.net/npm/jzz-input-kbd',
        mydir+'../lib/JZZ/jzz-input-kbd.js'
    ],
    //JZZ.SMF: Standard Midi File support
    'JZZ.MIDI.SMF': [
        'https://cdn.jsdelivr.net/npm/jzz-midi-smf',
        mydir+'../lib/JZZ/jzz-midi-smf.js'
    ],
    TweenLite: [
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenLite.min.js',
        mydir+'../lib/GSAP'
    ],
    //TODO: Use proper submodule structure
    // Tonnetz submodules
    // Small hack: these variables are defined to let fallback know that the module loaded
    'Tonnetz_utils':[
        mydir+'utils.js'
    ],
    'Tonnetz_l12n':[
        mydir+'l12n.js'
    ],
    'Tonnetz_mixins':[
        mydir+'mixins/clickMixins.js'
    ],
    'Tonnetz_trajectory':[
        mydir+'mixins/trajectory.js'
    ],
    'Tonnetz_dragZoom':[
        mydir+'decorators/dragZoom.js'
    ],
    'Tonnetz_tonnetzLike':[
        mydir+'components/tonnetzLike.js'
    ],
    'Tonnetz_midiBus':[
        mydir+'midiBus.js'
    ],
    'Tonnetz_tonnetzView':[
        mydir+'components/tonnetzView.js'
    ],
    'Tonnetz_infoPanel':[
        mydir+'components/infoPanel.js'
    ],
    'Tonnetz_transformations':[
        mydir+'components/transformations.js'
    ],
},{
    shim:{
        // Wait for JZZ to be loaded before loading its submodules
        'JZZ.synth.Tiny': ['JZZ'],
        'JZZ.synth.MIDIjs': ['JZZ','MIDI'],
        'JZZ.input.Kbd': ['JZZ'],
        'JZZ.MIDI.SMF': ['JZZ'],
        'Tonnetz_tonnetzLike': ['Tonnetz_mixins'],
        'Tonnetz_midiBus': ['Vue','JZZ'],
        'Tonnetz_ascii': ['Tonnetz_midiBus'],
        'Tonnetz_tonnetzView': ['Tonnetz_tonnetzLike','Tonnetz_infoPanel'],
    }
}
)
