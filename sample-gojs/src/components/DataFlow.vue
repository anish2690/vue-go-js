<template>
<div>
 <div id="myDiagramDiv" style="border: solid 1px blue; width:100%; height:800px"></div>
</div>
</template>
<script>
import * as go from 'gojs'
import extendsJS from '../../static/js/RoundedRectangles.js'
var $ = go.GraphObject.make;
export default {
  props: ["modelData"],
  mixins: [extendsJS], 
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
    // this.diagram = new go.Diagram("myDiagramDiv");
    // this.diagram.initialContentAlignment = go.Spot.Center; // make graph center
    // // this.diagram.layout = $(go.TreeLayout, { angle: 90, arrangement: go.TreeLayout.ArrangementHorizontal });
    // this.diagram.layout = layout: $(go.TreeLayout, { setsPortSpot: false, setsChildPortSpot: false });
    // this.diagram.undoManager.isEnabled = true
    // this.diagram.ModelChanged = function(e) { self.$emit("model-changed", e); };
    // this.diagram.ChangedSelection = function(e) { self.$emit("changed-selection", e); }

     this.diagram =
      $(go.Diagram, "myDiagramDiv",
        {
          initialContentAlignment: go.Spot.Center,
          layout: $(go.TreeLayout, { setsPortSpot: false, setsChildPortSpot: false })
        });
    this.diagram.nodeTemplate =
         $(go.Node, "Vertical",
        { defaultStretch: go.GraphObject.Horizontal },
        { fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide },
        $(go.Panel, "Auto",
          $(go.Shape, "RoundedTopRectangle",
            { fill: "white" },
            new go.Binding("fill", "role", function(r) { return r[0] === 't' ? "lightgray" : "white"; })),
          $(go.TextBlock,
            { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
            new go.Binding("text", "header"))
        ),
        $(go.Panel, "Auto",
          { minSize: new go.Size(NaN, 70) },
          $(go.Shape, "Rectangle", { fill: "white" }),
          $(go.TextBlock,
            { width: 120 },
            { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
            new go.Binding("text", "text")),
          $(go.Shape, "BpmnActivityLoop",
            {
              visible: false, width: 10, height: 10,
              alignment: new go.Spot(0.5, 1, 0, -3), alignmentFocus: go.Spot.Bottom
            },
            new go.Binding("visible", "loop"))
        ),
        $(go.Panel, "Auto",
          $(go.Shape, "RoundedBottomRectangle",
            { fill: "white" },
            new go.Binding("fill", "role", function(r) { return r[0] === 'b' ? "lightgray" : "white"; })),
          $(go.TextBlock,
            { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
            new go.Binding("text", "footer"))
        )
      );


    this.diagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.Orthogonal, corner: 5 },
        $(go.Shape),
        $(go.Shape, { toArrow: "Triangle"})
      );
        //   $(go.Link,
        //     { relinkableFrom: true, relinkableTo: true },
        //     $(go.Shape),
        //     $(go.Shape, { toArrow: "OpenTriangle" })
        //   );

    // this.diagram.model = new go.GraphLinksModel(
    // this.diagramData.nodeDataArray, // nodes 
    // this.diagramData.linkDataArray // linking
    
    // );
    this.diagram.groupTemplate =
      $(go.Group, "Vertical",
        { layout: $(go.TreeLayout, { setsPortSpot: false, setsChildPortSpot: false }) },
        { defaultStretch: go.GraphObject.Horizontal },
        { fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide },
        $(go.Panel, "Auto",
          $(go.Shape, "RoundedTopRectangle",
            { fill: "white" },
            new go.Binding("fill", "role", function(r) { return r[0] === 't' ? "lightgray" : "white"; })),
          $(go.TextBlock,
            { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
            new go.Binding("text", "header"))
        ),
        $(go.Panel, "Auto",
          $(go.Shape, { fill: "white" }),
          $(go.Placeholder, { padding: 20 }),
          $(go.Shape, "BpmnActivityLoop",
            {
              visible: false, width: 10, height: 10,
              alignment: new go.Spot(0.5, 1, 0, -3), alignmentFocus: go.Spot.Bottom
            },
            new go.Binding("visible", "loop"))
        ),
        $(go.Panel, "Auto",
          $(go.Shape, "RoundedBottomRectangle",
            { fill: "white" },
            new go.Binding("fill", "role", function(r) { return r[0] === 'b' ? "lightgray" : "white"; })),
          $(go.TextBlock,
            { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
            new go.Binding("text", "footer"))
        )
      );




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
