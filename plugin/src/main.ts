import { once, on, showUI } from "@create-figma-plugin/utilities";

import {
  DisplayNodesHandler,
  SaveNodesHandler,
  ToggleWidget,
  CreateWidget,
} from "./types";

const questions: { [category: string]: string } = {
  "Design Rationale": "Why is this designed this way?",
  Function: "What is the function of this?",
  Behavior: "How does this behave?",
  "Additional Context": "What else is important for this?",
  Task: "What needs to be done to this?",
  Problems: "What is wrong with this?",
};

const initAnswers = Object.keys(questions).map((c) => ({
  category: c,
  question: questions[c],
  answered: false,
  answer: "",
  expanded: false,
  editAssignee: false,
  assignee: "",
  editEvidence: false,
  evidence: [],
}));

function turnFrameIntoComponent() {
  const selection: SceneNode = figma.currentPage.selection[0];
  if (!selection) {
    return;
  }
  if (selection.type !== "FRAME") {
    return;
  } // <----
  const component = figma.createComponent();
  component.x = selection.x;
  component.y = selection.y;
  component.resize(selection.width, selection.height);
  // Copy children into new node
  for (const child of selection.children) {
    component.appendChild(child);
  }
  selection.remove();
}

function createFrame() {
  const frame = figma.createFrame();
  // Move to (50, 50)
  frame.x = 50;
  frame.y = 50;

  // Set size to 1280 x 720
  frame.resize(1280, 720);

  frame.opacity = 0;
}

function saveNodes() {
  var selectionData = [];
  // access selectionData
  for (var node of figma.currentPage.selection) {
    console.log("node ", node);
    // var selectionNode = {
    //   id: node.id,
    //   name: node.name,
    //   type: node.type,
    // };
    selectionData.push(node);

    // if (node.type == "COMPONENT") node.createInstance();
  }

  figma.currentPage.setPluginData("saved", JSON.stringify(selectionData));
  console.log(figma.currentPage.getPluginData("saved"));
}

function createNode() {}

export default function () {
  on<SaveNodesHandler>("SAVE_NODES", function () {
    saveNodes();
  });

  on<DisplayNodesHandler>("DISPLAY_NODES", function () {
    var id = JSON.parse(figma.currentPage.getPluginData("saved"))[0].id;
    console.log(id);
    var node = figma.getNodeById(id) as any;
    console.log(node);
    node.clone();
    node.description = "description";
    node.documentationLinks = [{ uri: "https://www.figma.com" }];

    // figma.closePlugin();
  });

  on<ToggleWidget>("TOGGLE_WIDGET", function () {
    const allWidgetNodes: any = figma.currentPage.findAll((node) => {
      return node.type === "WIDGET" && node.widgetId == "lightbulb";
    });
    console.log("allWidgetNodes", allWidgetNodes);
    allWidgetNodes.forEach((widget: WidgetNode) => {
      console.log("widget id", widget.widgetId);
      return (widget.visible = !widget.visible);
    });
  });

  on<CreateWidget>("CREATE_WIDGET", function () {
    const lightbulbWidgets: WidgetNode[] =
      figma.currentPage.findWidgetNodesByWidgetId("lightbulb");
    console.log("lightbulbWidgets", lightbulbWidgets);
    // get any lightbulb node and clone it, overriding all synced states to emtpy
    const lightbulb = lightbulbWidgets.filter((d) => {
      console.log(d);
      return true;
    })[0];
    const newLightbulb = lightbulb.clone();
    const parent = figma.currentPage.selection;
    console.log(parent);
    for (var node of parent) {
      if (node.type == "FRAME") {
        node.appendChild(newLightbulb);
        break;
      }
    }
  });

  // the only working code
  figma.on("run", () => {
    console.log("plugin run");
    const lightbulbWidgets: WidgetNode[] =
      figma.currentPage.findWidgetNodesByWidgetId("lightbulb");
    console.log("lightbulbWidgets", lightbulbWidgets);
    // get the first lightbulb node and clone it, overriding all synced states to emtpy
    const lightbulb = lightbulbWidgets.filter((d) => {
      console.log(d);
      return d.locked;
    })[0];
    const newLightbulb = lightbulb.clone();

    const parent = figma.currentPage.selection;
    console.log(parent);
    for (var node of parent) {
      if (node.type == "FRAME") {
        node.appendChild(newLightbulb);
        newLightbulb.x = node.width - 60;
        newLightbulb.y = 0;
        newLightbulb.visible = true;
        newLightbulb.locked = false;
        console.log(node.width, node.height);
        break;
      }
    }
  });

  figma.on("documentchange", (event: any) => {
    console.log(event);
    for (const change of event.documentChanges) {
      switch (change.type) {
        case "DELETE":
          console.log(
            `Node ${change.id} deleted by a ${change.origin.toLowerCase()} user`
          );
          console.log(
            figma.currentPage.getSharedPluginData("name", "lightbulbList")
          );
          break;
      }
    }
  });

  // showUI({
  //   height: 137,
  //   width: 240,
  // });
}
