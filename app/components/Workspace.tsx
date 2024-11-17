"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Translations } from "@/types";
import { twMerge } from "tailwind-merge";

interface Set {
  weight: number;
  reps: number;
  done: boolean;
}

function SetRows({
  sets,
  setSets,
  setTimer,
}: {
  sets: Set[];
  setSets: Dispatch<SetStateAction<Set[]>>;
  setTimer: Dispatch<SetStateAction<number>>;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col space-y-2">
      {sets.map((set, index) => (
        <div className="flex flex-row justify-start items-center space-x-2">
          <input
            type="checkbox"
            defaultChecked={false}
            className="checkbox w-12 h-12 border-gray-700"
            onChange={async (e) => {
              let newSets = sets.map((set, innerIndex) => {
                if (index == innerIndex) {
                  return {
                    weight: set.weight,
                    reps: set.reps,
                    done: Boolean(e.target.value),
                  };
                } else {
                  return {
                    weight: set.weight,
                    reps: set.reps,
                    done: set.done,
                  };
                }
              });
              setSets(newSets);
              setTimer(60);
            }}
          />
          <input
            value={set.reps}
            className={`
                    w-12 h-12 text-center rounded-lg border
                    bg-black border-gray-700 active:border-white focus:border-white
                `}
            type={"number"}
            onChange={(e) => {
              let newSets = sets.map((set, innerIndex) => {
                if (index == innerIndex) {
                  return {
                    weight: set.weight,
                    reps: Number(e.target.value),
                    done: set.done,
                  };
                } else {
                  return {
                    weight: set.weight,
                    reps: set.reps,
                    done: set.done,
                  };
                }
              });
              setSets(newSets);
            }}
          />
          <input
            value={set.weight}
            className={`
                    w-12 h-12 text-center rounded-lg border
                    bg-black border-gray-700 active:border-white focus:border-white
                `}
            type={"number"}
            onChange={(e) => {
              let newSets = sets.map((set, innerIndex) => {
                if (index == innerIndex) {
                  return {
                    weight: Number(e.target.value),
                    reps: set.reps,
                    done: set.done,
                  };
                } else {
                  return {
                    weight: set.weight,
                    reps: set.reps,
                    done: set.done,
                  };
                }
              });
              setSets(newSets);
            }}
          />
        </div>
      ))}
    </div>
  );
}

function WorkoutRow({
  id,
  name,
  onUpdateExercise,
  setTimer,
}: {
  id: number;
  name: string;
  onUpdateExercise: (index: number, newDone: boolean, newSets: Set[]) => void;
  setTimer: Dispatch<SetStateAction<number>>;
}) {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  const [sets, setSets] = useState<Set[]>([]);

  useMemo(() => {
    onUpdateExercise(id, done, sets);
  }, [id, done, sets]);

  useEffect(() => {
    console.log(sets);
  }, [sets]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      key={`${id}-name`}
      className={`w-full h-fit p-1 bg-black rounded-xl flex flex-col items-center justify-center px-1 py- space-y-2`}
    >
      <div
        className={`flex flex-row w-full h-full items-center justify-start space-x-2`}
      >
        <input
          type="checkbox"
          defaultChecked={false}
          className="checkbox w-12 h-12 border-gray-700"
          onChange={(e) => {
            setDone(e.target.checked);
          }}
        />
        <span className={`text-xl`}>{name}</span>
      </div>
      <div className={`flex flex-row w-full h-full justify-start items-center`}>
        <div
          className={`flex flex-col w-full h-full items-start justify-start space-x-2`}
        >
          {sets ? (
            <SetRows sets={sets} setSets={setSets} setTimer={setTimer} />
          ) : null}
          <button
            onClick={() => {
              let newSets = [...sets, { reps: 0, weight: 0, done: false }];
              setSets(newSets);
            }}
          >
            Add set
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Workspace({
  translations,
}: {
  translations: Translations;
}) {
  const [mounted, setMounted] = useState(false);
  const [exercises, setExercises] = useState([
    {
      name: "Bench Press",
      done: false,
      sets: [
        {
          weight: 50,
          reps: 8,
        },
      ],
    },
    {
      name: "Bicep Curl",
      done: false,
      sets: [
        {
          weight: 50,
          reps: 8,
        },
      ],
    },
  ]);

  const [timer, setTimer] = useState<number>(0);

  useMemo(() => {
    if (translations.frontTranslation) {
      console.log("User looking at screen");
    } else if (translations.frontTranslation == null) {
      console.log("User looking away");
    }
    console.log(translations.frontTranslation);
  }, [translations]);

  useEffect(() => {
    setInterval(() => {
      if (timer > 0) {
        console.log(timer);
        setTimer(timer - 1);
      }
    }, 1000);
  }, [timer]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={twMerge(
        `w-full h-full relative bg-[#00000080] rounded-2xl backdrop-blur-3xl`
      )}
    >
      {/* Background */}
      <div
        className={`
                    left-0 top-0 w-full h-full 
                    bg-transparent
                    rounded-2xl
                `}
      />

      {/* Front content*/}
      <div
        className={`absolute left-0 top-0 w-full h-full text-white bg-transparent pt-8 px-2`}
      >
        {translations.frontTranslation ||
          (true && (
            <div>
              <h1 className={`text-3xl font-bold`}>Carson Bergen</h1>
              <div className={`flex flex-col space-y-2`}>
                {exercises.map((exercise, index: number) => (
                  <WorkoutRow
                    setTimer={setTimer}
                    key={index}
                    id={index}
                    name={exercise.name}
                    onUpdateExercise={(
                      index: number,
                      newDone: boolean,
                      newSets: Set[]
                    ): void => {
                      const newExercises = exercises;
                      newExercises[index].done = newDone;
                      setExercises(newExercises);
                    }}
                  />
                ))}
              </div>
            </div>
          )) ||
          (translations.frontTranslation == null && (
            <div>
              <h1>Time left</h1>
            </div>
          ))}
        {(translations.rightTranslation || translations.leftTranslation) && (
          <div>
            <h1 className={`text-3xl font-bold`}>Working out</h1>
          </div>
        )}
      </div>
    </div>
  );
}
