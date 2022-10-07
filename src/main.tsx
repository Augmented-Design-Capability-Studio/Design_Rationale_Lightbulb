/** @jsx figma.widget.h */

import { once, showUI } from "@create-figma-plugin/utilities";

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

// function Lightbulb() {
//   const [text, setText] = useSyncedState("text", "Hello\nWidgets");
//   const items: Array<WidgetPropertyMenuItem> = [
//     {
//       itemType: "action",
//       propertyName: "edit",
//       tooltip: "Edit",
//     },
//   ];
//   async function onChange({
//     propertyName,
//   }: WidgetPropertyEvent): Promise<void> {
//     await new Promise<void>(function (resolve: () => void): void {
//       if (propertyName === "edit") {
//         showUI({ height: 144, width: 240 }, { text });
//         once("UPDATE_TEXT", function (text: string): void {
//           setText(text);
//           resolve();
//         });
//       }
//     });
//   }
//   usePropertyMenu(items, onChange);
//   return (
//     <AutoLayout
//       direction="horizontal"
//       effect={{
//         blur: 2,
//         color: { a: 0.2, b: 0, g: 0, r: 0 },
//         offset: { x: 0, y: 0 },
//         spread: 2,
//         type: "drop-shadow",
//       }}
//       fill="#FFFFFF"
//       height="hug-contents"
//       horizontalAlignItems="center"
//       padding={8}
//       spacing={12}
//       verticalAlignItems="center"
//     >
//       <AutoLayout
//         direction="vertical"
//         horizontalAlignItems="start"
//         verticalAlignItems="start"
//       >
//         {text.split("\n").map((line) => {
//           return line ? (
//             <Text fontSize={12} horizontalAlignText="left" width="fill-parent">
//               {line}
//             </Text>
//           ) : null;
//         })}
//       </AutoLayout>
//     </AutoLayout>
//   );
// }

type VerticalHorizontalPadding = {
  vertical?: number;
  horizontal?: number;
};

function createTime() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const currentDate = `${day}-${month}-${year}`;
  console.log(currentDate);
  return currentDate;
}

