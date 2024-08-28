import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Filter, Sampler, start } from "tone";
import { useDebounceCallback, useInterval } from "usehooks-ts";
export const LETTERS =
  " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,':()&!?+-’".split("");
export const NUMBERS = " 0123456789.,':()&!?+-’".split("");

const DROP_TIME = 100;

export interface Slot {
  value: string;
  options: Array<string>;
  mapper: (value: any) => ReactNode;
}

const Letter = ({
  value,
  index,
  onFlip,
}: {
  value: Slot;
  index: number;
  onFlip?: () => void;
}) => {
  const [currentValue, setCurrentValue] = useState("");
  const [fallingValue, setFallingValue] = useState("");
  const indexRef = useRef(0);
  const stopAtRef = useRef<number | null>(null);
  const rafRef = useRef(null);
  const lastUpdateTimeRef = useRef<number | null>(null);
  const [fallingFlapStyle, setFallingFlapStyle] = useState({});
  const tick = (timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastUpdateTimeRef.current!;

    if (elapsed >= DROP_TIME) {
      if (onFlip) {
        onFlip();
      }
      setFallingFlapStyle({transform: "translateY(0.03em)"});
      const oldValue = value.options.at(indexRef.current);
      const newValue = value.options.at(
        (indexRef.current + 1) % value.options.length,
      );
      setFallingValue(oldValue!);
      setCurrentValue(newValue!);
      indexRef.current = (indexRef.current + 1) % value.options.length;
      setTimeout(() => {
        setFallingFlapStyle({transform: "translateY(-0.03em)"});
      }, DROP_TIME / 2);

      if (indexRef.current === stopAtRef.current) {
        setFallingValue(newValue!);
        setTimeout(() => {
          setFallingFlapStyle({opacity: 0});
        }, DROP_TIME / 2);
        return;
      }
      lastUpdateTimeRef.current = timestamp;
    }
    requestAnimationFrame(tick);
  };

  const spin = (clear = true) => {
    if (clear) stopAtRef.current = null;
    requestAnimationFrame(tick);
  };

  const setValue = (value: any) => {
    stopAtRef.current = value.options.indexOf(value.value);
    if (stopAtRef.current! < 0) stopAtRef.current = 0;
    if (!rafRef.current && indexRef.current !== stopAtRef.current) spin(false);
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      const newStop = value.options.indexOf(value.value);
      if (newStop !== stopAtRef.current) {
        setValue(value);
      }
    }, 300 * index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  
  const maxAmountOfLetters = value.options.reduce((prev, option) => {
    return Math.max(option.length, prev);
  }, 1);
  return (
    <span
      className="font-roboto inline-block uppercase relative text-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        width: `${Math.min(maxAmountOfLetters * 1, 10)}em`,
        minWidth: "0.65em",
        margin: "0 0.1em",
        height: "1.2em",
      }}
    >
      <span className="bg-zinc-800 block overflow-hidden absolute inset-0 h-[0.65em]">
        <span className="block w-full">{value.mapper(currentValue)}</span>
      </span>
      <span className=" bg-zinc-800 block overflow-hidden absolute inset-0 top-[0.65em]">
        <span className="relative block w-full -top-[0.65em]">
          {value.mapper(fallingValue)}
        </span>
      </span>

      <span className="absolute inset-x-0 top-[0.58em] block border-t-[0.03em] border-b-[0.03em] border-black opacity-[0.768] z-[2]" />
      <span
        className={`falling block absolute inset-0`}
      >
        {fallingValue && (
          <span style={fallingFlapStyle} className={`block w-full bg-zinc-900 border-t-[0.03em] border-b-[0.03em] border-gray-700`}>
            {value.mapper(fallingValue)}
          </span>
        )}
      </span>
    </span>
  );
};

export const Board = ({
  rowCount = 10,
  letterCount = 10,
  value = [],
}: {
  rowCount?: number;
  letterCount?: number;
  value: Array<Array<Slot>>;
}) => {
  const sampleRef = useRef<null | Sampler>(null);
  const [samplerLoaded, setSamplerLoaded] = useState(false);
  useEffect(() => {
    const filter = new Filter(5000, "lowpass").toDestination();
    sampleRef.current?.connect(filter);
    sampleRef.current = new Sampler(
      { A1: "/click2.mp3", A2: "/click2.mp3", A3: "/click3.mp3" },
      () => {
        setSamplerLoaded(true);
      },
    ).toDestination();
  }, []);

  const debouncedTriggerSample = useDebounceCallback(() => {
    if (samplerLoaded) {
      const items = ["A1", "A2", "A3"];
      const sample = items[Math.floor(Math.random() * items.length)];
      sampleRef.current?.triggerAttackRelease(
        sample,
        0.05,
        undefined,
        Math.random(),
      );
    }
  }, 10);

  const longestRow = value.reduce((prev, current: Array<any>) => {
    return Math.max(prev, current.length);
  }, 0);

  const [visibleRows, setVisibleRows] = useState(1);
  useInterval(() => {
    if (visibleRows < rowCount) {
      setVisibleRows((rows) => rows + 1);
    }
  }, 300);
  const minLetters = Math.max(longestRow, letterCount);
  const appendedValues = [...value];
  while (appendedValues.length < rowCount) {
    appendedValues.push([]);
  }

  const rows = useMemo(() => {
    return appendedValues.map((row: Array<Slot>) => {
      const letters = row;
      while (letters.length < minLetters) {
        letters.push({
          value: "",
          options: [],
          mapper: () => "",
        });
      }
      return letters;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      className=" inline-block  rounded-lg  text-gray-200 leading-[1.2] "
      onClick={() => {
        start();
      }}
    >
      {rows.map((row, rIndex) => (
        <div
          key={rIndex}
          className="row whitespace-nowrap"
        >
          {row.map((value: Slot, columnIndex: number) =>
            rIndex < visibleRows ? (
              <Letter
                key={rIndex + " " + columnIndex}
                value={value}
                index={columnIndex}
                onFlip={debouncedTriggerSample}
              />
            ) : (
              <Letter
                onFlip={debouncedTriggerSample}
                key={rIndex + " " + columnIndex}
                value={{ value: "", options: [], mapper: () => "" }}
                index={columnIndex}
              />
            ),
          )}
        </div>
      ))}
    </div>
  );
};

export default Board;
