<template>
    <div>
        <test ref="diag"
                v-bind:model-data="diagramData" 
                v-on:model-changed="modelChanged"
                v-on:changed-selection="changedSelection"
        ></test>
    </div>
</template>
<script>
import Test from '@/components/SampleGraph.vue'
export default {
    components:{
        Test
    },
    data() {
        return {
            diagramData: {  // passed to  as its modelData
            nodeDataArray: [
            { key: 1, text: "Alpha", color: "lightblue" },
            { key: 2, text: "Beta", color: "orange" },
            { key: 3, text: "Gamma", color: "lightgreen" },
            { key: 4, text: "Delta", color: "pink" }
            ],
            linkDataArray: [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 3, to: 4 }
            ]
        },
        }
    },
    methods:{
        model: function() { return this.$refs.diag.model(); },
        // tell the GoJS Diagram to update based on the arbitrarily modified model data
        updateDiagramFromData: function() { this.$refs.diag.updateDiagramFromData(); },
        // this event listener is declared on the <diagram>
        modelChanged: function(e) {
            console.log('test')
        //   if (e.isTransactionFinished) {  // show the model data in the page's TextArea
        //     this.savedModelText = e.model.toJson();
        //   }
        },
        changedSelection: function(e) {
            console.log(e)
        //   var node = e.diagram.selection.first();
        //   if (node instanceof go.Node) {
        //     this.currentNode = node;
        //     this.currentNodeText = node.data.text;
        //   } else {
        //     this.currentNode = null;
        //     this.currentNodeText = "";
        //   }
        },

    }
}
</script>
<style scoped>

</style>
