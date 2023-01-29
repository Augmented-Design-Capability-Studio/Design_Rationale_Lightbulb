import { once, on, showUI } from "@create-figma-plugin/utilities";

export default function () {
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

  // figma.on("documentchange", (event: any) => {
  //   console.log(event);
  //   for (const change of event.documentChanges) {
  //     switch (change.type) {
  //       case "DELETE":
  //         console.log(
  //           `Node ${change.id} deleted by a ${change.origin.toLowerCase()} user`
  //         );
  //         console.log(
  //           figma.currentPage.getSharedPluginData("name", "lightbulbList")
  //         );
  //         break;
  //     }
  //   }
  // });
}
