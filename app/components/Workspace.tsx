'use client';

import {useMemo, useState} from "react";
import {Translations} from "@/types";
import {twMerge} from "tailwind-merge";

function WorkoutRow({
                        id,
                        name,
                        onUpdateExercise,
                    }: {
    id: number,
    name: string,
    onUpdateExercise: (index: number, newDone: boolean, newSets: number, newReps: number) => void,
}) {
    const [done, setDone] = useState(false);
    const [sets, setSets] = useState<number>(0);
    const [reps, setReps] = useState<number>(0);

    useMemo(() => {
        onUpdateExercise(id, done, sets, reps);
    }, [id, done, sets, reps]);

    return (
        <div key={`${id}-name`}
             className={`w-full h-fit p-1 bg-black rounded-xl flex flex-col items-center justify-center px-1 py- space-y-2`}>
            <div className={`flex flex-row w-full h-full items-center justify-start space-x-2`}>
                <input type="checkbox" defaultChecked={false} className="checkbox w-12 h-12 border-gray-700"
                       onChange={(e) => {
                           setDone(e.target.checked);
                       }}
                />
                <span className={`text-xl`}>
                    {name}
                </span>
            </div>
            <div className={`flex flex-row w-full h-full justify-start items-center`}>
                <div className={`flex flex-row w-full h-full items-center space-x-2`}>
                    <input
                        value={sets}
                        className={`
                            w-12 h-12 text-center rounded-lg border
                            bg-black border-gray-700 active:border-white focus:border-white
                        `}
                        type={'number'}
                        onChange={(e) => {
                            setSets(Number(e.target.value));
                        }}
                    />
                    <span className={`w-12 text-xl`}>Sets</span>
                </div>
                <div className={`flex flex-row w-full h-full items-center space-x-2`}>
                    <input
                        value={reps}
                        className={`
                            w-12 h-12 text-center rounded-lg border
                            bg-black border-gray-700 active:border-white focus:border-white
                        `}
                        type={'number'}
                        onChange={(e) => {
                            setReps(Number(e.target.value));
                        }}
                    />
                    <span className={`w-12 text-xl`}>Reps</span>
                </div>
            </div>
        </div>
    )
        ;
}

export default function Workspace({
                                      translations
                                  }: {
    translations: Translations,
}) {
    const [exercises, setExercises] = useState([
        {
            name: 'Bench Press',
            done: false,
            sets: 3,
            reps: 3,
        },
        {
            name: 'Bicep Curl',
            done: false,
            sets: 3,
            reps: 3,
        }
    ]);

    useMemo(() => {
        if (translations.frontTranslation) {
            console.log("User looking at screen");
        } else if (translations.frontTranslation == null) {
            console.log("User looking away");
        }
        console.log(translations.frontTranslation)
    }, [translations]);

    return (
            <div
                className={twMerge(
                    `w-80 h-80 relative bg-[#00000080] rounded-2xl backdrop-blur-3xl`,
                    translations.frontTranslation ? 'opacity-100' : 'opacity-0',
                    `transition-all duration-300`
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
                <div className={`absolute left-0 top-0 w-full h-full text-white bg-transparent pt-8 px-2`}>
                    <h1 className={`text-3xl font-bold`}>Carson Bergen</h1>
                    <div className={`flex flex-col space-y-2`}>
                        {exercises.map((exercise, index: number) => (
                            <WorkoutRow
                                key={index}
                                id={index}
                                name={exercise.name}
                                onUpdateExercise={(index: number, newDone: boolean, newSets: number, newReps: number): void => {
                                    const newExercises = exercises;
                                    newExercises[index].done = newDone;
                                    newExercises[index].sets = newSets;
                                    newExercises[index].reps = newReps;
                                    setExercises(newExercises);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
    );
}