"use client";
import Workspace from "@/app/components/Workspace";
import FaceTracker from "@/app/components/FaceTracker";
import {useState} from "react";
import {Translations} from "@/types";

export default function Home() {
    const [translations, setTranslations] = useState<Translations>({
        frontTranslation: null,
        leftTranslation: null,
        rightTranslation: null,
        backTranslation: null,
    });

    return (
        <div className={`w-screen h-screen p-8 bg-gradient-to-br from-black via-green-200 to-black font-outfit`}>
            <Workspace translations={translations} />
            <FaceTracker onTranslationsChange={setTranslations}/>
        </div>
    );
}
