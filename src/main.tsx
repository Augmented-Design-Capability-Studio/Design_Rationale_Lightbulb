/** @jsx figma.widget.h */

import { emit, once, showUI } from "@create-figma-plugin/utilities";
import { RationaleObject } from "./ui";
import { useCallback, useState } from "preact/hooks";

// import expand from "./icons/expand.svg";
// import addlink from "./icons/addlink.svg";
// import link from "./icons/link.svg";
// import archive from "./icons/archive.svg";
// import cross from "./icons/cross.svg";
// import dropdown from "./icons/dropdown.svg";
// import edit from "./icons/edit.svg";
// import threedots from "./icons/threedots.svg";

const expand = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="5" cy="5" r="4.5" fill="#FDB827" stroke="#27251F"/>
<path d="M4.96155 6.78265V3.57141H5.3953V6.78265H4.96155ZM3.57153 5.39264V4.96143H6.78531V5.39264H3.57153Z" fill="#27251F"/>
</svg>`;
const toexpand = `<svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.64541e-06 10.5423C-0.000332796 10.4819 0.0109533 10.4219 0.0332194 10.3659C0.0554854 10.3099 0.0882931 10.259 0.129761 10.2161L4.73378 5.48727L0.129762 0.758472C0.0564614 0.670558 0.0181596 0.557474 0.0225091 0.441815C0.0268586 0.326157 0.0735388 0.216443 0.153223 0.1346C0.232907 0.0527559 0.339726 0.00480986 0.452332 0.000342483C0.564939 -0.00412489 0.675041 0.0352156 0.760634 0.110502L6 5.48727L0.760633 10.8686C0.697822 10.9319 0.618257 10.9747 0.531883 10.9917C0.44551 11.0088 0.356159 10.9993 0.274999 10.9645C0.193838 10.9297 0.124468 10.8711 0.0755591 10.796C0.0266501 10.7209 0.000371286 10.6327 7.64541e-06 10.5423Z" fill="#27251F"/>
</svg>`;
const expanded = `<svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.457654 0.500007C0.518134 0.499667 0.578088 0.510953 0.63408 0.533219C0.69007 0.555485 0.740995 0.588293 0.783936 0.629761L5.51273 5.23378L10.2415 0.629762C10.3294 0.556461 10.4425 0.518159 10.5582 0.522509C10.6738 0.526858 10.7836 0.573539 10.8654 0.653223C10.9472 0.732907 10.9952 0.839726 10.9997 0.952332C11.0041 1.06494 10.9648 1.17504 10.8895 1.26063L5.51273 6.5L0.131372 1.26063C0.0681338 1.19782 0.0253138 1.11826 0.00826216 1.03188C-0.00878953 0.945509 0.000684278 0.856159 0.0354991 0.774998C0.070314 0.693838 0.128927 0.624468 0.20401 0.575559C0.279092 0.526649 0.367317 0.500371 0.457654 0.500007Z" fill="#27251F"/>
</svg>`;

const { widget } = figma;
const {
  AutoLayout,
  Image,
  Rectangle,
  Text,
  useSyncedState,
  usePropertyMenu,
  useWidgetId,
  useEffect,
  Input,
  Frame,
  SVG,
} = widget;
export default function () {
  widget.register(Lightbulb);
}

const questions: { [category: string]: string } = {
  "Design Rationale": "Why is this designed this way?",
  Function: "What is the function of this?",
  Behavior: "How does this behave?",
  "Additional Context": "What else is important for this?",
  Task: "What needs to be done to this?",
  Problems: "What is wrong with this?",
};
interface Answers {
  category: string;
  question: string;
  answered: boolean;
  answer: string;
  expanded: boolean;
}

const initAnswers = Object.keys(questions).map((c) => ({
  category: c,
  question: questions[c],
  answered: false,
  answer: "",
  expanded: false,
}));

function createTime() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const currentDate = `${day}-${month}-${year}`;
  console.log(currentDate);
  return currentDate;
}

function Component(props: any) {
  const [state, setState] = useSyncedState<boolean>("state", true);
  console.log(props);
  return (
    <AutoLayout
      direction="vertical"
      verticalAlignItems="start"
      height="hug-contents"
      spacing={6}
      padding={12}
    >
      <Text onClick={() => setState(!state)}>test component {props}</Text>
      <AutoLayout hidden={state}>
        <Text>show</Text>
      </AutoLayout>
    </AutoLayout>
  );
}

function Lightbulb() {
  const [showName, setShowName] = useSyncedState<boolean>("showName", true);
  const [name, setName] = useSyncedState<string>("name", "");
  const [photoUrl, setPhotoUrl] = useSyncedState<string | null>(
    "photoUrl",
    null
  );
  const [text, setText] = useSyncedState<string>("text", "");
  const [open, setOpen] = useSyncedState("open", true);
  const [full, setFull] = useSyncedState("full", false);
  const [editMode, setEditMode] = useSyncedState("editMode", false);
  const [type, setType] = useSyncedState<string>("type", "Category 1");
  const [selectOn, setSelectOn] = useSyncedState("selectOn", false);
  const [date, setDate] = useSyncedState("date", createTime());

  const [mode, setMode] = useSyncedState<string>("mode", "Questions"); // questions or categories
  const [answers, setAnswers] = useSyncedState<Answers[]>(
    "answers",
    initAnswers
  ); // stores all answers, initial value = {}
  const [unanswerExpand, setUnanswerExpand] = useSyncedState<boolean>(
    "unanswerExpand",
    false
  );

  // const [archivedObjects, setArchivedObjects] = useSyncedState<
  //   RationaleObject[]
  // >("archivedObjects", []);

  const color = "#FCF782";
  const bulbSvgSrc = `<svg style="color: #f3da35" width="50" height="50" stroke-width="1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21 2L20 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M3 2L4 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M21 16L20 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M3 16L4 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M9 18H15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M10 21H14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M11.9998 3C7.9997 3 5.95186 4.95029 5.99985 8C6.02324 9.48689 6.4997 10.5 7.49985 11.5C8.5 12.5 9 13 8.99985 15H14.9998C15 13.0001 15.5 12.5 16.4997 11.5001L16.4998 11.5C17.4997 10.5 17.9765 9.48689 17.9998 8C18.0478 4.95029 16 3 11.9998 3Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> </svg>`;

  const widgetId = useWidgetId();
  const fileKey = figma.fileKey;

  useEffect(() => {
    if (!name) {
      if (figma.currentUser) {
        setName(figma.currentUser.name);
        setPhotoUrl(figma.currentUser.photoUrl);
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

  const handleArchived = (archivedObject: RationaleObject) => {
    let archivedObjects: RationaleObject[] =
      figma.currentPage.getPluginData("archivedObjects") === ""
        ? []
        : JSON.parse(figma.currentPage.getPluginData("archivedObjects"));
    archivedObjects.push(archivedObject);
    figma.currentPage.setPluginData(
      "archivedObjects",
      JSON.stringify(archivedObjects)
    );
    // emit("ARCHIVE", rationaleObject);
  };

  async function onChange({
    propertyName,
  }: WidgetPropertyEvent): Promise<void> {
    await new Promise<void>(function (resolve: () => void): void {
      if (propertyName === "showArchived") {
        showUI(
          { height: 1200, width: 300, position: { x: 0, y: 0 } },
          { "show Archive": String }
        );
        let archivedObjects: RationaleObject[] =
          figma.currentPage.getPluginData("archivedObjects") === ""
            ? []
            : JSON.parse(figma.currentPage.getPluginData("archivedObjects"));
        emit("TEST", "test from showUI");
        emit("ARCHIVE", archivedObjects);
        // once("UPDATE_TEXT", function (text: string): void {
        //   setText(text);
        //   resolve();
        // });
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
    console.log("updateAnswers", newData);
    let newAnswers = answers;
    let index = newAnswers.findIndex((a) => a.category == category);
    newAnswers[index] = { ...answers[index], ...newData };
    setAnswers(newAnswers);
    console.log("newAnswers", newAnswers);
  };

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
          {(Array.isArray(answers) ? answers.filter((a) => a.answered) : [])
            .length == 0 ? (
            // when there is no answer
            answers.filter((a) => a.expanded).length == 0 ? (
              // and no category expanded
              answers.map((answer) => (
                <AutoLayout direction="vertical" spacing={6}>
                  <AutoLayout direction="horizontal" spacing={6}>
                    <SVG
                      src={expand}
                      onClick={() => {
                        updateAnswers(answer.category, { expanded: true });
                      }}
                    ></SVG>
                    <Text fontFamily="Roboto" fontSize={10}>
                      {mode == "Questions" ? answer.question : answer.category}
                    </Text>
                  </AutoLayout>
                </AutoLayout>
              ))
            ) : (
              // when there is category expanded
              <AutoLayout direction="vertical" spacing={8}>
                {/* the expanded question */}
                {answers
                  .filter((a) => a.expanded)
                  .map((answer) => (
                    <AutoLayout direction="vertical" spacing={6}>
                      {/* profile */}
                      <AutoLayout
                        direction="horizontal"
                        horizontalAlignItems="center"
                        verticalAlignItems="center"
                        height="hug-contents"
                        padding={0}
                        spacing={8}
                      >
                        {photoUrl ? (
                          <Image
                            cornerRadius={18}
                            width={18}
                            height={18}
                            src={photoUrl}
                          />
                        ) : (
                          <Rectangle
                            cornerRadius={18}
                            width={18}
                            height={18}
                            fill="#2A2A2A"
                          />
                        )}
                        <Text fontFamily="Inter" fontSize={10} fontWeight={400}>
                          {name}
                        </Text>
                        <Text fontFamily="Inter" fontSize={10} fill="#818181">
                          {date}
                        </Text>
                      </AutoLayout>
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
                          {mode == "Questions"
                            ? answer.question
                            : answer.category}
                        </Text>
                      </AutoLayout>
                      {/* text/input */}
                      <Input
                        fontFamily="Roboto"
                        fontSize={10}
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
                          updateAnswers(answer.category, {
                            answer: e.characters.trim(),
                            answered: true,
                          });
                          setDate(createTime());
                        }}
                        value={answer.answer}
                        width={150}
                        paragraphSpacing={5}
                        hidden={answer.expanded}
                      />
                    </AutoLayout>
                  ))}
                {/* unanswered part */}
                <AutoLayout direction="vertical" spacing={6}>
                  {/* unanswered title */}
                  <AutoLayout direction="horizontal" spacing={6}>
                    <SVG
                      src={unanswerExpand ? expanded : toexpand}
                      onClick={() => setUnanswerExpand(!unanswerExpand)}
                    ></SVG>
                    <Text fontFamily="Roboto" fontSize={10}>
                      Unanswered Questions
                    </Text>
                  </AutoLayout>
                  {/* unanswered questions */}
                  {unanswerExpand ? (
                    answers
                      .filter((a) => !a.answered && !a.expanded)
                      .map((answer) => (
                        <AutoLayout direction="vertical" spacing={6}>
                          <AutoLayout direction="horizontal" spacing={6}>
                            <SVG
                              src={expand}
                              onClick={() => {
                                updateAnswers(answer.category, {
                                  expanded: true,
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
                  ) : (
                    <AutoLayout></AutoLayout>
                  )}
                </AutoLayout>
              </AutoLayout>
            )
          ) : (
            // when there are answers
            <AutoLayout direction="vertical" spacing={6}>
              {/* answered part */}
              {answers
                .filter((a) => a.answered || a.expanded)
                .map((answer) => (
                  <AutoLayout direction="vertical" spacing={6}>
                    {/* profile */}
                    <AutoLayout
                      direction="horizontal"
                      horizontalAlignItems="center"
                      verticalAlignItems="center"
                      height="hug-contents"
                      padding={0}
                      spacing={8}
                    >
                      {photoUrl ? (
                        <Image
                          cornerRadius={18}
                          width={18}
                          height={18}
                          src={photoUrl}
                        />
                      ) : (
                        <Rectangle
                          cornerRadius={18}
                          width={18}
                          height={18}
                          fill="#2A2A2A"
                        />
                      )}
                      <Text fontFamily="Inter" fontSize={10} fontWeight={400}>
                        {name}
                      </Text>
                      <Text fontFamily="Inter" fontSize={10} fill="#818181">
                        {date}
                      </Text>
                    </AutoLayout>
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
                        {mode == "Questions"
                          ? answer.question
                          : answer.category}
                      </Text>
                    </AutoLayout>
                    {/* text/input */}
                    {answer.expanded ? (
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
                          updateAnswers(answer.category, {
                            answer: e.characters.trim(),
                            answered: true,
                          });
                          setDate(createTime());
                        }}
                        value={answer.answer}
                        width={150}
                        paragraphSpacing={5}
                      />
                    ) : null}
                  </AutoLayout>
                ))}
              {/* unanswered part */}
              <AutoLayout direction="vertical" spacing={6}>
                {/* unanswered title */}
                <AutoLayout direction="horizontal" spacing={6}>
                  <SVG
                    src={unanswerExpand ? expanded : toexpand}
                    onClick={() => setUnanswerExpand(!unanswerExpand)}
                  ></SVG>
                  <Text fontFamily="Roboto" fontSize={10}>
                    Unanswered Questions
                  </Text>
                </AutoLayout>
                {/* unanswered questions */}
                {unanswerExpand
                  ? answers
                      .filter((a) => !a.answered && !a.expanded)
                      .map((answer) => (
                        <AutoLayout direction="vertical" spacing={6}>
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
          )}
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}
