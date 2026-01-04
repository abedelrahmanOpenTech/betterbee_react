import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { df } from "../utils/lang";

export function useAudioRecorder(onStop) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], `voice_record_${Date.now()}.wav`, { type: 'audio/wav' });

                if (onStop) {
                    onStop(audioFile);
                }

                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error(err);
            toast.error(df('microphone_access_denied'));
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        clearInterval(timerRef.current);
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.onstop = null; // Prevent onstop callback firing with valid file
            mediaRecorderRef.current.stop();
            const stream = mediaRecorderRef.current.stream;
            stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        clearInterval(timerRef.current);
        setRecordingTime(0);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording,
        cancelRecording
    };
}
