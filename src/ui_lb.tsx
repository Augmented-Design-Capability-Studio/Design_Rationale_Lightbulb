import {
  Button,
  Container,
  render,
  TextboxMultiline,
  useInitialFocus,
  VerticalSpace,
  Dropdown,
  Text,
  Textbox,
  DropdownOption,
} from "@create-figma-plugin/ui";
import {
  emit,
  once,
  on,
  getSceneNodeById,
} from "@create-figma-plugin/utilities";
import { Fragment, h, JSX } from "preact";
import { useCallback, useState } from "preact/hooks";
import styles from "./styles.css";
import { Answer, Evidence, LightbulbItem } from "./types";
import { FocusHandler } from "./types";

function Plugin(props: { text: string }) {
  const [lightbulbList, setLightbulbList] = useState<LightbulbItem[]>([]);
  const [filteredObjects, setFilteredObjects] = useState<LightbulbItem[]>([]);
  const [filter, setFilter] = useState<null | string>(null);
  const [focusId, setFocusId] = useState<string>("");
  const options: Array<DropdownOption> = [
    { value: "Show all" },
    { value: "Category 1" },
    { value: "Category 2" },
    { value: "Category 3" },
  ];
  const [search, setSearch] = useState<string>("");

  once("TEST", (test) => console.log(test));
  once("ARCHIVE", (lightbulbList) => handleUpdateArchive(lightbulbList));
  once("TESTAGAIN", () => console.log("test again"));
  emit("UPDATE_FOCUS", "id");

  function handleUpdateArchive(lightbulbList: LightbulbItem[]) {
    setLightbulbList(lightbulbList);
    setFilteredObjects(lightbulbList);
    console.log("lightbulbList");
  }

  function handleChangeFilter(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;
    console.log(newValue);
    setFilter(newValue);

    // filter the archived objects
    let newFilteredObjects = lightbulbList.filter((obj) => {
      if (newValue == "Show all") return true;
      console.log(obj, newValue);

      // return obj === newValue;
    });
    setFilteredObjects(newFilteredObjects);
  }

  function handleDelete(obj: LightbulbItem, index: number) {
    let newArchivedObjects = lightbulbList.splice(index);
    setLightbulbList(newArchivedObjects);
    setFilteredObjects(newArchivedObjects);
  }

  function handleSearchInput(newValue: string) {
    console.log(newValue);
    setSearch(newValue);
    emit("UPDATE_FOCUS", "id");
  }

  const handleFocus = function (id: string) {
    console.log("handle focus ui ", id);
    emit("UPDATE_FOCUS", "id");
    const data = { greeting: "Hello, World!" };
    emit("SUBMIT");
    setFocusId(id);
    handleUpdateButtonClick();
  };

  const handleUpdateButtonClick = useCallback(function () {
    console.log("handleUpdateButtonClick");
    emit<FocusHandler>("UPDATE_FOCUS");
  }, []);

  return (
    <Fragment>
      <div class={styles.container}>
        <Container space="extraLarge">
          <VerticalSpace space="large" />
          <Text>Filter: </Text>
          <Dropdown
            onChange={handleChangeFilter}
            options={options}
            value={filter}
            placeholder="select a catogory"
          ></Dropdown>
          <VerticalSpace space="large" />

          <VerticalSpace space="large" />
          <Textbox onValueInput={handleSearchInput} value={search} />
          <Button>Search</Button>
          <VerticalSpace space="large" />

          {filteredObjects.map((obj, index) => (
            <div class={styles.archived}>
              <p
                class={styles["parent-title"]}
                onClick={() => handleFocus(obj.parentNode.id)}
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
              {/* <Button onClick={() => handleDelete(obj, index)}>Delete</Button> */}
            </div>
          ))}
          {/* <TextboxMultiline
            {...useInitialFocus()}
            onValueInput={setText}
            value={text}
            variant="border"
          /> */}
          <VerticalSpace space="large" />
          {/* <Button fullWidth onClick={handleUpdateButtonClick}>
            Update Text
          </Button> */}
          <VerticalSpace space="small" />
        </Container>
      </div>
    </Fragment>
  );
}

export default render(Plugin);
