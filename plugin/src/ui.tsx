import {
  Button,
  Columns,
  Container,
  Muted,
  render,
  Text,
  TextboxNumeric,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";

import {
  DisplayNodesHandler,
  SaveNodesHandler,
  ToggleWidget,
  CreateWidget,
} from "./types";

function Plugin() {
  const [count, setCount] = useState<number | null>(5);
  const [countString, setCountString] = useState("5");
  const handleSaveNodesButtonClick = useCallback(
    function () {
      if (count !== null) {
        emit<SaveNodesHandler>("SAVE_NODES");
      }
    },
    [count]
  );

  const handleCloseButtonClick = useCallback(function () {
    emit<DisplayNodesHandler>("DISPLAY_NODES");
  }, []);

  const handleToggleWidget = useCallback(function () {
    emit<ToggleWidget>("TOGGLE_WIDGET");
  }, []);

  const handleCreateWidget = useCallback(function () {
    emit<CreateWidget>("CREATE_WIDGET");
  }, []);

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      {/* <Text>
        <Muted>Count</Muted>
      </Text>
      <VerticalSpace space="small" />
      <TextboxNumeric
        onNumericValueInput={setCount}
        onValueInput={setCountString}
        value={countString}
        variant="border"
      /> */}
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={handleSaveNodesButtonClick}>
          Save
        </Button>
        <Button fullWidth onClick={handleCloseButtonClick} secondary>
          Display
        </Button>
      </Columns>
      <br></br>
      <Button fullWidth onClick={handleToggleWidget} secondary>
        Toggle Widget
      </Button>
      <Button fullWidth onClick={handleCreateWidget} secondary>
        Create Widget
      </Button>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
