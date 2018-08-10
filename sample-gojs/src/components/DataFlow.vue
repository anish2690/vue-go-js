<template>
<div>
 <div id="myDiagramDiv" style="border: solid 1px blue; width:100%; height:800px"></div>
</div>
</template>
<script>
import * as go from 'gojs'
import extendsJS from '../../static/js/RoundedRectangles.js'
var $ = go.GraphObject.make;

 // colors used, named for easier identification
    var blue = "#0288D1";
    var pink = "#B71C1C";
    var pinkfill = "#F8BBD0";
    var bluefill = "#B3E5FC";
    
    function linkColorConverter(linkdata, elt) {
      var link = elt.part;
      if (!link) return blue;
      var f = link.fromNode;
      if (!f || !f.data || !f.data.critical) return blue;
      var t = link.toNode;
      if (!t || !t.data || !t.data.critical) return blue;
      return pink;  // when both Link.fromNode.data.critical and Link.toNode.data.critical
    }


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
          initialContentAlignment: go.Spot.Left,
          initialAutoScale: go.Diagram.UniformToFill,
          layout: $(go.LayeredDigraphLayout,
                    { direction: 0 }),
          "undoManager.isEnabled": true
        }
      );
    function makePort(name, leftside) {
      var port = $(go.Shape, "Rectangle",
                   {
                     fill: "gray", stroke: null,
                     desiredSize: new go.Size(8, 8),
                     portId: name,  // declare this object to be a "port"
                     toMaxLinks: 1,  // don't allow more than one link into a port
                     cursor: "pointer"  // show a different cursor to indicate potential link point
                   });

      var lab = $(go.TextBlock, name,  // the name of the port
                  { font: "7pt sans-serif" });

      var panel = $(go.Panel, "Horizontal",
                    { margin: new go.Margin(2, 0) });

      // set up the port/panel based on which side of the node it will be on
      if (leftside) {
        port.toSpot = go.Spot.Left;
        port.toLinkable = true;
        lab.margin = new go.Margin(1, 0, 0, 1);
        panel.alignment = go.Spot.TopLeft;
        panel.add(port);
        panel.add(lab);
      } else {
        port.fromSpot = go.Spot.Right;
        port.fromLinkable = true;
        lab.margin = new go.Margin(1, 1, 0, 0);
        panel.alignment = go.Spot.TopRight;
        panel.add(lab);
        panel.add(port);
      }
      return panel;
    }



   this.makeTemplate("Table", "images/55x55.png", "forestgreen",
                 [],
                 [makePort("OUT", false)]);

    this.makeTemplate("Join", "images/55x55.png", "mediumorchid",
                 [makePort("L", true), makePort("R", true)],
                 [makePort("UL", false), makePort("ML", false), makePort("M", false), makePort("MR", false), makePort("UR", false)]);

    this.makeTemplate("Project", "images/55x55.png", "darkcyan",
                 [makePort("", true)],
                 [makePort("OUT", false)]);

    this.makeTemplate("Filter", "images/55x55.png", "cornflowerblue",
                 [makePort("", true)],
                 [makePort("OUT", false),makePort("INV", false)]);

    this.makeTemplate("Group", "images/55x55.png", "mediumpurple",
                 [makePort("", true)],
                 [makePort("OUT", false)]);

   this. makeTemplate("Sort", "images/55x55.png", "sienna",
                 [makePort("", true)],
                 [makePort("OUT", false)]);

    this.makeTemplate("Export", "images/55x55.png", "darkred",
                 [makePort("", true)],
                 []);

    this.diagram.linkTemplate =
      $(go.Link,
        {
          routing: go.Link.Orthogonal, corner: 5,
          relinkableFrom: true, relinkableTo: true
        },
        // $(go.Shape, { stroke: "gray", strokeWidth: 2 }),
        // $(go.Shape, { stroke: "gray", fill: "gray", toArrow: "Standard" })
         $(go.Shape,
          { strokeWidth: 1 },
          new go.Binding("stroke", "", linkColorConverter)),
        $(go.Shape,  // arrowhead
          { toArrow: "Triangle", stroke: null, scale: 1.5 },
          new go.Binding("fill", "", linkColorConverter))
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
        },
         makeTemplate(typename, icon, background, inports, outports) {
      var node = $(go.Node, "Spot",
          $(go.Panel, "Auto",
            { width: 100, height: 120 },
            $(go.Shape, "Rectangle",
              {
                fill: background, stroke: null, strokeWidth: 0,
                spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight
              }),
            $(go.Panel, "Table",
              $(go.TextBlock, typename,
                {
                  row: 0,
                  margin: 3,
                  maxSize: new go.Size(80, NaN),
                  stroke: "white",
                  font: "bold 11pt sans-serif"
                }),
              $(go.Picture, icon,
                { row: 1, width: 55, height: 55 }),
              $(go.TextBlock,
                {
                  row: 2,
                  margin: 3,
                  editable: true,
                  maxSize: new go.Size(80, 40),
                  stroke: "white",
                  font: "bold 9pt sans-serif"
                },
                new go.Binding("text", "name").makeTwoWay())
            )
          ),
          $(go.Panel, "Vertical",
            {
              alignment: go.Spot.Left,
              alignmentFocus: new go.Spot(0, 0.5, -8, 0)
            },
            inports),
          $(go.Panel, "Vertical",
            {
              alignment: go.Spot.Right,
              alignmentFocus: new go.Spot(1, 0.5, 8, 0)
            },
            outports)
        );
      this.diagram.nodeTemplateMap.add(typename, node);
    }
  }
}
 
</script>

<style scoped>

</style>
