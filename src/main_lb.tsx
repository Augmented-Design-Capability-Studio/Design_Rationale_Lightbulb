/** @jsx figma.widget.h */

import { emit, once, on, showUI } from "@create-figma-plugin/utilities";
import { useCallback, useState } from "preact/hooks";
import _ from "lodash";
import { Answer, Evidence, FocusHandler, LightbulbItem } from "./types";
import { expand, toexpand, expanded, bulbSvgSrc } from "./icons";
// import expand from "./icons/expand.svg";
// import addlink from "./icons/addlink.svg";
// import link from "./icons/link.svg";
// import archive from "./icons/archive.svg";
// import cross from "./icons/cross.svg";
// import dropdown from "./icons/dropdown.svg";
// import edit from "./icons/edit.svg";
// import threedots from "./icons/threedots.svg";

const { widget } = figma;
const {
  AutoLayout,
  Image,
  Rectangle,
  Text,
  useSyncedState,
  usePropertyMenu,
  useStickable,
  useStickableHost,
  useWidgetId,
  useEffect,
  Input,
  Frame,
  SVG,
} = widget;

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

function createTime() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const currentDate = `${day}-${month}-${year}`;
  // console.log(currentDate);
  return currentDate;
}

function Lightbulb() {
  const [name, setName] = useSyncedState<string>("name", "");
  // const [photoUrl, setPhotoUrl] = useSyncedState<string | null>(
  //   "photoUrl",
  //   null
  // );
  // const [text, setText] = useSyncedState<string>("text", "");
  const [open, setOpen] = useSyncedState("open", true);
  const [date, setDate] = useSyncedState("date", createTime());
  const [mode, setMode] = useSyncedState<string>("mode", "Questions"); // questions or categories
  const [answers, setAnswers] = useSyncedState<Answer[]>(
    "answers",
    initAnswers
  ); // stores all answers of this widget, initial value = {}
  const [unanswerExpand, setUnanswerExpand] = useSyncedState<boolean>(
    "unanswerExpand",
    true
  );
  const [curEvidence, setCurEvidence] = useSyncedState<Evidence>(
    "curEvidence",
    { text: "", link: "" }
  );

  const widgetId = useWidgetId();
  const fileKey = figma.fileKey;

  useEffect(() => {
    console.log("useEffect", widgetId);
    console.log(
      "current selection",
      figma.currentPage.selection[0].parent?.name
    );
    if (!name) {
      if (figma.currentUser) {
        setName(figma.currentUser.name);
        // setPhotoUrl(figma.currentUser.photoUrl);
      } else {
        figma.notify("Please login to figma");
      }
    }
  });

  useEffect(() => {
    figma.ui.onmessage = (msg) => {
      if (msg.type === "show") {
        figma.notify("Hello");
      }
      if (msg.type === "close") {
        figma.closePlugin();
      }
    };
  });

  async function onChange({
    propertyName,
  }: WidgetPropertyEvent): Promise<void> {
    await new Promise<void>(function (resolve: () => void): void {
      if (propertyName === "showArchived") {
        console.log("show archived");
        showUI(
          { height: 1200, width: 300, position: { x: 0, y: 0 } },
          { "show Archive": String }
        );
        let lightbulbList: LightbulbItem[] =
          figma.currentPage.getPluginData("lightbulbList") === ""
            ? []
            : JSON.parse(figma.currentPage.getPluginData("lightbulbList"));
        emit("TEST", "test from showUI");
        emit("ARCHIVE", lightbulbList);
        on<FocusHandler>("UPDATE_FOCUS", function (): void {
          console.log("focus");
          resolve();
        });
      }
    });
  }

  usePropertyMenu(
    [
      {
        itemType: "action",
        tooltip: "Show archived",
        propertyName: "showArchived",
      },
    ],
    onChange
  );

  async function onDelete({
    propertyName,
  }: WidgetPropertyEvent): Promise<void> {
    await new Promise<void>(function (resolve: () => void): void {
      if (propertyName === "showArchived") {
        showUI({ height: 144, width: 240 }, { " ": String });
        // once("UPDATE_TEXT", function (text: string): void {
        //   setText(text);
        //   resolve();
        // });
      }
    });
  }

  const updateAnswers = (category: string, newData: {}) => {
    // update the current widget answer
    console.log("updateAnswers", newData);
    let newAnswers = answers;
    let index = newAnswers.findIndex((a) => a.category == category);
    newAnswers[index] = { ...answers[index], ...newData };
    setAnswers(newAnswers);
    console.log("newAnswers", newAnswers);

    // update the answers stored in figmaplugindata

    let lightbulbList: LightbulbItem[] =
      figma.currentPage.getPluginData("lightbulbList") === "{}"
        ? []
        : JSON.parse(figma.currentPage.getPluginData("lightbulbList"));
    if (lightbulbList.length)
      lightbulbList.filter((lb) => lb.widgetId !== widgetId); // remove the previous data
    let newLightbulb: LightbulbItem = {
      answers: answers,
      widgetId: widgetId,
      parentNode: {
        id: figma.currentPage.selection[0].parent?.id,
        name: figma.currentPage.selection[0].parent?.name,
      },
      lastEditTime: 1,
    };
    lightbulbList.push(newLightbulb);
    figma.currentPage.setPluginData(
      "lightbulbList",
      JSON.stringify(lightbulbList)
    );
  };

  function handleFocus(id: string) {
    console.log("handle focus ", id);

    // // const selectionNode = [] as any;
    const selectionNode: Array<any> = [];
    // // run for loop here
    // for (let i = 0; i < selectionArray.length; i++) {
    //   let set = selectionArray[i].id;
    //   console.log("set", set);
    //   let nodeset = figma.getNodeById(set) as any;
    //   selectionNode.push(nodeset);
    //   console.log("selectionNodein", selectionNode);
    // }
    // console.log("selectionNodeout", selectionNode);

    selectionNode.push(figma.getNodeById(id));
    figma.currentPage.selection = selectionNode;
    figma.viewport.scrollAndZoomIntoView(selectionNode);
  }

  return (
    <AutoLayout
      direction="horizontal"
      height="hug-contents"
      padding={4}
      name="Widget"
      overflow="visible"
    >
      <SVG src={bulbSvgSrc} onClick={() => setOpen(!open)} />

      <AutoLayout
        direction="vertical"
        verticalAlignItems="start"
        height="hug-contents"
        spacing={6}
        padding={12}
        cornerRadius={8}
        width={200}
        fill="#FFF"
        stroke="#000"
        hidden={!open}
      >
        {/* tabs */}
        <AutoLayout
          direction="horizontal"
          horizontalAlignItems="center"
          verticalAlignItems="center"
          height="hug-contents"
          padding={{ top: 5, left: 8, bottom: 0, right: 8 }}
          spacing={12}
        >
          <Text
            fontFamily="Roboto"
            fontSize={12}
            fontWeight={600}
            onClick={() => setMode("Questions")}
            fill={mode == "Questions" ? "#0B339A" : "#000000"}
            textDecoration={mode == "Questions" ? "underline" : "none"}
          >
            Questions
          </Text>
          <Text
            fontFamily="Roboto"
            fontSize={12}
            fontWeight={600}
            onClick={() => setMode("Categories")}
            fill={mode == "Categories" ? "#0B339A" : "#000000"}
            textDecoration={mode == "Categories" ? "underline" : "none"}
          >
            Categories
          </Text>
        </AutoLayout>

        {/* question/categories list */}
        <AutoLayout
          direction="vertical"
          verticalAlignItems="start"
          height="hug-contents"
          spacing={10}
          padding={12}
          cornerRadius={8}
        >
          {/* when there are answers */}
          <AutoLayout direction="vertical" spacing={6}>
            {/* answered part */}
            {answers
              .filter((a) => a.answered || a.expanded)
              .map((answer, index) => (
                <AutoLayout
                  key={index}
                  direction="vertical"
                  spacing={6}
                  padding={{ bottom: 6 }}
                >
                  {/* profile */}
                  {/* <AutoLayout
                    direction="horizontal"
                    horizontalAlignItems="center"
                    verticalAlignItems="center"
                    height="hug-contents"
                    padding={0}
                    spacing={8}
                  >
                    {photoUrl ? (
                      <Image
                        cornerRadius={15}
                        width={15}
                        height={15}
                        src={photoUrl}
                      />
                    ) : (
                      <Rectangle
                        cornerRadius={15}
                        width={15}
                        height={15}
                        fill="#2A2A2A"
                      />
                    )}
                    <Text fontFamily="Inter" fontSize={8} fontWeight={400}>
                      {name}
                    </Text>
                    <Text fontFamily="Inter" fontSize={8} fill="#818181">
                      {date}
                    </Text>
                  </AutoLayout> */}
                  {/* expanded question/category */}
                  <AutoLayout direction="horizontal" spacing={6}>
                    <SVG
                      src={answer.expanded ? expanded : toexpand}
                      onClick={() =>
                        updateAnswers(answer.category, {
                          expanded: !answer.expanded,
                        })
                      }
                    ></SVG>
                    <Text fontFamily="Roboto" fontSize={10}>
                      {mode == "Questions" ? answer.question : answer.category}
                    </Text>
                  </AutoLayout>
                  {/* text/input */}
                  {answer.expanded ? (
                    <AutoLayout direction="vertical" spacing={6}>
                      <AutoLayout
                        direction="horizontal"
                        horizontalAlignItems="center"
                        verticalAlignItems="center"
                        height="hug-contents"
                        padding={0}
                        spacing={8}
                      >
                        <Text fontFamily="Inter" fontSize={8} fontWeight={400}>
                          {name}
                        </Text>
                        <Text fontFamily="Inter" fontSize={8} fill="#818181">
                          {date}
                        </Text>
                      </AutoLayout>
                      <Input
                        fontFamily="Inter"
                        fontSize={10}
                        fontWeight="normal"
                        inputFrameProps={{
                          cornerRadius: 2,
                          fill: "#FFF",
                          horizontalAlignItems: "center",
                          overflow: "visible",
                          padding: 2,
                          stroke: "#ABABAB",
                          strokeWidth: 1,
                          verticalAlignItems: "center",
                        }}
                        onTextEditEnd={(e) => {
                          let text = e.characters.trim();
                          updateAnswers(answer.category, {
                            answer: text,
                            answered: text.length ? true : false,
                            expanded: text.length ? true : false,
                          });
                          setDate(createTime());
                        }}
                        value={answer.answer}
                        width={150}
                        paragraphSpacing={5}
                      />
                      {/* assignee */}
                      {answer.assignee == "" ? (
                        answer.editAssignee ? (
                          <AutoLayout direction="vertical" spacing={3}>
                            <AutoLayout direction="horizontal" spacing={50}>
                              <Text fontFamily="Roboto" fontSize={8}>
                                Assign to
                              </Text>
                              <Text
                                fontFamily="Roboto"
                                fontSize={8}
                                onClick={() =>
                                  updateAnswers(answer.category, {
                                    editAssignee: false,
                                  })
                                }
                              >
                                X
                              </Text>
                            </AutoLayout>
                            <Input
                              fontFamily="Roboto"
                              fontSize={8}
                              fontWeight="normal"
                              inputFrameProps={{
                                cornerRadius: 2,
                                fill: "#FFF",
                                horizontalAlignItems: "center",
                                overflow: "visible",
                                padding: 2,
                                stroke: "#ABABAB",
                                strokeWidth: 1,
                                verticalAlignItems: "center",
                              }}
                              onTextEditEnd={(e) => {
                                let text = e.characters.trim();
                                updateAnswers(answer.category, {
                                  assignee: text,
                                  editAssignee: text.length,
                                });
                              }}
                              value={answer.assignee}
                              width={150}
                              paragraphSpacing={5}
                            />
                          </AutoLayout>
                        ) : (
                          <Text
                            fontFamily="Roboto"
                            fontSize={8}
                            fontWeight={300}
                            onClick={() =>
                              updateAnswers(answer.category, {
                                editAssignee: true,
                              })
                            }
                          >
                            + Add assignee
                          </Text>
                        )
                      ) : (
                        <AutoLayout direction="horizontal" spacing={2}>
                          <Text fontFamily="Roboto" fontSize={8}>
                            Assigned to
                          </Text>
                          <Text fontFamily="Roboto" fontSize={8} fill="#3366CC">
                            @{answer.assignee}
                          </Text>
                          <Text
                            fontFamily="Roboto"
                            fontSize={8}
                            onClick={() =>
                              updateAnswers(answer.category, {
                                assignee: "",
                                editAssignee: false,
                              })
                            }
                          >
                            X
                          </Text>
                        </AutoLayout>
                      )}

                      {/* evidence or connection */}
                      <AutoLayout direction="vertical" spacing={3}>
                        {/* {answer.evidence.length > 0 ? ( */}
                        <Text
                          fontFamily="Roboto"
                          fontSize={8}
                          hidden={answer.evidence.length <= 0}
                        >
                          Evidence or connection
                        </Text>
                        {/* ) : ( */}
                        {/* <AutoLayout></AutoLayout> */}
                        {/* )} */}

                        {answer.evidence.map((evi, i) => (
                          <AutoLayout
                            key={i}
                            direction="horizontal"
                            spacing={6}
                          >
                            <AutoLayout direction="vertical" spacing={6}>
                              <Text fontFamily="Roboto" fontSize={8}>
                                {evi.text}
                              </Text>
                              <Text
                                fontFamily="Roboto"
                                fontSize={8}
                                fill="#3366CC"
                              >
                                {evi.link}
                              </Text>
                            </AutoLayout>
                            <Text
                              fontFamily="Roboto"
                              fontSize={8}
                              onClick={() => {
                                let newEvidence = answer.evidence;
                                newEvidence.splice(i);
                                console.log(answer.evidence.map((e) => e.text));
                                updateAnswers(answer.category, {
                                  evidence: newEvidence,
                                });
                              }}
                            >
                              X
                            </Text>
                          </AutoLayout>
                        ))}

                        {answer.editEvidence ? (
                          <AutoLayout direction="vertical" spacing={3}>
                            <AutoLayout direction="horizontal" spacing={50}>
                              <Text fontFamily="Roboto" fontSize={8}>
                                Evidence or connection
                              </Text>
                              <Text
                                fontFamily="Roboto"
                                fontSize={8}
                                onClick={() => {
                                  updateAnswers(answer.category, {
                                    editEvidence: false,
                                  });
                                }}
                              >
                                X
                              </Text>
                            </AutoLayout>
                            <Text
                              fontFamily="Roboto"
                              fontSize={8}
                              fontWeight={300}
                            >
                              Text
                            </Text>
                            <Input
                              fontFamily="Roboto"
                              fontSize={8}
                              fontWeight="normal"
                              inputFrameProps={{
                                cornerRadius: 2,
                                fill: "#FFF",
                                horizontalAlignItems: "center",
                                overflow: "visible",
                                padding: 2,
                                stroke: "#ABABAB",
                                strokeWidth: 1,
                                verticalAlignItems: "center",
                              }}
                              onTextEditEnd={(e) => {
                                let text = e.characters.trim();
                                setCurEvidence({
                                  ...curEvidence,
                                  ...{ text: text },
                                });
                              }}
                              value={curEvidence.text}
                              width={150}
                              paragraphSpacing={5}
                            />
                            <Text
                              fontFamily="Roboto"
                              fontSize={8}
                              fontWeight={300}
                            >
                              Link
                            </Text>
                            <Input
                              fontFamily="Roboto"
                              fontSize={8}
                              fontWeight="normal"
                              inputFrameProps={{
                                cornerRadius: 2,
                                fill: "#FFF",
                                horizontalAlignItems: "center",
                                overflow: "visible",
                                padding: 2,
                                stroke: "#ABABAB",
                                strokeWidth: 1,
                                verticalAlignItems: "center",
                              }}
                              onTextEditEnd={(e) => {
                                let text = e.characters.trim();
                                setCurEvidence({
                                  ...curEvidence,
                                  ...{ link: text },
                                });
                              }}
                              value={curEvidence.link}
                              width={150}
                              paragraphSpacing={5}
                            />
                            <AutoLayout
                              fill="#0D99FF"
                              width={50}
                              onClick={() => {
                                let newEvidence = answer.evidence;
                                newEvidence.push(curEvidence);
                                setCurEvidence({ text: "", link: "" });
                                updateAnswers(answer.category, {
                                  evidence: newEvidence,
                                  editEvidence: false,
                                });
                              }}
                            >
                              <Text
                                fontFamily="Roboto"
                                fontSize={8}
                                fill="#FFF"
                              >
                                Add
                              </Text>
                            </AutoLayout>
                          </AutoLayout>
                        ) : (
                          <Text
                            fontFamily="Roboto"
                            fontSize={8}
                            fontWeight={300}
                            onClick={() =>
                              updateAnswers(answer.category, {
                                editEvidence: true,
                              })
                            }
                          >
                            + Add evidence or connection
                          </Text>
                        )}
                      </AutoLayout>
                    </AutoLayout>
                  ) : null}
                </AutoLayout>
              ))}
            {/* unanswered part */}
            <AutoLayout direction="vertical" spacing={8}>
              {/* unanswered title */}
              <AutoLayout
                direction="horizontal"
                spacing={6}
                hidden={
                  answers.filter((a) => a.answered || a.expanded).length == 0
                }
              >
                <SVG
                  src={unanswerExpand ? expanded : toexpand}
                  onClick={() => setUnanswerExpand(!unanswerExpand)}
                ></SVG>
                <Text fontFamily="Roboto" fontSize={10}>
                  Unanswered Questions
                </Text>
              </AutoLayout>
              {/* unanswered questions */}
              {unanswerExpand ||
              answers.filter((a) => a.answered || a.expanded).length == 0
                ? answers
                    .filter((a) => !a.answered && !a.expanded)
                    .map((answer, i) => (
                      <AutoLayout key={i} direction="vertical" spacing={6}>
                        <AutoLayout direction="horizontal" spacing={6}>
                          <SVG
                            src={expand}
                            onClick={() => {
                              updateAnswers(answer.category, {
                                expanded: !answer.expanded,
                              });
                            }}
                          ></SVG>
                          <Text fontFamily="Roboto" fontSize={10}>
                            {mode == "Questions"
                              ? answer.question
                              : answer.category}
                          </Text>
                        </AutoLayout>
                      </AutoLayout>
                    ))
                : null}
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

export default function () {
  on<FocusHandler>("UPDATE_FOCUS", function () {
    console.log("receice", "id");
  });

  function handleSubmit() {
    console.log("submit"); //=> { greeting: 'Hello, World!' }
  }
  on("SUBMIT", handleSubmit);

  widget.register(Lightbulb);
  console.log("register");
}
