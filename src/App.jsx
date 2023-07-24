import { For, createEffect } from "solid-js";
import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
  images: [
    {
      name: "test1",
      type: "jpg",
    },
  ],
});

createEffect(() => {
  console.log(store.images);
});

function App() {
  function onInput(event) {
    const images = event.target.files;

    if (!images) return;

    setStore("images", (prev) => {
      return Array.from(images)
        .map((img) => ({
          name: img.name,
          type: img.type,
          size: img.size,
          url: URL.createObjectURL(img),
        }))
        .concat(prev);
    });
  }

  function remove(index) {
    setStore("images", (prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div class="w-11/12 2xl:max-w-5xl mx-auto">
      <header class="w-full h-[10vh] flex items-center justify-between">
        <h1 class="text-3xl font-bold">Image Convert</h1>

        <label
          for="image-input"
          class="font-medium text-lg cursor-pointer px-4 py-2 rounded bg-indigo-500 text-white shadow"
        >
          Add Image
        </label>
      </header>

      <input
        id="image-input"
        multiple={true}
        type="file"
        accept="image/*"
        hidden
        onInput={onInput}
      />

      <main class="py-20">
        <div class="flex flex-col gap-4 items-center mx-auto">
          <For each={store.images}>
            {(img, index) => (
              <div class="w-full flex gap-6 items-center justify-between rounded border px-4 py-2 font-medium">
                <span class="w-1/3">
                  <p class="text-sm">Name</p>
                  <p class="font-medium whitespace-nowrap overflow-hidden">
                    {img.name}
                  </p>
                </span>

                <Button type="danger" onClick={() => remove(index())}>
                  Remove
                </Button>
              </div>
            )}
          </For>
        </div>

        <div class="flex justify-center mt-40">
          <Button>Convert</Button>
        </div>
      </main>

      <footer class="h-[15vh]"></footer>
    </div>
  );
}

function Button(props) {
  return (
    <button
      class={`px-4 py-2 rounded bg-red-500 font-medium text-lg text-white shadow ${props.class}`}
      classList={{
        "bg-red-500": props.type === "danger",
        "bg-indigo-500": !props.type || props.type === "normal",
      }}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default App;
