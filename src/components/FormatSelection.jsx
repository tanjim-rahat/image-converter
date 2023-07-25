import { createSignal } from "solid-js";
import Button from "./Button";

export default function FormatSelection(props) {
  const [showTray, setShowTray] = createSignal(false);

  return (
    <div class="w-40 relative">
      <Button
        type="normal"
        class="w-full uppercase"
        onClick={() => setShowTray((v) => !v)}
      >
        {props.format || "Select"}
      </Button>
      <Show when={showTray()}>
        <div class="absolute inset-0 h-max top-full p-2 rounded bg-white dark:bg-dark shadow flex flex-col mt-2 gap-2 z-50">
          <For each={props.formats}>
            {(format) => (
              <button
                class="w-full text-center py-2 bg-gray-100 dark:bg-dark2 rounded"
                onClick={() => {
                  props.setFormat(format);
                  setShowTray(false);
                }}
              >
                {format}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
