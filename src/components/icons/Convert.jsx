export default function ConvertIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 21}
      height={props.size || 24}
      viewBox="0 0 21 24"
      class={props.class}
    >
      <path
        fill="currentColor"
        d="m7.5 21l2.999-3v1.5a7.501 7.501 0 0 0 5.299-12.811l2.114-2.124A10.465 10.465 0 0 1 21 12.002C21 17.8 16.3 22.5 10.502 22.5H10.5V24zM0 12C.007 6.204 4.704 1.507 10.499 1.5h.001V0l3 3l-3 3V4.5h-.002a7.502 7.502 0 0 0-5.299 12.812l-2.112 2.124a10.397 10.397 0 0 1-3.088-7.407v-.03v.002z"
      />
    </svg>
  );
}
