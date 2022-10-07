import {
  Button,
  Container,
  render,
  TextboxMultiline,
  useInitialFocus,
  VerticalSpace,
  Dropdown,
  Text,
  DropdownOption,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";

function Plugin(props: { text: string }) {
  const [text, setText] = useState(props.text);
  const handleUpdateButtonClick = useCallback(
    function () {
      emit("UPDATE_TEXT", text);
    },
    [text]
  );

  const [value, setValue] = useState<null | string>(null);
  const options: Array<DropdownOption> = [
    { value: "foo" },
    { value: "bar" },
    { value: "baz" },
    { separator: true },
    { header: "Header" },
    { value: "qux" },
  ];
  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;
    console.log(newValue);
    setValue(newValue);
  }

  // if (text === "show Archived") {
  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Dropdown onChange={handleChange} options={options} value={value} />
      <Text>{text}</Text>
      <TextboxMultiline
        {...useInitialFocus()}
        onValueInput={setText}
        value={text}
        variant="border"
      />
      <VerticalSpace space="large" />
      <Button fullWidth onClick={handleUpdateButtonClick}>
        Update Text
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
  // } else {
  //   return (
  //     <Container space="medium">
  //       <VerticalSpace space="large" />
  //       {/* <Dropdown onChange={handleChange} options={options} value={value} />
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
