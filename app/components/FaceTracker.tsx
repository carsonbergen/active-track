"use client";

import '../utils/js-aruco2/src/cv';
import '../utils/js-aruco2/src/aruco';
import '../utils/js-aruco2/src/posit1';
import '../utils/js-aruco2/src/posit2';
import '../utils/js-aruco2/src/svd';

// Webcam code:
// https://medium.com/@gk150899/building-a-webcam-app-with-reactjs-3111c1e90efb

import {useEffect, useState, useRef, Dispatch, SetStateAction} from "react";
import {Translations} from "@/types";

export default function FaceTracker({
                                        onTranslationsChange
                                    }: {
    onTranslationsChange: Dispatch<SetStateAction<Translations>>,
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [webcamSetup, setWebcamSetup] = useState<boolean>(false);
    const [frontTranslation, setFrontTranslation] = useState<number[] | null>(new Array(3));
    const [leftTranslation, setLeftTranslation] = useState<number[] | null>(new Array(3));
    const [rightTranslation, setRightTranslation] = useState<number[] | null>(new Array(3));
    const [backTranslation, setBackTranslation] = useState<number[] | null>(new Array(3));


    const startWebcam = async () => {
        console.log('Starting webcam');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            // setMediaStream(stream);
            console.log('Webcam started', stream);
        } catch (error) {
            console.error("Error accessing webcam", error);
        }
        setWebcamSetup(true);
    };

    // Code from 581-basic-distance
    const [faceDetectionSetup, setFaceDetectionSetup] = useState<boolean>(false);

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [detector, setDetector] = useState<never>();
    // const [posit, setPosit] = useState(null);
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [markers, setMarkers] = useState([]);
    // const markerSize: number = 40.0; //this should be the real life-size in millimetres of your marker

    const getTranslation = () => {
        if (canvasRef.current) {
            const marker = markers[0];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const posit = new POS.Posit(40, canvasRef.current.width);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const corners = marker.corners;
            for (let i = 0; i < corners.length; ++i) {
                const corner = corners[i];
                corner.x = corner.x - (canvasRef.current.width / 2);
                corner.y = (canvasRef.current.height / 2) - corner.y;
            }
            const pose = posit.pose(corners);
            return pose.bestTranslation;
        }
    }

    const snapshot = () => {
        if (context && canvasRef.current && videoRef.current) {
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            setImageData(context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
        } else {
            console.error('Context', context, '\nVideo Ref Current', videoRef.current);
        }
    }

    const tick = () => {
        requestAnimationFrame(tick);
        // console.log('tick');
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            snapshot();
        }
    }

    const setup = () => {
        console.log('Running face detection setup');
        if (canvasRef && videoRef && canvasRef.current && videoRef.current) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setDetector(new AR.Detector());
            setContext(canvasRef.current.getContext('2d'));
        } else {
            console.error('Canvas ref or video ref are not setup');
        }
        console.log('Face detection setup');
        setFaceDetectionSetup(true);
    };

    useEffect(() => {
        startWebcam();
    }, []);

    useEffect(() => {
        if (webcamSetup && canvasRef.current && videoRef.current) {
            setup();
        }
    }, [webcamSetup, canvasRef, videoRef]);

    useEffect(() => {
        if (faceDetectionSetup) {
            requestAnimationFrame(tick);
        }
    }, [faceDetectionSetup]);

    useEffect(() => {
        if (imageData && detector) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setMarkers(detector.detect(imageData));
        }
    }, [imageData]);

    useEffect(() => {
        if (canvasRef.current && markers.length > 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (markers[0].id == 0) {
                setFrontTranslation(getTranslation());
            } else {
                setFrontTranslation(null);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (markers[0].id == 1) {
                setBackTranslation(getTranslation());
            } else {
                setBackTranslation(null);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (markers[0].id == 2) {
                setLeftTranslation(getTranslation());
            } else {
                setLeftTranslation(null);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (markers[0].id == 3) {
                setRightTranslation(getTranslation());
            } else {
                setRightTranslation(null);
            }
        } else {
            setLeftTranslation(null);
            setRightTranslation(null);
            setFrontTranslation(null);
            setBackTranslation(null);
        }
    }, [markers]);

    useEffect(() => {
        onTranslationsChange({
            frontTranslation: frontTranslation,
            leftTranslation: leftTranslation,
            rightTranslation: rightTranslation,
            backTranslation: backTranslation,
        })
    }, [frontTranslation, leftTranslation, rightTranslation, backTranslation]);

    return (
        <div className={"w-full h-full"}>
            <video ref={videoRef} className="w-full h-full z-[-9999] invisible" autoPlay={true}></video>
            <canvas ref={canvasRef} className="w-full h-full z-[-9999] invisible"/>
            {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                markers.map((marker, index) => (
                <div key={index}>
                    {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        marker.corners.map((corner, index) => (
                        <span key={index}>
                            {corner.x} {corner.y}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
}
