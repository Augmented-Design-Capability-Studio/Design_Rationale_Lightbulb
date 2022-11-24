import { EventHandler } from "@create-figma-plugin/utilities";

export interface Evidence {
  text: string;
  link: string;
}

export interface Answer {
  category: string;
  question: string;
  answered: boolean;
  answer: string;
  expanded: boolean;
  editAssignee: boolean;
  assignee: string;
  editEvidence: boolean;
  evidence: Evidence[];
}

export interface LightbulbItem {
  answers: Answer[];
  widgetId: string;
  parentNode: any;
  lastEditTime: number;
}

export interface FocusHandler extends EventHandler {
  name: "UPDATE_FOCUS";
  handler: () => void;
}
