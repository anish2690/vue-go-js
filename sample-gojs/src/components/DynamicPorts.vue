<template>
<div>
 <div id="myDiagramDiv" style="border: solid 1px blue; width:100%; height:800px"></div>
</div>
</template>
<script>
import * as go from 'gojs'
import extendsJS from '../../static/js/Test.js'
var $ = go.GraphObject.make;
function CustomLink() {
    go.Link.call(this);
  }
  go.Diagram.inherit(CustomLink, go.Link);
 

CustomLink.prototype.findSidePortIndexAndCount = function(node, port) {
    var nodedata = node.data;
    if (nodedata !== null) {
      var portdata = port.data;
      var side = port._side;
      var arr = nodedata[side + "Array"];
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        if (arr[i] === portdata) return [i, len];
      }
    }
    return [-1, len];
  };
  CustomLink.prototype.computeEndSegmentLength = function(node, port, spot, from) {
    var esl = go.Link.prototype.computeEndSegmentLength.call(this, node, port, spot, from);
    var other = this.getOtherPort(port);
    if (port !== null && other !== null) {
      var thispt = port.getDocumentPoint(this.computeSpot(from));
      var otherpt = other.getDocumentPoint(this.computeSpot(!from));
      if (Math.abs(thispt.x - otherpt.x) > 20 || Math.abs(thispt.y - otherpt.y) > 20) {
        var info = this.findSidePortIndexAndCount(node, port);
        var idx = info[0];
        var count = info[1];
        if (port._side == "top" || port._side == "bottom") {
          if (otherpt.x < thispt.x) {
            return esl + 4 + idx * 8;
          } else {
            return esl + (count - idx - 1) * 8;
          }
        } else {  // left or right
          if (otherpt.y < thispt.y) {
            return esl + 4 + idx * 8;
          } else {
            return esl + (count - idx - 1) * 8;
          }
        }
      }
    }
    return esl;
  };

  /** @override */
  CustomLink.prototype.hasCurviness = function() {
    if (isNaN(this.curviness)) return true;
    return go.Link.prototype.hasCurviness.call(this);
  };

  /** @override */
  CustomLink.prototype.computeCurviness = function() {
    if (isNaN(this.curviness)) {
      var fromnode = this.fromNode;
      var fromport = this.fromPort;
      var fromspot = this.computeSpot(true);
      var frompt = fromport.getDocumentPoint(fromspot);
      var tonode = this.toNode;
      var toport = this.toPort;
      var tospot = this.computeSpot(false);
      var topt = toport.getDocumentPoint(tospot);
      if (Math.abs(frompt.x - topt.x) > 20 || Math.abs(frompt.y - topt.y) > 20) {
        if ((fromspot.equals(go.Spot.Left) || fromspot.equals(go.Spot.Right)) &&
            (tospot.equals(go.Spot.Left) || tospot.equals(go.Spot.Right))) {
          var fromseglen = this.computeEndSegmentLength(fromnode, fromport, fromspot, true);
          var toseglen = this.computeEndSegmentLength(tonode, toport, tospot, false);
          var c = (fromseglen - toseglen) / 2;
          if (frompt.x + fromseglen >= topt.x - toseglen) {
            if (frompt.y < topt.y) return c;
            if (frompt.y > topt.y) return -c;
          }
        } else if ((fromspot.equals(go.Spot.Top) || fromspot.equals(go.Spot.Bottom)) &&
                   (tospot.equals(go.Spot.Top) || tospot.equals(go.Spot.Bottom))) {
          var fromseglen = this.computeEndSegmentLength(fromnode, fromport, fromspot, true);
          var toseglen = this.computeEndSegmentLength(tonode, toport, tospot, false);
          var c = (fromseglen - toseglen) / 2;
          if (frompt.x + fromseglen >= topt.x - toseglen) {
            if (frompt.y < topt.y) return c;
            if (frompt.y > topt.y) return -c;
          }
        }
      }
    }
    return go.Link.prototype.computeCurviness.call(this);
  };
  // end CustomLink class




  
