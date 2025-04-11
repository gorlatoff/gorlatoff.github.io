// A simple comoponent to display the name of the current chord played

let chordDisplay = {
	props: {
		notes: Array
	},
	computed: {
		//Returns the number of active notes
		noteCount: function (){
		    return this.notes.reduce( (count,note) => (note.count>0 ? count+1 : count),0);
		},
		strings: function(){return this.$root.strings},
		calculateChord: function (){
			let string = "";
			let i = 0;
			if (this.noteCount <= 2)
				return string;
			let root = 0;
			while (this.notes[root].count == 0) 
				root++;
			//string += this.strings.get(['notes',root])
			let m = false;
			// find 3rd
			if (this.notes[(root+3)%12].count > 0) {
				m = true;
			}
			// 1st inversion
			if (m && this.notes[(root+8)%12].count > 0) {
				root = (root+8)%12;
				m = false;
			} else if (!m && this.notes[(root+5)%12].count == 0 && this.notes[(root+9)%12].count > 0) {
				root = (root+9)%12;
				m = true;
			}
			// 2nd inversion
			if (this.notes[(root+5)%12].count > 0) {
				if (this.notes[(root+8)%12].count > 0) {
					root = (root+5)%12;
					m = true
				} else if (this.notes[(root+9)%12].count > 0) {
					root = (root+5)%12;
				}
			}
			string = this.strings.get(['notes',root]) + (m? this.strings.get("minorSymbol") : "")
			// extra notes
			for (let i = 0; i < 12; i++) {
				if (this.notes[(root+i)%12].count > 0) {
					string += this.strings.get(['intervalNames',i]);
				}
			}
			return string;
		}
	},
	template: `
		<div id="chord">{{ calculateChord }}</div>
	`
}

var Tonnetz_chord = true
