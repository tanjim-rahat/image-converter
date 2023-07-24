export default function Button(props) {
  return (
    <button
      class={`px-4 py-2 rounded bg-red-500 font-medium text-lg text-white shadow ${props.class}`}
      classList={{
        "bg-red-500": props.type === "danger",
        "bg-indigo-500": props.type === "normal",
        "opacity-50": props.disabled,
      }}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
