import { useCallback, useEffect, useState, useRef } from "react";

import { COLORS } from "./lib/constants";
import { Button } from "./components/ui/button";
import { usePostHistory, useGetHistory } from "./hooks";

const App = () => {
  const [boxes, setboxes] = useState<number[]>(new Array(7).fill(0));
  const [isReversing, setReversing] = useState(false);
  const [isReplaying, setReplaying] = useState(false);
  const reverseRef = useRef<NodeJS.Timeout | null>(null);
  const replayRef = useRef<NodeJS.Timeout | null>(null);
  const eventsRef = useRef<number[]>([]);
  const historyRef = useRef<number[]>([]);
  const history = useGetHistory();
  const saveHistory = usePostHistory();

  const toggleColor = useCallback(
    (index: number) =>
      setboxes((prev) => {
        return prev.map((box, i) => (i === index ? 1 - box : box));
      }),
    [setboxes]
  );
  const onClickBox = useCallback(
    (index: number) => {
      if (!isReplaying && !isReversing) {
        toggleColor(index);
        eventsRef.current.push(index);
        saveHistory.mutate(index);
      }
    },
    [isReversing, isReplaying, toggleColor]
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
  const onClickReplay = useCallback(() => {
    history.refetch().then((result) => {
      setReplaying(true);
      setboxes(new Array(7).fill(0));
      historyRef.current = result.data!;
      replayRef.current = setInterval(() => {
        const first = historyRef.current.shift();
        if (first !== undefined) {
          toggleColor(first);
        } else {
          setReplaying(false);
          clearInterval(replayRef.current!);
        }
      }, 300);
    });
  }, [history, setReplaying, setboxes]);

  useEffect(() => {
    if (!isReplaying && boxes.every((box) => box === 1)) {
      setReversing(true);
      reverseRef.current = setInterval(() => {
        const last = eventsRef.current.pop();
        if (last !== undefined) {
          toggleColor(last);
          saveHistory.mutate(last);
        } else {
          setReversing(false);
          clearInterval(reverseRef.current!);
        }
      }, 500);
    }
  }, [boxes, isReplaying, toggleColor, setReversing]);
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
      <Button onClick={onClickReplay} disabled={isReplaying}>
        Replay
      </Button>
    </div>
  );
};

export default App;
