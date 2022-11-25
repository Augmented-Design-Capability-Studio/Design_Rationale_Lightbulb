import {
  Button,
  Container,
  render,
  TextboxMultiline,
  useInitialFocus,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, once } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { LightbulbItem } from "./types";
import styles from "./styles.css";

function Plugin(props: { text: string }) {
  const [lightbulbList, setLightbulbList] = useState<LightbulbItem[]>([]);

  once("ARCHIVE", (newLightbulbList) => handleUpdateArchive(newLightbulbList));
  function handleUpdateArchive(newLightbulbList: LightbulbItem[]) {
    setLightbulbList(newLightbulbList);
    // setFilteredObjects(lightbulbList);
    console.log(newLightbulbList);
  }

  // const [text, setText] = useState(props.text);
  // const handleUpdateButtonClick = useCallback(
  //   function () {
  //     emit("UPDATE_TEXT", text);
  //   },
  //   [text]
  // );
  const handleFocusButtonClick = useCallback(
    function (id: string) {
      // const tempparent = lightbulbList[0].parentNode.id;
      console.log("UPDATE_FOCUS ui", id);
      emit("UPDATE_FOCUS", id);
    },
    [lightbulbList]
  );
  const handleDeleteButtonClick = (index: number, widgetId: string) => {
    console.log("delete index ", index);
    let newList = [...lightbulbList];
    newList.splice(index, 1);
    console.log("splice ", newList);
    setLightbulbList(newList);
    emit("UPDATE_LIST", newList, widgetId);
  };

  return (
    <Container space="medium">
      {/* <VerticalSpace space="large" />
      <TextboxMultiline
        {...useInitialFocus()}
        onValueInput={setText}
        value={text}
        variant="border"
      />
      <VerticalSpace space="large" />
      <Button fullWidth onClick={handleUpdateButtonClick}>
        Update Text
      </Button> */}
      {lightbulbList.map((obj, index) => (
        <div class={styles.archived}>
          <p
            class={styles["parent-title"]}
            onClick={() => handleFocusButtonClick(obj.parentNode.id)}
          >
            {obj.parentNode.name}
          </p>
          {obj.answers?.map((answer) => (
            <div>
              <p>{answer.category}</p>
              <p>{answer.answer}</p>
              <p>{answer.assignee}</p>
              {/* <p>{answer.evidence}</p> */}
            </div>
          ))}
          <Button
            fullWidth
            onClick={() => handleDeleteButtonClick(index, obj.widgetId)}
          >
            Delete
          </Button>
        </div>
      ))}

      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
