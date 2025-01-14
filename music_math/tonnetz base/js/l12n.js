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
        de: {
            title: 'Das Tonnetz',
            subtitle: 'Ein Klang – viele Darstellungen',
            dual: 'Dual',
            reset: 'Zurücksetzen',
            load: 'Midi Datei Laden',
            start: '⏺ Aufnehmen',
            stopRecord: '⏺⏹ Aufnahme Stoppen',
            play: '▶️ Abspielen',
            stopPlay: '⏹ Abspiel Stoppen',
            pause: '⏸ Pause',
            rotate: '180° Rotieren',
            translate: 'Verschieben',
            export: 'Exportieren', // Needs checking
            connected: 'Dieses Tonnetz ist nicht verbunden, und enthält nicht alle Noten.',
            notes: ['A', 'B', 'H', 'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯'],
            info: "Info",
            infoClose: "Schließen",
            infos:{
                tonnetz: `
                <p>

                Das Tonnetz ist ein theoretisches Modell, das in der transformationale Musikanalyse verwendet wird, um die harmonischen Beziehungen zwischen Tonhöhen und Akkorden im gleichtemperierten System darzustellen. Es zeigt die Verbindungen zwischen den Tönen durch die Wahl von zwei erzeugenden Intervallen, die der kleinen und großen Terz entsprechen.

</p><p>

In diesem speziellen Tonnetz, das auch mit (3,4,5) bezeichnet wird, sind die Noten in einem dreieckigen Raster angeordnet, wobei die diagonalen Achsen kleine und große Terzen darstellen und die vertikale Achse der perfekten Quinte entspricht. Die Dreiecke entsprechen den Dur- und Moll-Akkorden, und drei elementare Haupttransformationen ermöglichen es, einen gegebenen Akkord umzuwandeln, indem zwei Noten beibehalten und die dritte um ein Intervall von Halbton oder Ton verändert wird.

</p><p>

Diese Transformationen werden Relativ (R), Parallel (P) und Leittonwechsel (L) genannt. Sie verwandeln zum Beispiel einen C-Dur-Akkord in seinen relativen a-Moll-Akkord (und umgekehrt), einen C-Dur-Akkord in seinen parallelen c-Moll-Akkord (und umgekehrt) und schließlich einen C-Dur-Akkord in den e-Moll-Akkord (und umgekehrt). Das traditionelle (3,4,5)-Tonnetz lässt sich natürlich zu generischen (a,b,c)-Tonnetze erweitern, bei denen die Zahlen a und b den Diagonalachsen entsprechen, die das neue harmonische Gitter erzeugen.

</p><p>

Im Fall des (3,4,5) Tonnetzes entsprechen die beiden Dreieckstypen Moll-Akkorden - die nach links zeigenden Dreiecke mit der intervallischen Struktur gleich (3,4,5) - und Dur-Akkorden - die nach rechts zeigenden Dreiecke mit der intervallischen Struktur gleich (4,3,5).

</p><p>

Im verallgemeinerten (a,b,c) Tonnetz entsprechen die nach links zeigenden Dreiecke einem Akkord, dessen intervallische Struktur gleich (a,b,c) ist, und die nach rechts zeigenden Dreiecke sind symmetrisch und haben die intervallische Struktur (b,a,c). Beim (2,3,7) Tonnetz zum Beispiel werden die diagonalen Achsen durch die Ganzton- bzw. die kleinen Terzintervalle gebildet. Ein nach links zeigendes Dreieck des Gitters entspricht einem Akkord, der die Töne C, D, F enthält.

</p>
                `,
                chicken: `<p>

Die Chicken-Wire-Darstellung ist die duale Darstellung des Dreiecksgitters. Sie entspricht der hexagonalen Kachelung des harmonischen Raums, die man erhält, indem man jedes Dreieck durch den entsprechenden Akkordtyp  ersetzt. Zwei Akkorde sind durch ein Segment verbunden, wenn zwischen ihnen eine sparsame Transformation wie die Relative (R), die Parallele (P) und der Leittonwechsel besteht.

</p><p>

In dieser Darstellung werden die Akkorde also als Eckpunkte des sechseckigen Gitters dargestellt, und die Tonhöhen sind die Flächen der verschiedenen Sechsecke. Zum Beispiel ist die Note C die Seite des Sechsecks, dessen Eckpunkte die sechs folgenden Akkorde sind: C-Dur, A-Moll, F-Dur, F-Moll, Gis-Dur, C-Moll.

</p><p>

Dur-Akkorde werden in normaler Schrift dargestellt, während Moll-Akkorde werden in kursiv dargestellt. Diese Konvention gilt auch für den Fall der allgemeinen Dreiklangsakkorde in (a,b,c) Tonnetze. Jeder Akkord in normaler Schrift ist mit drei Akkorden in kursiver Schrift verbunden, die die drei Möglichkeiten darstellen, den ursprünglichen Akkord in einen neuen Akkord umzuwandeln, und zwar durch eine sparsame Transformation, bei der zwei Noten unverändert bleiben und nur eine Note um einen Halbton oder einen Ton verändert wird.

</p>`
            },
            semitones: "Halbton",
            creditsButton: "Krediten",
            credits:`
            <h2>Krediten</h2>
            <p>Konzipiert und entwickelt von Corentin Guichaoua und Moreno Andreatta</p>

<h2>Danksagungen</h2>
<p>Danke an Louis Bigo für die ursprüngliche Hexachord-Software. <br>

Danke an Philipp Legner für die Verbesserung des ursprünglichen visuellen Designs und sein Feedback. <br>

Danke an die Personen, die geholfen haben, die Software in andere Sprachen zu übersetzen:

<ul>
<li>Deutsch: Philipp Legner
<li>Hindi: Nilesh Trivedi
</ul>
Die Beispiel-MIDI-Tracks werden von Moreno Andreatta interpretiert und im Aufnahmestudio der Universität Straßburg aufgenommen. <br>

Danke an alle Mitarbeiter für die Inspiration. <br>

Danke an USIAS / Universität Straßburg / IRMA / IRCAM für die finanzielle Unterstützung.</p>

<h2>Zitation</h2>
<p><a href="https://www.gitlab.com/guichaoua/web-hexachord">www.gitlab.com/guichaoua/web-hexachord</a> <br>
Guichaoua C., J-L. Besada, E. Bisesi, M. Andreatta (2021), "The Tonnetz Environment: A Web Platform for Computer-aided 'Mathemusical' Learning and Research", CSEDU (1), p. 680-689</p>
            `
        },
        fr: {
            title: 'Le Tonnetz',
            subtitle: 'Note unique — Représentations nombreuses',
            dual: 'Dual',
            reset: 'Réinitialiser',
            load: 'Charger des données Midi',
            start: '⏺ Enregistrer',
            stopRecord: "⏺⏹ Arrêter l'enregistrement",
            play: '▶️ Lecture',
            stopPlay: '⏹ Arrêt',
            pause: '⏸ Pause',
            rotate: 'Rotation à 180°',
            translate: 'Translation',
            export: 'Exporter',
            connected: "Ce Tonnetz n'est pas connexe et ne contient pas toutes les notes.",
            notes: ['La', 'La♯', 'Si', 'Do', 'Do♯', 'Ré', 'Ré♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯'],
            interval: "Intervalle",
            content: "Contenu",
            infos:{
                tonnetz:`<p>
                Le Tonnetz, ou « réseau de notes », est un modèle théorique utilisé dans l'analyse musicale transformationnelle pour représenter les relations harmoniques entre les hauteurs et les accords dans le système tempéré égal. Il affiche les interconnexions entre les notes grâce au choix de deux intervalles générateurs, correspondant généralement à la tierce mineure et à la tierce majeure.
</p><p>
Dans ce Tonnetz spécifique, également indiqué par (3,4,5), les notes sont disposées dans une grille triangulaire où les axes diagonaux représentent les tierces mineures et majeures et l'axe vertical correspond à la quinte parfaite. Les triangles correspondent aux accords majeurs et mineurs et trois transformations élémentaires principales permettent de transformer un accord donné en conservant deux notes et en changeant la troisième par un intervalle d'un demi-ton ou d'un ton.
</p><p>
Ces transformations sont appelées Relative (R), Parallèle (P) et Échange de note sensible (L). Elles transforment, par exemple, un accord de Do majeur en son relatif La mineur (et vice-versa), un accord de Do majeur en son parallèle Do mineur (et vice-versa) et, enfin, un accord de Do majeur en Mi mineur (et vice-versa). Le Tonnetz traditionnel (3,4,5) s'étend naturellement aux Tonnetze génériques (a,b,c) où les nombres a et b correspondent aux axes diagonaux qui génèrent la nouvelle grille harmonique.
</p><p>
Dans le cas du Tonnetz (3,4,5), les deux types de triangles correspondent aux accords mineurs – les triangles pointant vers la gauche ayant une structure intervallique égale à (3,4,5) - et aux accords majeurs – les triangles pointant vers la droite ayant une structure intervallique égale à (4,3,5).
</p><p>
Dans le Tonnetz généralisé (a,b,c), les triangles pointant vers la gauche correspondront à un accord dont la structure intervallique est égale à (a,b,c) et ceux pointant vers la droite seront leur symétrique, ayant une structure intervallique égale à (b,a,c). Par exemple, le Tonnetz (2,3,7) aura les axes diagonaux générés respectivement par les intervalles de ton entier et de tierce mineure. Un triangle pointant vers la gauche de la grille correspondra à un accord contenant les notes Do, Ré, Fa.
</p>
`,
                chicken:`<p>
La représentation en "grillage" (chicken-wire) est la représentation duale de la grille triangulaire. Elle correspond au pavage hexagonal de l'espace harmonique obtenu en remplaçant chaque triangle par le type d'accord qu'il représente. Deux accords sont reliés par un segment lorsqu'il existe une transformation parcimonieuse entre eux, telle que la Relative (R), la Parallèle (P) et l'Échange de note sensible (L).
</p><p>
Dans cette représentation, les accords sont donc représentés comme les sommets de la grille hexagonale, et les hauteurs sont les faces des différents hexagones. Par exemple, la note Do est la face de l'hexagone dont les sommets sont les six accords suivants : Do majeur, La mineur, Fa majeur, Fa mineur, Sol♯ majeur, Do mineur.
</p><p>
Les accords majeurs sont représentés en écriture normale tandis que les accords mineurs sont représentés en italique. Cette convention s'applique également dans le cas des accords généraux de trois notes dans les Tonnetze (a,b,c). Chaque accord en écriture normale est relié à trois accords en italique représentant les trois manières possibles de transformer l'accord initial en un nouvel accord par une transformation parcimonieuse, en gardant deux notes inchangées et en modifiant seulement une note d'un demi-ton ou d'un ton.
</p>`
            },
            info: "Info",
            infoClose: 'Fermer',
            creditsButton: 'Crédits',
            semitones: 'demi-tons',
            credits:`
            <h2>Credits</h2>
            <p>Conçu et développé par Corentin Guichaoua et Moreno Andreatta</p>

<h2>Remerciements</h2>
<p>Merci à Louis Bigo pour le logiciel Hexachord original. <br>

Merci à Philipp Legner pour l'amélioration du design visuel initial et ses retours. <br>

Merci aux personnes qui ont aidé à traduire le logiciel dans d'autres langues :

<ul>
<li>Allemand : Philipp Legner
<li>Hindi : Nilesh Trivedi
</ul>
Les pistes MIDI d'exemple sont interprétées par Moreno Andreatta et enregistrées au studio d'enregistrement de l'Université de Strasbourg. <br>

Merci à tous les collaborateurs pour l'inspiration. <br>

Merci à USIAS / Université de Strasbourg / IRMA / IRCAM / CNRS pour le soutien financier.</p>

<h2>Citation</h2>
<p><a href="https://www.gitlab.com/guichaoua/web-hexachord">www.gitlab.com/guichaoua/web-hexachord</a> <br>
Guichaoua C., J-L. Besada, E. Bisesi, M. Andreatta (2021), "The Tonnetz Environment: A Web Platform for Computer-aided 'Mathemusical' Learning and Research", CSEDU (1), p. 680-689</p>
            `,
        },
        hi: {
            title: 'सरगम',
            subtitle: 'एक स्वर, रूप अनेक',
            dual: 'Dual',
            reset: 'Reset',
            load: 'मिडी फाइल खोलें',
            start: '⏺ रिकॉर्डिंग शुरू करें',
            stopRecord: '⏺⏹ रिकॉर्डिंग ख़त्म करें',
            play: '▶️ Play',
            stopPlay: '⏹ Stop Playing',
            pause: '⏸ Pause',
            rotate: '180° पलटें',
            translate: 'अनुवाद करें',
            export: 'Export', // Needs translation
            connected: 'इस जोड़ में सभी स्वर नहीं है.',
            notes: ['ध', 'निb', 'नि', 'सा', 'रेb', 'रे', 'गb', 'ग', 'म', 'पb', 'प', 'धb']
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
    setLanguage(lang){
        if(!this.data[lang]){
            console.log(this.data)
            console.warn(`Invalid language option "${lang}", defaulting to English`);
            this.activeLang='en'
        }else{
            this.activeLang=lang;
        }
    }
}

const search = location.search.match(/hl=(\w*)/);
const language = strings.hasOwnProperty(search) ? search[1] : 'en';

strings.setLanguage(language);


let languageSelector = {
    props:{
        value:{
            type:String
        },
        languages:{
            type:Array,
            required:true
        }
    },
    template:`
        <div class="languageSwitcher">
            <div v-cloak v-for="lang of languages" 
            @click="$emit('input',lang)">
                {{ lang }}
            </div>
        </div>
    `
}

var Tonnetz_l12n = true