import { For, Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { dataURLToBlob } from "./functions";
import Button from "./components/Button";

const [store, setStore] = createStore({
  images: [
    // {
    //   name: "test1",
    //   type: "jpg",
    //   converted: false,
    //   downloaded: false,
    //   url: null,
    // },
  ],
  convertFormat: null,
});

function App() {
  let inputForm;

  function onInput(event) {
    const images = event.target.files;

    if (!images) return;

    setStore("images", (prev) => {
      return Array.from(images)
        .map((img) => ({
          name: img.name,
          converted: false,
          downloaded: false,
          url: URL.createObjectURL(img),
        }))
        .concat(prev);
    });

    inputForm.reset();
  }

  function remove(index) {
    URL.revokeObjectURL(store.images[index].url);
    setStore("images", (prev) => prev.filter((_, i) => i !== index));
  }

  function download(index) {
    const img = store.images[index];
    const link = document.createElement("a");
    link.href = img.url;

    const sname = img.name.split(".");

    link.download = `${sname.slice(0, sname.length - 1).join(".")}.${
      store.convertFormat
    }`;

    link.click();

    setStore("images", index, "downloaded", true);
  }

  function convert() {
    store.images.forEach(async (image, index) => {
      const url = await convertImage(image);
      setStore("images", index, (prev) => ({
        ...prev,
        url: url,
        converted: true,
      }));
    });
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

      <form ref={inputForm}>
        <input
          id="image-input"
          multiple={true}
          type="file"
          accept="image/*"
          hidden
          onInput={onInput}
        />
      </form>

      <main class="py-20">
        <div class="flex flex-col gap-4 items-center mx-auto">
          <For each={store.images}>
            {(img, index) => (
              <div class="w-full flex gap-6 items-center justify-between rounded border px-4 py-2">
                <span class="w-2/3 md:w-1/3">
                  <p class="text-sm">Name</p>
                  <p class="font-medium whitespace-nowrap overflow-hidden">
                    {img.name}
                  </p>
                </span>

                <Show when={!img.converted}>
                  <Button type="danger" onClick={() => remove(index())}>
                    Remove
                  </Button>
                </Show>

                <Show when={img.converted}>
                  <Button
                    type="normal"
                    class={`${img.downloaded && "bg-indigo-200"}`}
                    onClick={() => download(index())}
                  >
                    Download
                  </Button>
                </Show>
              </div>
            )}
          </For>
        </div>

        <Show when={store.images.length !== 0}>
          <div class="flex gap-4 justify-center items-center mt-20">
            <p>Convert to</p>
            <FormatSelection
              format={store.convertFormat}
              setFormat={(format) => {
                setStore("convertFormat", format);
              }}
            />
          </div>

          <div class="flex justify-center mt-20">
            <Button type="normal" onClick={convert}>
              Convert
            </Button>
          </div>
        </Show>
      </main>

      <footer class="h-[15vh]"></footer>
    </div>
  );
}

function FormatSelection(props) {
  const [formats, setFormats] = createSignal(["png", "jpeg", "webp"]);
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
        <div class="absolute inset-0 h-max top-full p-2 rounded bg-white shadow flex flex-col mt-2 gap-2">
          <For each={formats()}>
            {(format) => (
              <button
                class="w-full text-center py-2 bg-gray-100 rounded"
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

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

async function convertImage(image, convertFormat) {
  return new Promise((resolve, reject) => {
    try {
      const imageFile = new Image();
      imageFile.src = image.url;

      imageFile.addEventListener("load", () => {
        canvas.width = imageFile.width;
        canvas.height = imageFile.height;
        ctx.drawImage(imageFile, 0, 0);

        const convertedDataUrl = canvas.toDataURL(`image/${convertFormat}`);

        const blob = dataURLToBlob(convertedDataUrl);
        const objectURL = URL.createObjectURL(blob);

        resolve(objectURL);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export default App;
