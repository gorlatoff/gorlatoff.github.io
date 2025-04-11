let infoPanel = {
    props:{
        infoType:{
            type:String,
            required:true
        }
    },
    data:function(){return {
        expanded:false
    }},
    computed:{
        strings: function(){
            return this.$root.strings;
        },
        text: function(){
            return this.strings.get(`infos.${this.infoType}`)
        },
        buttonText: function(){
            if(this.expanded){
                return this.strings.get("infoClose")
            }else{
                return this.strings.get("info")
            }
        }
    },
    methods:{
        toggle: function(){
            this.expanded = !this.expanded;
        }
    },
    template:`
        <div class="info" :class="{infoExpanded: expanded}">
            <div @click="toggle" class="infoButton">{{buttonText}}</div>
            <div class="infoExplain"> <span v-html="text"/></div>
        </div>
    `
}


var Tonnetz_infoPanel = true;