function Lightbulb() {
  const [showName, setShowName] = useSyncedState<boolean>("showName", true);
  const [name, setName] = useSyncedState<string>("name", "");
  const [photoUrl, setPhotoUrl] = useSyncedState<string | null>(
    "photoUrl",
    null
  );
  const [text, setText] = useSyncedState("text", "");
  const [open, setOpen] = useSyncedState("open", true);
  const [full, setFull] = useSyncedState("full", false);
  const [editMode, setEditMode] = useSyncedState("editMode", false);
  const [type, setType] = useSyncedState("type", "Design Rationale");
  const [selectOn, setSelectOn] = useSyncedState("selectOn", false);
  const [date, setDate] = useSyncedState("date", createTime());

  const color = "#FCF782";
  const bulbSvgSrc = `<svg style="color: #f3da35" width="50" height="50" stroke-width="1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21 2L20 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M3 2L4 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M21 16L20 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M3 16L4 15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M9 18H15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M10 21H14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> <path d="M11.9998 3C7.9997 3 5.95186 4.95029 5.99985 8C6.02324 9.48689 6.4997 10.5 7.49985 11.5C8.5 12.5 9 13 8.99985 15H14.9998C15 13.0001 15.5 12.5 16.4997 11.5001L16.4998 11.5C17.4997 10.5 17.9765 9.48689 17.9998 8C18.0478 4.95029 16 3 11.9998 3Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="${color}"></path> </svg>`;
  const threedots = `<svg width="20" height="7" viewBox="0 0 20 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="20" height="7" rx="2" fill="#191919"/>
<path d="M10 5C10.3978 5 10.7794 4.84196 11.0607 4.56066C11.342 4.27936 11.5 3.89782 11.5 3.5C11.5 3.10218 11.342 2.72064 11.0607 2.43934C10.7794 2.15804 10.3978 2 10 2C9.60218 2 9.22064 2.15804 8.93934 2.43934C8.65804 2.72064 8.5 3.10218 8.5 3.5C8.5 3.89782 8.65804 4.27936 8.93934 4.56066C9.22064 4.84196 9.60218 5 10 5ZM3.5 5C3.89782 5 4.27936 4.84196 4.56066 4.56066C4.84196 4.27936 5 3.89782 5 3.5C5 3.10218 4.84196 2.72064 4.56066 2.43934C4.27936 2.15804 3.89782 2 3.5 2C3.10218 2 2.72064 2.15804 2.43934 2.43934C2.15804 2.72064 2 3.10218 2 3.5C2 3.89782 2.15804 4.27936 2.43934 4.56066C2.72064 4.84196 3.10218 5 3.5 5ZM16.5 5C16.8978 5 17.2794 4.84196 17.5607 4.56066C17.842 4.27936 18 3.89782 18 3.5C18 3.10218 17.842 2.72064 17.5607 2.43934C17.2794 2.15804 16.8978 2 16.5 2C16.1022 2 15.7206 2.15804 15.4393 2.43934C15.158 2.72064 15 3.10218 15 3.5C15 3.89782 15.158 4.27936 15.4393 4.56066C15.7206 4.84196 16.1022 5 16.5 5Z" fill="#FCF782"/>
</svg>`;
  const editIcon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.333 13.9484L14.57 1.71043C15.0534 1.2478 15.6988 0.992841 16.3679 1.00015C17.037 1.00747 17.6767 1.27647 18.1499 1.74956C18.6231 2.22265 18.8923 2.86222 18.8998 3.53132C18.9073 4.20042 18.6525 4.84586 18.19 5.32943L5.951 17.5674C5.6718 17.8467 5.3162 18.037 4.929 18.1144L1 18.9004L1.786 14.9704C1.86345 14.5832 2.05378 14.2276 2.333 13.9484Z" fill="white" stroke="#191919" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.5 4.40043L15.5 7.40043L12.5 4.40043Z" fill="white"/>
<path d="M12.5 4.40043L15.5 7.40043" stroke="#191919" stroke-width="2"/>
</svg>`;
  const dropdown = `<svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="0" fill="none" width="24" height="24"/><g><path d="M7 10l5 5 5-5"/></g></svg>`;
  const cross = `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="1.70711" y1="1" x2="11" y2="10.2929" stroke="#191919" stroke-linecap="round"/> <line x1="0.5" y1="-0.5" x2="13.6421" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 11 1)" stroke="#191919" stroke-linecap="round"/> </svg>`;
  const archive = `<svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.35714 5V17H18.6429V5M1 1V5H20V1H1ZM7.78571 8.33333H13.2143H7.78571Z" fill="white"/>
<path d="M2.35714 5V17H18.6429V5M7.78571 8.33333H13.2143M1 1V5H20V1H1Z" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  const link = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.12658 13.114C1.48404 13.472 1.90872 13.7558 2.3762 13.9492C2.84369 14.1425 3.34477 14.2416 3.85065 14.2407C4.35665 14.2415 4.85784 14.1425 5.32545 13.9491C5.79306 13.7558 6.21787 13.472 6.5755 13.114L8.75476 10.934L7.66513 9.84439L5.48587 12.0244C5.05161 12.4567 4.4638 12.6994 3.85104 12.6994C3.23828 12.6994 2.65047 12.4567 2.21621 12.0244C1.78352 11.5904 1.54055 11.0025 1.54055 10.3896C1.54055 9.7767 1.78352 9.18881 2.21621 8.75476L4.39624 6.5755L3.30661 5.48587L1.12658 7.66513C0.40515 8.3883 0 9.36809 0 10.3896C0 11.4111 0.40515 12.3909 1.12658 13.114ZM13.114 6.5755C13.8351 5.85212 14.24 4.87241 14.24 3.85104C14.24 2.82967 13.8351 1.84996 13.114 1.12658C12.3909 0.40515 11.4111 0 10.3896 0C9.36809 0 8.3883 0.40515 7.66513 1.12658L5.48587 3.30661L6.5755 4.39624L8.75476 2.21621C9.18901 1.7839 9.77683 1.54119 10.3896 1.54119C11.0023 1.54119 11.5902 1.7839 12.0244 2.21621C12.4571 2.65027 12.7001 3.23816 12.7001 3.85104C12.7001 4.46392 12.4571 5.05181 12.0244 5.48587L9.84439 7.66513L10.934 8.75476L13.114 6.5755Z" fill="#191919"/>
<path d="M4.39545 10.9348L3.30505 9.84516L9.84514 3.30584L10.9348 4.39624L4.39545 10.9348Z" fill="#191919"/>
</svg>
`;
  const addlink = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="7" cy="7" r="7" fill="white"/>
