import Button from "./Button";
import UploadIcon from "./icons/Upload";

export default function Header(props) {
  return (
    <header class="w-full h-[10vh] flex items-center justify-between">
      <h1 class="text-xl md:text-3xl font-bold">Image Convert</h1>

      <Button
        type="normal"
        class="font-medium md:text-lg cursor-pointer px-4 py-2 rounded bg-indigo-500 text-white shadow flex gap-2"
        onClick={props.onUploadClick}
      >
        <UploadIcon />
        <p>Upload</p>
      </Button>
    </header>
  );
}
