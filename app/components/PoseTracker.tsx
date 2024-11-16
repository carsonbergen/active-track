"use client";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
// Register one of the TF.js backends.
import "@tensorflow/tfjs-backend-webgl";
import {useEffect, useRef, useState} from "react";
import {PoseDetector} from "@tensorflow-models/pose-detection";
// import '@tensorflow/tfjs-backend-wasm';

// https://medium.com/@gk150899/building-a-webcam-app-with-reactjs-3111c1e90efb

export default function PoseTracker() {
    const [detector, setDetector] = useState<PoseDetector | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setMediaStream(stream);
        } catch (error) {
            console.error("Error accessing webcam", error);
        }
    };

    const stopWebcam: () => void = (): void => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => {
                track.stop();
            });
            setMediaStream(null);
        } else {
            console.error('No media stream available.');
        }
    };

    const setupPoseTracker = async () => {
        await startWebcam();

        // Setup detector
        const detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        };
        const poseDetector: PoseDetector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            detectorConfig
        );
        setDetector(poseDetector);
    };

    const runPoseTracker = async () => {
        if (detector != null && videoRef.current) {
            const poses = await detector.estimatePoses(videoRef.current);
            console.log(poses);
        }
    }

    useEffect(() => {
        setupPoseTracker();
    }, []);

    useEffect(() => {
        setInterval(() => {
            runPoseTracker();
        }, 100);
    });

    return (
        <div className={"bg-white w-full h-full"}>
            <video ref={videoRef} className="w-full h-full" autoPlay={true}></video>
        </div>
    );
}
