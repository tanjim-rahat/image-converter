export default function DownloadIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      class={props.class}
    >
      <path
        fill="currentColor"
        d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11l-5 5Zm-6 4q-.825 0-1.413-.588T4 18v-3h2v3h12v-3h2v3q0 .825-.588 1.413T18 20H6Z"
      />
    </svg>
  );
}
