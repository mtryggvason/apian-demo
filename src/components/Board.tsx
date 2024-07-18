import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Sampler, start } from "tone";
import { useInterval } from "usehooks-ts";
const LETTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,':()&!?+-’";
const DROP_TIME = 100;

const Letter = ({ letter, index }: { letter: string; index: number }) => {
  /*
  const sampleRef = useRef<null | Sampler>(null);
  const [samplerLoaded, setSamplerLoaded] = useState(false);
  useEffect(() => {
    sampleRef.current = new Sampler({ A1: "/click.m4a" }, () => {
      setSamplerLoaded(true);
    }).toDestination();
  }, []);
  */

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
      /*
      if (samplerLoaded) {
        //sampleRef.current?.triggerAttackRelease("C0", 20);
      }
        */
      setFallingFlapClass("in");
      const oldValue = LETTERS.charAt(indexRef.current);
      const newValue = LETTERS.charAt((indexRef.current + 1) % LETTERS.length);
      setFallingValue(oldValue);
      setCurrentValue(newValue);
      indexRef.current = (indexRef.current + 1) % LETTERS.length;
      setTimeout(() => {
        setFallingFlapClass("half");
      }, DROP_TIME / 2);

      if (indexRef.current === stopAtRef.current) {
        setFallingValue(newValue);
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
    stopAtRef.current = LETTERS.indexOf(value);
    if (stopAtRef.current! < 0) stopAtRef.current = 0;
    if (!rafRef.current && indexRef.current !== stopAtRef.current) spin(false);
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      setValue(letter);
    }, 100 * index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letter]);

  return (
    <span className="letter">
      <span className="flap bottom">
        <span className="text">{fallingValue}</span>
      </span>
      <span className="flap top">
        <span className="text">{currentValue}</span>
      </span>
      <span className="split" />
      <span className={`flap falling ${fallingFlapClass}`}>
        {fallingValue && <span className="text">{fallingValue}</span>}
      </span>
    </span>
  );
};

export const Board = ({
  rowCount = 10,
  letterCount = 20,
  value = [],
}: {
  rowCount?: number;
  letterCount?: number;
  value: Array<string>;
}) => {
  const longestRow = value.reduce((prev, current: string) => {
    return Math.max(prev, current.length);
  }, 0);

  const [visibleRows, setVisibleRows] = useState(1);
  useInterval(() => {
    if (visibleRows < rowCount) {
      setVisibleRows((rows) => rows + 1);
    }
  }, 3000);
  const minLetters = Math.max(longestRow, letterCount);

  const appendedValues = [...value];
  while (appendedValues.length < rowCount) {
    appendedValues.push(" ");
  }
  const rows = useMemo(() => {
    return appendedValues.map((row: string) => {
      const letters = row.toUpperCase().split("");
      while (letters.length < minLetters) {
        letters.push(" ");
      }
      return letters;
    });
  }, [value, minLetters]);

  return (
    <div
      className="departure-board"
      onClick={() => {
        start();
      }}
    >
      {rows.map((row, rIndex) => (
        <div key={rIndex} className="row">
          {row.map((letter: string, index: number) =>
            rIndex < visibleRows ? (
              <Letter
                key={rIndex + " " + index}
                letter={letter}
                index={index}
              />
            ) : (
              <Letter key={rIndex + " " + index} letter={" "} index={index} />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Board;
