// ============================================================================
// i18n Strings

function resolve(path, obj=self, separator='.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

const strings = {
    data:{
        en: {
            title: 'The Tonnetz',
            subtitle: 'One key – many representations',
            dual: 'Dual',
            reset: 'Reset',
            load: 'Load Midi File',
            start: '⏺ Start Recording',
            stopRecord: '⏺⏹ Stop Recording',
            play: '▶️ Play',
            stopPlay: '⏹ Stop Playing',
            pause: '⏸ Pause',
            rotate: 'Rotate 180°',
            translate: 'Translate',
            semitones: 'semitones',
            export: 'Export',
            connected: 'This Tonnetz is non-connected and doesn’t contain every note.',
            notes: ['A', 'A♯', 'B', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'],
            intervalNames : ['', 'b9', '9', '', '', 'sus4', 'b5', '', '#5', '6', '7', '△7'],
            minorSymbol: 'm',
            infos:{
                tonnetz: `<p>
                The Tonnetz, or “network of tones”, is a theoretical model used in transformational music analysis to represent the harmonic relationships between pitches and chords in the equal-tempered system. It displays the interconnections between notes through the choice of two generating intervals, usually corresponding to the minor and major third.
</p><p>
In this specific Tonnetz, also indicated with (3,4,5), notes are arranged in a triangular grid where the diagonal axes represent minor and major thirds and the vertical axis corresponds to the perfect fifth. Triangles correspond to major and minor chords and three main elementary transformations enable to transform a given chord by keeping two notes and changing the third one by an interval of semitone or tone.
</p><p>
These transformations are called the Relative (R), the Parallel (P) and the Leading-Tone exchange (L). They transform for example a C major chord into its relative A minor chord (and vice-versa), a C major chord into its parallel C minor (and vice-versa) and, finally, a C major chord into the E minor chord (and vice-versa). The traditional (3,4,5) Tonnetz naturally extends to generic (a,b,c) Tonnetze where the numbers a and b correspond to the diagonal axes that generate the new harmonic grid.
</p><p>
In the case of the (3,4,5) Tonnetz, the two types of triangles correspond to minor chords – the left-pointing triangles having intervallic structure equal to (3,4,5) - and major chords – the right-pointing triangles having intervallic structure equal to (4,3,5).
</p><p>
In the generalized (a,b,c) Tonnetz, the left-pointing triangles will correspond to a chord whose intervallic structure is equal to (a,b,c) and the right-pointing will be their symmetrical, having intervallic structure equal to (b,a,c). For example, the (2,3,7) Tonnetz will have the diagonal axes generated respectively by the whole-tone and the minor third intervals. A left-pointing triangle of the grid will correspond to a chord containing the notes C, D, F.
</p>`,
                chicken: `<p>

 

The Chicken-Wire representation is the dual one of the triangular grid. It correspond to the hexagonal tiling of the harmonic space obtained by replacing each triangle by the type of chord it represents. Two chords are connected by a segment when there is a parsimonious transformation between them such as the relative (R), the parallal (P) and the leading-tone exchange.

</p><p>

In this representation, chords are therefore represented as vertices of the hexagonal grid and the pitches are the faces of the different hexagons. For example, the note C is the face of the hexagon whose vertices are the six following chords: C major, A minor, F major, F min, G# major, C minor.

</p><p>

 

Major chords are represented in normal font whereas minor chord are represented in italics. This convention also applies to the case of generic three-note chords in (a,b,c) Tonnetze. Every chord in normal font is connected with three chords in italics font representing the three possible ways to transform the initial chord in a new chord via a parsimonious transformation keeping two notes invariant and changing only one note by a semi-tone or a tone.

</p>

`
            },
            credits: `
            <h2>Credits</h2>

            <p>Conceived and developped by Corentin Guichaoua and Moreno Andreatta</p>
            
            <h2>Acknowledgments</h2>
            
            <p>Thanks to Louis Bigo for the original Hexachord software. <br>
            
            Thanks to Philipp Legner for improving on the initial visual design and his feedback. <br>
            
            Thanks to people who helped translate the software to other languages:
                <ul>
                <li>German: Philipp Legner
                <li>Hindi: Nilesh Trivedi
                </ul>
            
            
            Sample MIDI tracks are interpretted by Moreno Andreatta. <br>
            
            Thanks to all collaborators for inspiration. <br>
            
            Thanks to USIAS / University of Strasbourg / IRMA / IRCAM for financial support.</p>
            
            <h2>Citation</h2>
            <p><a href="https://www.gitlab.com/guichaoua/web-hexachord">www.gitlab.com/guichaoua/web-hexachord</a> <br>
            Guichaoua C., J-L. Besada, E. Bisesi, M. Andreatta (2021), "The Tonnetz Environment: A Web Platform for Computer-aided "Mathemusical" Learning and Research", CSEDU (1), p. 680-689</p>
            `,
            creditsButton: "Credits",
            interval: "Interval",
            content: "Content",
            info: "Info",
            infoClose: "Close"
        },
    },
    get(key){
        let string = resolve(key,this.data[this.activeLang]);
        if(string===undefined){
            console.warn(`No localisation string for "${key}", defaulting to English`)
            string = resolve(key,this.data.en);
            if(string===undefined){
                console.error(`Unknown localisation string "${key}"`)
                string = "<Missing>"
            }
        }
        return string
    },
}

const search = location.search.match(/hl=(\w*)/);
const language = strings.hasOwnProperty(search) ? search[1] : 'en';

var Tonnetz_l12n = true