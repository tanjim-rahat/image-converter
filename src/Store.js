import { createStore } from "solid-js/store";

const [store, setStore] = createStore({
  images: [
    // {
    //   name: "test1",
    //   type: "jpg",
    //   size: 10000,
    //   converted: false,
    //   downloaded: false,
    //   url: null,
    // },
  ],
  formats: ["png", "jpeg", "webp"],
  convertFormat: null,
  convertDisabled: false,
});

function addImages(images) {
  setStore("images", (prev) => {
    return Array.from(images)
      .map((img) => ({
        name: img.name,
        size: img.size,
        conerting: false,
        converted: false,
        downloaded: false,
        url: URL.createObjectURL(img),
      }))
      .concat(prev);
  });
}

export { store, setStore, addImages };
