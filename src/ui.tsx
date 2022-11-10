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
import { emit, once, on } from "@create-figma-plugin/utilities";
import { Fragment, h, JSX } from "preact";
import { useCallback, useState } from "preact/hooks";
import styles from "./styles.css";

export interface RationaleObject {
  name: string;
  description: string;
  date: string;
  type: string;
}

export interface Answer {
  name: string;
  photo: string;
  date: string;
  answer: string;
  // assignee: string;
  // evidence: { text: string; link: string };
}

function Plugin(props: { text: string }) {
  const [text, setText] = useState(props.text);
  const [archivedObjects, setArchivedObjects] = useState<RationaleObject[]>(
    "archivedObjects",
    []
  );
  const [filteredObjects, setFilteredObjects] = useState<RationaleObject[]>(
    "filteredObjects",
    []
  );
  const [filter, setFilter] = useState<null | string>(null);
  const options: Array<DropdownOption> = [
    { value: "Show all" },
    { value: "Category 1" },
    { value: "Category 2" },
    { value: "Category 3" },
  ];
  const [search, setSearch] = useState<string>("");

  const handleUpdateButtonClick = useCallback(
    function () {
      emit("UPDATE_TEXT", text);
    },
    [text]
  );

  function handleSubmit(rationaleObject: RationaleObject) {
    console.log(rationaleObject); //=> { greeting: 'Hello, World!' }
  }
  once("TEST", handleSubmit);
  once("ARCHIVE", handleUpdateArchive);

  function handleUpdateArchive(archivedObjects: RationaleObject[]) {
    setArchivedObjects(archivedObjects);
    setFilteredObjects(archivedObjects);
  }

  function handleChangeFilter(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;
    console.log(newValue);
    setFilter(newValue);

    // filter the archived objects
    let newFilteredObjects = archivedObjects.filter((obj) => {
      if (newValue == "Show all") return true;
      console.log(obj.type, newValue);

      return obj.type === newValue;
    });
    setFilteredObjects(newFilteredObjects);
  }

  function handleDelete(obj: RationaleObject, index: number) {
    let newArchivedObjects = archivedObjects.splice(index, 1);
    setArchivedObjects(newArchivedObjects);
    setFilteredObjects(newArchivedObjects);
  }

  function handleSearchInput(newValue: string) {
    console.log(newValue);
    setSearch(newValue);
  }

  // if (text === "show Archived") {
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
              <p>{obj.name}</p>
              <p>{obj.date}</p>
              <p>{obj.type}</p>
              <p>{obj.description}</p>
              <Button onClick={() => handleDelete(obj, index)}>Delete</Button>
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
  // } else {
  //   return (
  //     <Container space="medium">
  //       <VerticalSpace space="large" />
  //       {/* <Dropdown onChange={handleChangeFilter} options={options} value={value} />
  //       <Text>{text}</Text>
  //       <TextboxMultiline
  //         {...useInitialFocus()}
  //         onValueInput={setText}
  //         value={text}
  //         variant="border"
  //       /> */}
  //       <VerticalSpace space="large" />
  //       <Button fullWidth onClick={handleUpdateButtonClick}>
  //         Cancel
  //       </Button>
  //       <Button fullWidth onClick={handleUpdateButtonClick}>
  //         Delete
  //       </Button>
  //       <VerticalSpace space="small" />
  //     </Container>
  //   );
  // }
}

export default render(Plugin);
