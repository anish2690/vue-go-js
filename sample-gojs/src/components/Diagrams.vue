<template>
<div id="components-demo">
 <div id="myDiagramDiv" style="border: solid 1px blue; width:100%; height:800px"></div>
</div>
</template>
<script>
import * as go from 'gojs'
var $ = go.GraphObject.make;
export default {
  props: ["modelData"], 
  data() {
    return {
        diagram: '',
        //  diagramData: {  // passed to  as its modelData
        //   nodeDataArray: [
        //     { key: 1, text: "Alpha", color: "lightblue" },
        //     { key: 2, text: "Beta", color: "orange" },
        //     { key: 3, text: "Gamma", color: "lightgreen" },
        //     { key: 4, text: "Delta", color: "pink" }
        //   ],
        //   linkDataArray: [
        //     { from: 1, to: 2 },
        //     { from: 1, to: 3 },
        //     { from: 3, to: 4 }
        //   ]
        // },
    }
  },
  mounted() {
    this.diagram = new go.Diagram("myDiagramDiv");
    this.diagram.initialContentAlignment = go.Spot.Center; // make graph center
    this.diagram.layout = $(go.TreeLayout, { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal });
    this.diagram.undoManager.isEnabled = true
    this.diagram.ModelChanged = function(e) { self.$emit("model-changed", e); };
    this.diagram.ChangedSelection = function(e) { self.$emit("changed-selection", e); }
    this.diagram.nodeTemplate =
          $(go.Node, "Auto",
          $(go.Shape,
            {
              fill: "white", strokeWidth: 0,
              portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer"
            },
              new go.Binding("fill", "color")),
            $(go.TextBlock,
              { margin: 8, editable: true },
              new go.Binding("text").makeTwoWay())
          );

    this.diagram.linkTemplate =
          $(go.Link,
            { relinkableFrom: true, relinkableTo: true },
            $(go.Shape),
            $(go.Shape, { toArrow: "OpenTriangle" })
          );

    // this.diagram.model = new go.GraphLinksModel(
    // this.diagramData.nodeDataArray, // nodes 
    // this.diagramData.linkDataArray // linking
    
    // );
    this.updateModel(this.modelData);
  },
  methods: {
        model: function() { return this.diagram.model; },
        updateModel: function(val) {
          // No GoJS transaction permitted when replacing Diagram.model.
          if (val instanceof go.Model) {
            this.diagram.model = val;
          } else {
            var m = new go.GraphLinksModel()
            if (val) {
              for (var p in val) {
                m[p] = val[p];
              }
            }
            this.diagram.model = m;
          }
        },
        updateDiagramFromData: function() {
          this.diagram.startTransaction();
          // This is very general but very inefficient.
          // It would be better to modify the diagramData data by calling
          // Model.setDataProperty or Model.addNodeData, et al.
          this.diagram.updateAllRelationshipsFromData();
          this.diagram.updateAllTargetBindings();
          this.diagram.commitTransaction("updated");
        }
  }
}
 
</script>

<style scoped>

</style>
