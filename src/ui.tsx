import {
  Button,
  Container,
  render,
  SearchTextbox,
  TextboxMultiline,
  useInitialFocus,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, once } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { LightbulbItem } from "./types";
import styles from "./styles.css";
import { eye, menu } from "./icons";

function Plugin(props: { text: string }) {
  const [lightbulbList, setLightbulbList] = useState<LightbulbItem[]>([]);
  const [search, setSearch] = useState<string>("");

  once("ARCHIVE", (newLightbulbList) => handleUpdateArchive(newLightbulbList));
  function handleUpdateArchive(newLightbulbList: LightbulbItem[]) {
    setLightbulbList(newLightbulbList);
    // setFilteredObjects(lightbulbList);
    console.log(newLightbulbList);
  }

  const handleFocusButtonClick = useCallback(
    function (id: string) {
      // const tempparent = lightbulbList[0].parentNode.id;
      // console.log("UPDATE_FOCUS ui", id);
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

  function handleSearchInput(newValue: string) {
    console.log(newValue);
    setSearch(newValue);
  }

  const toggleMenu = () => {};

  const toggleHide = () => {};

  return (
    <Container space="large">
      <VerticalSpace space="large" />
      <div class={styles.searchbar}>
        <SearchTextbox onValueInput={handleSearchInput} value={search} />
        <Button>Search</Button>
      </div>
      <div onClick={toggleMenu}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="7" cy="7" r="6.5" stroke="black" />
          <line x1="3" y1="5.5" x2="11" y2="5.5" stroke="black" />
          <line x1="4" y1="7.5" x2="10" y2="7.5" stroke="black" />
          <line x1="5" y1="9.5" x2="9" y2="9.5" stroke="black" />
        </svg>
      </div>
      <div onClick={toggleHide}>
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.7411 5.25857C15.0863 5.70143 15.0863 6.29929 14.7411 6.74143C13.6539 8.13357 11.0455 11 8.00011 11C4.95475 11 2.34631 8.13357 1.2591 6.74143C1.09116 6.52938 1 6.26851 1 6C1 5.73149 1.09116 5.47062 1.2591 5.25857C2.34631 3.86643 4.95475 1 8.00011 1C11.0455 1 13.6539 3.86643 14.7411 5.25857V5.25857Z"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.00013 8.14283C9.20666 8.14283 10.1847 7.18344 10.1847 5.99997C10.1847 4.81651 9.20666 3.85712 8.00013 3.85712C6.79359 3.85712 5.81551 4.81651 5.81551 5.99997C5.81551 7.18344 6.79359 8.14283 8.00013 8.14283Z"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <VerticalSpace space="large" />
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
