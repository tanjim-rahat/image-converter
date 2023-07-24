export function dataURLToBlob(dataURL) {
  const parts = dataURL.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uint8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uint8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: contentType });
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

export async function convertImage(image, convertFormat) {
  return new Promise((resolve, reject) => {
    try {
      const imageFile = new Image();
      imageFile.src = image.url;

      imageFile.addEventListener("load", () => {
        canvas.width = imageFile.width;
        canvas.height = imageFile.height;
        ctx.drawImage(imageFile, 0, 0);

        const convertedDataUrl = canvas.toDataURL(
          `image/${convertFormat}`,
          0.8
        );

        const blob = dataURLToBlob(convertedDataUrl);
        const objectURL = URL.createObjectURL(blob);

        resolve(objectURL);
      });
    } catch (error) {
      reject(error);
    }
  });
}