<path d="M6.94602 9.49574V5H7.55327V9.49574H6.94602ZM5 7.54972V6.94602H9.49929V7.54972H5Z" fill="#191919"/>
</svg>`;

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

  async function onChange({
    propertyName,
  }: WidgetPropertyEvent): Promise<void> {
    await new Promise<void>(function (resolve: () => void): void {
      if (propertyName === "showArchived") {
        showUI({ height: 144, width: 240 }, { "show Archive": String });
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

  return (
    <AutoLayout
      direction="horizontal"
      height="hug-contents"
      padding={4}
      name="Widget"
      overflow="visible"
    >
      <SVG src={bulbSvgSrc} onClick={() => setOpen(!open)} />
      {full ? (
        <AutoLayout
          direction="vertical"
          verticalAlignItems="start"
          height="hug-contents"
          padding={4}
          fill="#FCF782"
          cornerRadius={8}
          spacing={6}
          hidden={!open}
          // effect={{
          //   type: "drop-shadow",
          //   color: { r: 0, g: 0, b: 0, a: 0.2 },
          //   offset: { x: 0, y: 0 },
          //   blur: 2,
          //   spread: 2,
          // }}
        >
          {/* header */}
          <AutoLayout
            direction="horizontal"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            height="hug-contents"
            padding={{ top: 5, left: 8, bottom: 0, right: 8 }}
            spacing={12}
          >
            <AutoLayout
              direction="horizontal"
              horizontalAlignItems="center"
              verticalAlignItems="center"
              height="hug-contents"
              padding={5}
              spacing={8}
            >
              {photoUrl ? (
                <Image
                  cornerRadius={24}
                  width={24}
                  height={24}
                  src={photoUrl}
                />
              ) : (
                <Rectangle
                  cornerRadius={24}
                  width={24}
                  height={24}
                  fill="#2A2A2A"
                />
              )}

              <Text fontFamily="Inter" fontSize={14} fontWeight={600}>
                {name}
              </Text>
              <Text fontFamily="Inter" fontSize={12} fill="#818181">
                {date}
              </Text>
            </AutoLayout>

            <AutoLayout
              direction="horizontal"
              horizontalAlignItems="center"
              verticalAlignItems="center"
              height="hug-contents"
              padding={5}
              spacing={8}
            >
              <SVG
                src={editIcon}
                tooltip={"edit"}
                onClick={() => {
                  setEditMode(!editMode);
                  console.log("click on edit, current edit mode is ", editMode);
                }}
              ></SVG>
              <SVG
                src={archive}
                tooltip={"archive"}
                onClick={() => {
                  console.log("click on archive");
                }}
              ></SVG>
              <SVG
                src={link}
                tooltip={"copy link"}
                onClick={() => {
                  const widget_link = `https://www.figma.com/file/${fileKey}?node-id=${widgetId}`;
                  console.log("click on link ", widget_link);
                }}
              ></SVG>
              <SVG
                src={cross}
                onClick={() => {
                  setFull(false);
                  console.log("click on cross, current full is ", full);
                  setEditMode(false);
                }}
              ></SVG>
            </AutoLayout>
          </AutoLayout>

          {/* body */}
          <AutoLayout
            direction="vertical"
            height="hug-contents"
            padding={{ vertical: 0, horizontal: 20 }}
            spacing={5}
          >
            {/* dropdown menu */}
            {selectOn ? (
              <AutoLayout direction="horizontal" verticalAlignItems="start">
                <AutoLayout direction="vertical">
                  <Text
                    fontFamily="Inter"
                    fontSize={12}
                    onClick={() => {
                      setType("Design Rationale");
                      setSelectOn(false);
                      setDate(createTime());
                    }}
                  >
                    Design Rationale
                  </Text>
                  <Text
                    fontFamily="Inter"
                    fontSize={12}
                    onClick={() => {
                      setType("Option 2");
                      setSelectOn(false);
                      setDate(createTime());
                    }}
                  >
                    Option 2
                  </Text>
                  <Text
                    fontFamily="Inter"
                    fontSize={12}
                    onClick={() => {
                      setType("Option 3");
                      setSelectOn(false);
                      setDate(createTime());
                    }}
                  >
                    Option 3
                  </Text>
                </AutoLayout>
                <SVG src={dropdown} onClick={() => setSelectOn(false)}></SVG>
              </AutoLayout>
            ) : (
              <AutoLayout direction="horizontal" verticalAlignItems="center">
                <Text fontFamily="Inter" fontSize={12}>
                  {type}
                </Text>
                <SVG src={dropdown} onClick={() => setSelectOn(true)}></SVG>
              </AutoLayout>
            )}

            {/* text edit */}
            {editMode ? (
              <Input
                fontFamily="Inter"
                fontSize={12}
                fontWeight="normal"
                inputFrameProps={{
                  cornerRadius: 10,
                  fill: "#FFF",
                  horizontalAlignItems: "center",
                  overflow: "visible",
                  padding: 10,
                  stroke: color,
                  strokeWidth: 1,
                  verticalAlignItems: "center",
                }}
                onTextEditEnd={(e) => {
                  setEditMode(false);
                  setText(e.characters.trim());
                  setDate(createTime());
                }}
                placeholder={`Your design rationale here...`}
                value={text}
                width={270}
                // inputBehavior="multiline"
                paragraphSpacing={5}
              />
            ) : (
              <AutoLayout padding={{ vertical: 2, horizontal: 5 }}>
                <Text
                  fontFamily="Inter"
                  fontSize={12}
                  fontWeight={500}
                  paragraphSpacing={5}
                  width={270}
                >
                  {text}
                </Text>
              </AutoLayout>
            )}

            {/* add link */}
            <AutoLayout>
              <SVG
                src={addlink}
                onClick={() => {
                  console.log("add link");
                  onDelete;
                }}
              ></SVG>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      ) : (
        <AutoLayout
          direction="vertical"
          verticalAlignItems="start"
          height="hug-contents"
          padding={4}
          fill={{ r: 0, g: 0, b: 0, a: 0 }}
          spacing={6}
          hidden={!open}
        >
          {/* header */}
          <AutoLayout
            direction="horizontal"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            height="hug-contents"
            padding={{ top: 5, left: 8, bottom: 0, right: 8 }}
            spacing={12}
          >
            <AutoLayout
              direction="horizontal"
              horizontalAlignItems="center"
              verticalAlignItems="center"
              height="hug-contents"
              padding={5}
              spacing={8}
            >
              <Text fontFamily="Inter" fontSize={12}>
                {type}
              </Text>
            </AutoLayout>

            <AutoLayout
              direction="horizontal"
              horizontalAlignItems="center"
              verticalAlignItems="center"
              height="hug-contents"
              padding={5}
              spacing={8}
            >
              <SVG
                src={threedots}
                onClick={() => {
                  setFull(true);
                  console.log("click on three dots, current full is ", full);
                }}
              ></SVG>
            </AutoLayout>
          </AutoLayout>

          <AutoLayout padding={12} cornerRadius={8} fill="#FFF">
            <Text
              fontFamily="Inter"
              fontSize={12}
              fontWeight={500}
              paragraphSpacing={5}
              width={270}
            >
              {text}
            </Text>
          </AutoLayout>
        </AutoLayout>
      )}
    </AutoLayout>
  );
}
