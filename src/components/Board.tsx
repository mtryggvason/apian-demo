import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Sampler, start } from "tone";
import { useDebounceCallback, useInterval } from "usehooks-ts";
export const LETTERS =
  " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,':()&!?+-’".split("");
export const NUMBERS = " 0123456789.,':()&!?+-’";

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
  const [fallingFlapClass, setFallingFlapClass] = useState("");
  const tick = (timestamp: number) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = timestamp;
    }

    const elapsed = timestamp - lastUpdateTimeRef.current!;

    if (elapsed >= DROP_TIME) {
      if (onFlip) {
        onFlip();
      }
      setFallingFlapClass("in");
      const oldValue = value.options.at(indexRef.current);
      const newValue = value.options.at(
        (indexRef.current + 1) % value.options.length,
      );
      setFallingValue(oldValue!);
      setCurrentValue(newValue!);
      indexRef.current = (indexRef.current + 1) % value.options.length;
      setTimeout(() => {
        setFallingFlapClass("half");
      }, DROP_TIME / 2);

      if (indexRef.current === stopAtRef.current) {
        setFallingValue(newValue!);
        setTimeout(() => {
          setFallingFlapClass("out");
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
      className="letter"
      style={{ width: `${Math.min(maxAmountOfLetters, 10)}em` }}
    >
      <span className="flap top">
        <span className="text">{value.mapper(currentValue)}</span>
      </span>
      <span className="flap bottom">
        <span className="text">{value.mapper(fallingValue)}</span>
      </span>

      <span className="split" />
      <span className={`flap falling ${fallingFlapClass}`}>
        {fallingValue && (
          <span className="text">{value.mapper(fallingValue)}</span>
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
    sampleRef.current = new Sampler({ A1: "/click.m4a" }, () => {
      setSamplerLoaded(true);
    }).toDestination();
  }, []);

  const debouncedTriggerSample = useDebounceCallback(() => {
    if (samplerLoaded) {
      sampleRef.current?.triggerAttackRelease("G1", 30);
    }
  }, 50);

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
  }, [value]);

  return (
    <div
      className="departure-board"
      onClick={() => {
        start();
      }}
    >
      {rows.map((row, rIndex) => (
        <div key={rIndex} className="row whitespace-nowrap">
          {row.map((value: Slot, columnIndex: number) =>
            rIndex < visibleRows ? (
              <Letter
                key={rIndex + " " + columnIndex}
                value={value}
                index={columnIndex}
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
