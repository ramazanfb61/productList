import { BiCaretDown, BiCaretUp } from "react-icons/bi";

export default function FilterButton() {
  return (
    <span>
      <button className="flex flex-col items-baseline">
        <span className="-mb-1.5">
          <BiCaretUp />
        </span>
        <span>
          <BiCaretDown />
        </span>
      </button>
    </span>
  );
}
