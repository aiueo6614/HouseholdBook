import React, { useRef, useState } from "react";
import "./Camera.css";
import axios from "axios";

const CameraScreen = ({ onClose }) => {  // onClose を受け取る
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState("");

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", aspectRatio: { exact: 1.6 } },
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error("カメラに接続できません。", error);
        }
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            setPhoto(canvas.toDataURL("image/png"));
        }
    };

    const readReceipt = () => {
        axios.post('http://localhost:8001/api/ocr/gemini',
            { image: photo }).then(
                (response) => {
                    console.log(response.data);
                }
            ).catch(
                (error) => {
                    console.error("OCRに失敗しました。", error);
                }
            );
        const video = videoRef.current;
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        onClose(); // オーバーレイを閉じる
    };

    return (
        <div className="camera-screen">
            <h1>レシートを撮影しよう！</h1>
            <video ref={videoRef} style={{ width: "100%", maxHeight: "400px" }} autoPlay playsInline></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <div>
                <button onClick={startCamera}>カメラを開始</button>
                <button onClick={takePhoto}>写真を撮る！</button>
                <button onClick={readReceipt}>送信</button>
            </div>
            {photo && <img src={photo} alt="撮影した写真" style={{ maxWidth: "100%" }} />}
        </div>
    );
};

export default CameraScreen;
