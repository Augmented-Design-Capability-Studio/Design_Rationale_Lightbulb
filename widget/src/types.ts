import { EventHandler } from "@create-figma-plugin/utilities";

export interface Evidence {
  text: string;
  link: string;
}

export interface Answer {
  category: string;
  question: string;
  userName: string;
  answered: boolean;
  answer: string;
  expanded: boolean; // have different value in widget/sidebar
  editAssignee: boolean;
  assignee: string;
  editEvidence: boolean;
  evidence: Evidence[];
  hasKeyword: boolean;
}

export interface LightbulbItem {
  answers: Answer[];
  widgetId: string;
  parentNode: any;
  lastEditTime: { num: number; str: string };
  userName: string;
  pageId: string;
  pageName: string;
}

export interface Filter {
  [category: string]: boolean;
}

export interface FocusHandler extends EventHandler {
  name: "UPDATE_FOCUS";
  handler: () => void;
}

export interface ToggleWidget extends EventHandler {
  name: "TOGGLE_WIDGET";
  handler: (hide: boolean) => void;
}
