import { For, Show } from "solid-js";
import { store, setStore, addImages } from "./Store";
import { convertImage } from "./functions";
import Button from "./components/Button";
import ConvertIcon from "./components/icons/Convert";
import Header from "./components/Header";
import TrashIcon from "./components/icons/Trash";
import DownloadIcon from "./components/icons/Download";
import FormatSelection from "./components/FormatSelection";

function App() {
  let inputForm, imageInput;

  function onInput(event) {
    const images = event.target.files;

    if (!images) return;

    addImages(images);

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
      if (image.converted) return;

      setStore("images", index, "converting", true);

      const url = await convertImage(image, store.convertFormat);

      setStore("images", index, (prev) => ({
        ...prev,
        url: url,
        converting: false,
        converted: true,
      }));
    });
  }

  return (
    <div class="w-11/12 2xl:max-w-5xl mx-auto">
      <Header onUploadClick={() => imageInput.click()} />

      <form ref={inputForm}>
        <input
          ref={imageInput}
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

                <Show when={!img.converted && !img.converting}>
                  <Button
                    type="danger"
                    class="px-2"
                    onClick={() => remove(index())}
                  >
                    <TrashIcon />
                  </Button>
                </Show>

                <Show when={img.converting}>
                  <ConvertIcon class="animate-spin" />
                </Show>

                <Show when={img.converted && !img.converting}>
                  <Button
                    type="normal"
                    class={`px-2 ${img.downloaded && "bg-indigo-200"}`}
                    onClick={() => download(index())}
                  >
                    <DownloadIcon />
                  </Button>
                </Show>
              </div>
            )}
          </For>
        </div>

        <Show when={store.images.length === 0}>
          <div class="flex items-center justify-center mt-20">
            <p class="font-medium">Upload images for converting</p>
          </div>
        </Show>

        <Show when={store.images.length !== 0}>
          <div class="flex gap-4 justify-center items-center mt-20">
            <p>Convert to</p>
            <FormatSelection
              formats={store.formats}
              format={store.convertFormat}
              setFormat={(format) => {
                setStore("convertFormat", format);
              }}
            />
          </div>

          <div class="flex justify-center mt-20">
            <Button
              type="normal"
              class="flex gap-2"
              disabled={!store.convertFormat}
              onClick={convert}
            >
              <ConvertIcon />
              <p>Convert</p>
            </Button>
          </div>
        </Show>
      </main>
    </div>
  );
}

export default App;
