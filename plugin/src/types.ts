import { EventHandler } from "@create-figma-plugin/utilities";

export interface SaveNodesHandler extends EventHandler {
  name: "SAVE_NODES";
  handler: () => void;
}

export interface DisplayNodesHandler extends EventHandler {
  name: "DISPLAY_NODES";
  handler: () => void;
}

export interface ToggleWidget extends EventHandler {
  name: "TOGGLE_WIDGET";
  handler: () => void;
}

export interface CreateWidget extends EventHandler {
  name: "CREATE_WIDGET";
  handler: () => void;
}
