// Expandable credit screen
let creditScreen = {
    data: function(){return{
        expanded:false
    }},
    computed:{
        strings: function(){
            return this.$root.strings;
        }
    },
    template: `
        <div class="credits">
            <div class = "creditButton" @click="expanded=true">
                <span> {{strings.get('creditsButton')}} </span>
            </div>
            <div v-if="expanded">
                <div class="modal-background" @click="expanded=false"></div>
                <div class="modal">
                    <span v-html="strings.get('credits')"/>
                </div>
            </div>
        </div>
    `
}


var Tonnetz_credits = true;