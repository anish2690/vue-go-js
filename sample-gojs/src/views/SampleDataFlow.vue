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
import Test from '@/components/DataFlow.vue'
export default {
    components:{
        Test
    },
    data() {
        return {
            diagramData: { "class": "go.GraphLinksModel",
            "nodeCategoryProperty": "type",
            "linkFromPortIdProperty": "frompid",
            "linkToPortIdProperty": "topid",
            "nodeDataArray": [
            {"key":1, "type":"Table", "name":"Product",  "critical": "false"},
            {"key":2, "type":"Table", "name":"Sales", "critical": "false"},
            {"key":3, "type":"Table", "name":"Period", "critical": "false"},
            {"key":4, "type":"Table", "name":"Store", "critical": "false"},
            {"key":11, "type":"Join", "name":"Product, Class", "critical": "false"},
            {"key":12, "type":"Join", "name":"Period"},
            {"key":13, "type":"Join", "name":"Store"},
            {"key":21, "type":"Project", "name":"Product, Class"},
            {"key":31, "type":"Filter", "name":"Boston, Jan2014"},
            {"key":32, "type":"Filter", "name":"Boston, 2014"},
            {"key":41, "type":"Group", "name":"Sales"},
            {"key":42, "type":"Group", "name":"Total Sales"},
            {"key":51, "type":"Join", "name":"Product Name"},
            {"key":61, "type":"Sort", "name":"Product Name"},
            {"key":71, "type":"Export", "name":"File"}
            ],
            "linkDataArray": [
            {"from":1, "frompid":"OUT", "to":11, "topid":"L"},
            {"from":2, "frompid":"OUT", "to":11, "topid":"R"},
            {"from":3, "frompid":"OUT", "to":12, "topid":"R"},
            {"from":4, "frompid":"OUT", "to":13, "topid":"R"},
            {"from":11, "frompid":"M", "to":12, "topid":"L"},
            {"from":12, "frompid":"M", "to":13, "topid":"L"},
            {"from":13, "frompid":"M", "to":21},
            {"from":21, "frompid":"OUT", "to":31},
            {"from":21, "frompid":"OUT", "to":32},
            {"from":31, "frompid":"OUT", "to":41},
            {"from":32, "frompid":"OUT", "to":42},
            {"from":41, "frompid":"OUT", "to":51, "topid":"L"},
            {"from":42, "frompid":"OUT", "to":51, "topid":"R"},
            {"from":51, "frompid":"OUT", "to":61},
            {"from":61, "frompid":"OUT", "to":71}
            ]}
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