export default {
  props: ["modelData"],
  mixins: [extendsJS], 
  data() {
    return {
        diagram: '',
    }
  },
  mounted() {
     this.diagram =
      $(go.Diagram, "myDiagramDiv",
          { initialContentAlignment: go.Spot.Center, "undoManager.isEnabled": true }
        );
        
    function makeButton(text, action, visiblePredicate) {
      return $("ContextMenuButton",
               $(go.TextBlock, text),
               { click: action },
               // don't bother with binding GraphObject.visible if there's no predicate
               visiblePredicate ? new go.Binding("visible", "", function(o, e) { return o.diagram ? visiblePredicate(o, e) : false; }).ofObject() : {});
    }
    var nodeMenu =  // context menu for each Node
      $(go.Adornment, "Vertical",
        makeButton("Copy",
                   function(e, obj) { e.diagram.commandHandler.copySelection(); }),
        makeButton("Delete",
                   function(e, obj) { e.diagram.commandHandler.deleteSelection(); }),
        $(go.Shape, "LineH", { strokeWidth: 2, height: 1, stretch: go.GraphObject.Horizontal }),
        makeButton("Add top port",
                   function (e, obj) { addPort("top"); }),
        makeButton("Add left port",
                   function (e, obj) { addPort("left"); }),
        makeButton("Add right port",
                   function (e, obj) { addPort("right"); }),
        makeButton("Add bottom port",
                   function (e, obj) { addPort("bottom"); })
      );
       var portSize = new go.Size(8, 8);

    var portMenu =  // context menu for each port
      $(go.Adornment, "Vertical",
        makeButton("Swap order",
                   function(e, obj) { swapOrder(obj.part.adornedObject); }),
        makeButton("Remove port",
                   // in the click event handler, the obj.part is the Adornment;
                   // its adornedObject is the port
                   function (e, obj) { removePort(obj.part.adornedObject); }),
        makeButton("Change color",
                   function(e, obj) { changeColor(obj.part.adornedObject); }),
        makeButton("Remove side ports",
                   function (e, obj) { removeAll(obj.part.adornedObject); })
      );

      

    
    this.diagram.nodeTemplate =
         $(go.Node, "Table",
        { locationObjectName: "BODY",
          locationSpot: go.Spot.Center,
          selectionObjectName: "BODY",
          contextMenu: nodeMenu
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

        // the body
        $(go.Panel, "Auto",
          { row: 1, column: 1, name: "BODY",
            stretch: go.GraphObject.Fill },
          $(go.Shape, "Rectangle",
            { fill: "#AC193D", stroke: null, strokeWidth: 0,
              minSize: new go.Size(56, 56) }),
          $(go.TextBlock,
            { margin: 10, textAlign: "center", font: "14px  Segoe UI,sans-serif", stroke: "white", editable: true },
            new go.Binding("text", "name").makeTwoWay())
        ),  // end Auto Panel body

        // the Panel holding the left port elements, which are themselves Panels,
        // created for each item in the itemArray, bound to data.leftArray
        $(go.Panel, "Vertical",
          new go.Binding("itemArray", "leftArray"),
          { row: 1, column: 0,
            itemTemplate:
              $(go.Panel,
                { _side: "left",  // internal property to make it easier to tell which side it's on
                  fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                  fromLinkable: true, toLinkable: true, cursor: "pointer",
                  contextMenu: portMenu },
                new go.Binding("portId", "portId"),
                $(go.Shape, "Rectangle",
                  { stroke: null, strokeWidth: 0,
                    desiredSize: portSize,
                    margin: new go.Margin(1,0) },
                  new go.Binding("fill", "portColor"))
              )  // end itemTemplate
          }
        ),  // end Vertical Panel

        // the Panel holding the top port elements, which are themselves Panels,
        // created for each item in the itemArray, bound to data.topArray
        $(go.Panel, "Horizontal",
          new go.Binding("itemArray", "topArray"),
          { row: 0, column: 1,
            itemTemplate:
              $(go.Panel,
                { _side: "top",
                  fromSpot: go.Spot.Top, toSpot: go.Spot.Top,
                  fromLinkable: true, toLinkable: true, cursor: "pointer",
                  contextMenu: portMenu },
                new go.Binding("portId", "portId"),
                $(go.Shape, "Rectangle",
                  { stroke: null, strokeWidth: 0,
                    desiredSize: portSize,
                    margin: new go.Margin(0, 1) },
                  new go.Binding("fill", "portColor"))
              )  // end itemTemplate
          }
        ),  // end Horizontal Panel

        // the Panel holding the right port elements, which are themselves Panels,
        // created for each item in the itemArray, bound to data.rightArray
        $(go.Panel, "Vertical",
          new go.Binding("itemArray", "rightArray"),
          { row: 1, column: 2,
            itemTemplate:
              $(go.Panel,
                { _side: "right",
                  fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
                  fromLinkable: true, toLinkable: true, cursor: "pointer",
                  contextMenu: portMenu },
                new go.Binding("portId", "portId"),
                $(go.Shape, "Rectangle",
                  { stroke: null, strokeWidth: 0,
                    desiredSize: portSize,
                    margin: new go.Margin(1, 0) },
                  new go.Binding("fill", "portColor"))
              )  // end itemTemplate
          }
        ),  // end Vertical Panel

        // the Panel holding the bottom port elements, which are themselves Panels,
        // created for each item in the itemArray, bound to data.bottomArray
        $(go.Panel, "Horizontal",
          new go.Binding("itemArray", "bottomArray"),
          { row: 2, column: 1,
            itemTemplate:
              $(go.Panel,
                { _side: "bottom",
                  fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                  fromLinkable: true, toLinkable: true, cursor: "pointer",
                  contextMenu: portMenu },
                new go.Binding("portId", "portId"),
                $(go.Shape, "Rectangle",
                  { stroke: null, strokeWidth: 0,
                    desiredSize: portSize,
                    margin: new go.Margin(0, 1) },
                  new go.Binding("fill", "portColor"))
              )  // end itemTemplate
          }
        )  // end Horizontal Panel
      );  // end Node


    this.diagram.linkTemplate =
     $(CustomLink,  // defined below
        {
          routing: go.Link.AvoidsNodes,
          corner: 4,
          curve: go.Link.JumpGap,
          reshapable: true,
          resegmentable: true,
          relinkableFrom: true,
          relinkableTo: true
        },
        new go.Binding("points").makeTwoWay(),
        $(go.Shape, { stroke: "#2F4F4F", strokeWidth: 2 })
      );

    // this.diagram.model = new go.GraphLinksModel(
    // this.diagramData.nodeDataArray, // nodes 
    // this.diagramData.linkDataArray // linking
    
    // );
    // this.diagram.groupTemplate =
    //   $(go.Group, "Vertical",
    //     { layout: $(go.TreeLayout, { setsPortSpot: false, setsChildPortSpot: false }) },
    //     { defaultStretch: go.GraphObject.Horizontal },
    //     { fromSpot: go.Spot.RightSide, toSpot: go.Spot.LeftSide },
    //     $(go.Panel, "Auto",
    //       $(go.Shape, "RoundedTopRectangle",
    //         { fill: "white" },
    //         new go.Binding("fill", "role", function(r) { return r[0] === 't' ? "lightgray" : "white"; })),
    //       $(go.TextBlock,
    //         { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
    //         new go.Binding("text", "header"))
    //     ),
    //     $(go.Panel, "Auto",
    //       $(go.Shape, { fill: "white" }),
    //       $(go.Placeholder, { padding: 20 }),
    //       $(go.Shape, "BpmnActivityLoop",
    //         {
    //           visible: false, width: 10, height: 10,
    //           alignment: new go.Spot(0.5, 1, 0, -3), alignmentFocus: go.Spot.Bottom
    //         },
    //         new go.Binding("visible", "loop"))
    //     ),
    //     $(go.Panel, "Auto",
    //       $(go.Shape, "RoundedBottomRectangle",
    //         { fill: "white" },
    //         new go.Binding("fill", "role", function(r) { return r[0] === 'b' ? "lightgray" : "white"; })),
    //       $(go.TextBlock,
    //         { margin: new go.Margin(2, 2, 0, 2), textAlign: "center" },
    //         new go.Binding("text", "footer"))
    //     )
    //   );
 // support double-clicking in the background to add a copy of this data as a node
    this.diagram.toolManager.clickCreatingTool.archetypeNodeData = {
      name: "Unit",
      leftArray: [],
      rightArray: [],
      topArray: [],
      bottomArray: []
    };
      this.diagram.contextMenu =
      $(go.Adornment, "Vertical",
          makeButton("Paste",
                     function(e, obj) { e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint); },
                     function(o) { return o.diagram.commandHandler.canPasteSelection(); }),
          makeButton("Undo",
                     function(e, obj) { e.diagram.commandHandler.undo(); },
                     function(o) { return o.diagram.commandHandler.canUndo(); }),
          makeButton("Redo",
                     function(e, obj) { e.diagram.commandHandler.redo(); },
                     function(o) { return o.diagram.commandHandler.canRedo(); })
      );

    // making custom link to sapperate single line 
// this.diagram.model = new go.GraphLinksModel(nodes, links);
// this.diagram.model.copiesArrays = true;
// this.diagram.model.copiesArrayObjects = true;
// this.diagram.model.linkFromPortIdProperty = 'fromPort'; //this line
// this.diagram.model.linkToPortIdProperty = 'toPort'; //and this line

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
        
      
  }
}
 
</script>

<style scoped>

</style>
