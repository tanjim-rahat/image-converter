import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";

const savedDarkMode = Number(localStorage.getItem("darkMode"));

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

  darkMode: isNaN(savedDarkMode) ? false : Boolean(savedDarkMode),
});

createEffect(() => {
  localStorage.setItem("darkMode", Number(store.darkMode));
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
