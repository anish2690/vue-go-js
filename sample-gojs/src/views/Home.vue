<template>
<div id="components-demo">
 <div id="myDiagramDiv" style="border: solid 1px blue; width:100%; height:800px"></div>
</div>
</template>
<script>
import * as go from 'gojs'

export default {
  data() {
    return {
        diagram: '',
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
  mounted() {
    this.diagram = new go.Diagram("myDiagramDiv");
    this.diagram.initialContentAlignment = go.Spot.Center; // make graph center
    // this.diagram.layout = go.TreeLayout, { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal };
    

    this.diagram.model = new go.GraphLinksModel(
     this.diagramData.nodeDataArray, // nodes 
     this.diagramData.linkDataArray // linking
    );
  }
}
 
</script>

<style scoped>

</style>
