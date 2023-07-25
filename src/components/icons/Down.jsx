export default function DownIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 16}
      height={props.size || 16}
      viewBox="0 0 15 15"
      class={props.class}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="square"
        d="m14 5l-6.5 7L1 5"
      />
    </svg>
  );
}
