import React, { useRef, useState } from "react";
import axios from "axios";

const CameraScreen = ({ onClose }) => {
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
            const imageData = canvas.toDataURL("image/jpeg");
            setPhoto(imageData);
        }
    };

    const sendImage = async () => {
        if (!photo) {
            console.error("画像が撮影されていません。");
            return;
        }

        try {
            // 画像データをfetchで取得し、Blobとして変換
            const blob = await (await fetch(photo)).blob();

            // バイナリデータをそのまま送信する形式に修正
            const response = await axios.post("http://localhost:8001/api/ocr/gemini/", blob, {
                headers: {
                    "Content-Type": "image/jpeg",
                },
            });

            console.log("サーバーの応答:", response.data);
        } catch (error) {
            if (error.response) {
                // エラーメッセージを詳細に表示
                console.error("サーバーからのエラー:", error.response.data);
                console.error("ステータスコード:", error.response.status);
                console.error("ヘッダ情報:", error.response.headers);
            } else if (error.request) {
                console.error("リクエストエラー:", error.request);
            } else {
                console.error("エラー:", error.message);
            }
        }
    };

    const stopCamera = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
        onClose();
    };

    return (
        <div className="camera-screen">
            <h1>レシートを撮影しよう！</h1>
            <video ref={videoRef} style={{ width: "100%", maxHeight: "400px" }} autoPlay playsInline></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <div>
                <button onClick={startCamera}>カメラを開始</button>
                <button onClick={takePhoto}>写真を撮る！</button>
                <button onClick={sendImage}>送信</button> {/* 画像を送信するボタン */}
                <button onClick={stopCamera}>終了</button>
            </div>
            {photo && <img src={photo} alt="撮影した写真" style={{ maxWidth: "100%" }} />}
        </div>
    );
};

export default CameraScreen;
