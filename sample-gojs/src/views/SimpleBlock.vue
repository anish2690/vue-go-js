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
import Test from '@/components/BlockDiagram.vue'
export default {
    components:{
        Test
    },
    data() {
        return {
            diagramData: {  // passed to  as its modelData
            nodeDataArray: [
            { key: 1, header: "Supplier", text: "Planned Order Variations", footer: "Retailer", role: "b" },
            { key: 2, header: "Supplier", text: "Order & Delivery Variations", footer: "Retailer", role: "t", loop: true },
            { key: 3, header: "Supplier", isGroup: true, footer: "Shipper", role: "b" },
            { key: 4, header: "Supplier", text: "Planned Order Variations", footer: "Retailer", role: "b", group: 3 },
            { key: 5, header: "Supplier", text: "Order & Delivery Variations", footer: "Retailer", role: "t", group: 3 },
            { key: 13, header: "Supplier", isGroup: true, footer: "Shipper", role: "b", loop: true },
            { key: 14, header: "Supplier", text: "Planned Order Variations", footer: "Retailer", role: "b", group: 13 },
            { key: 15, header: "Supplier", text: "Order & Delivery Variations", footer: "Retailer", role: "t", group: 13 }
            ],
            linkDataArray: [
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 2, to: 13 },
            { from: 4, to: 5 },
            { from: 14, to: 15 }
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
