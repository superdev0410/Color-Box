import { useCallback, useEffect, useState, useRef } from "react";

import { COLORS } from "./lib/constants";

const App = () => {
  const [boxes, setboxes] = useState<number[]>(new Array(7).fill(0));
  const [isReversing, setReversing] = useState(false);
  const reverseRef = useRef<NodeJS.Timeout | null>(null);
  const eventsRef = useRef<number[]>([]);

  const toggleColor = useCallback(
    (index: number) =>
      setboxes((prev) => {
        return prev.map((box, i) => (i === index ? 1 - box : box));
      }),
    [setboxes]
  );
  const onClickBox = useCallback(
    (index: number) => {
      if (!isReversing) {
        toggleColor(index);
        eventsRef.current.push(index);
      }
    },
    [isReversing, toggleColor]
  );
  const onClickOutside = useCallback(
    (e: Event) => {
      if ((e.target as Element).closest(".box") === null) {
        setReversing(false);
        clearInterval(reverseRef.current!);
      }
    },
    [setReversing]
  );

  useEffect(() => {
    if (boxes.every((box) => box === 1)) {
      setReversing(true);
      reverseRef.current = setInterval(() => {
        const last = eventsRef.current.pop();
        if (last !== undefined) {
          toggleColor(last);
        } else {
          setReversing(false);
          clearInterval(reverseRef.current!);
        }
      }, 500);
    }
  }, [boxes, toggleColor, setReversing]);
  useEffect(() => {
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("click", onClickOutside);
    };
  }, [onClickOutside]);

  return (
    <div className="tw-grid tw-grid-cols-3 tw-gap-3 tw-w-fit tw-p-10">
      {boxes.map((box, index) => (
        <div
          key={index}
          className={`box box-${COLORS[box]} ${
            index === 3 ? "tw-col-span-3" : ""
          }`}
          onClick={() => onClickBox(index)}
        />
      ))}
    </div>
  );
};

export default App;
