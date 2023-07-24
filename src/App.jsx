import { For, Show } from "solid-js";
import JSZip from "jszip";

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

  // const images = () => {
  //   const images = [...store.images];
  //   return images.sort((a, b) => a.size - b.size);
  // };

  function onInput(event) {
    const images = event.target.files;

    if (!images) return;

    addImages(images);

    inputForm.reset();
  }

  function convertedName(name, format) {
    const sname = name.split(".");
    return `${sname.slice(0, sname.length - 1).join(".")}.${format}`;
  }

  function remove(index) {
    URL.revokeObjectURL(store.images[index].url);
    setStore("images", (prev) => prev.filter((_, i) => i !== index));
  }

  function downloadImage(index) {
    const img = store.images[index];

    download(img.url, convertedName(img.name, store.convertFormat));

    setStore("images", index, "downloaded", true);
  }

  async function downloadZip() {
    const zip = new JSZip();

    for (let index = 0; index < store.images.length; index++) {
      const image = store.images[index];
      const imageFile = await fetch(image.url).then((res) => res.blob());
      const filename = convertedName(image.name, store.convertFormat);

      zip.file(filename, imageFile);
    }

    const zipFile = await zip.generateAsync({ type: "blob" });

    const url = URL.createObjectURL(zipFile);
    download(url, "image-convert.zip");

    URL.revokeObjectURL(url);
  }

  async function convert() {
    setStore("convertDisabled", true);

    for (let index = 0; index < store.images.length; index++) {
      const image = store.images[index];

      if (image.converted) continue;

      setStore("images", index, "converting", true);

      const url = await convertImage(image, store.convertFormat);

      setStore("images", index, (prev) => ({
        ...prev,
        url: url,
        converting: false,
        converted: true,
      }));
    }

    setStore("convertDisabled", false);
  }

  function download(href, name) {
    const link = document.createElement("a");
    link.href = href;
    link.download = name;

    link.click();
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
                    onClick={() => downloadImage(index())}
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

          <Show when={store.images.filter((img) => img.converted).length}>
            <div class="flex justify-center mt-20">
              <Button type="normal" onClick={downloadZip}>
                Download zip
              </Button>
            </div>
          </Show>

          <div class="flex justify-center mt-20">
            <Button
              type="normal"
              class="flex gap-2"
              disabled={
                store.convertDisabled ||
                !store.convertFormat ||
                store.images.filter((img) => !img.converted).length === 0
              }
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
