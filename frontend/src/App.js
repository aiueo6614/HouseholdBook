import React, {useRef,useState} from 'react';//useRef,useState追加
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';//画面転移のためのライブラリ
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';
import './App.css';

function Calender() {//関数名変更
    const navigate = useNavigate();//ベージ転移のための関数

    let year = '2025';
    let month = '01';
    let day = ['01', '02', '03'];

    let time = [year + '-' + month + '-' + day[0], year + '-' + month + '-' + day[1], year + '-' + month + '-' + day[2]];
    //sqlデータ送信テストデータ
    const sendData = () => {
        axios.post('http://localhost:8001/api/transactions', {
            date: '2025-01-21',
            category: '食費',
            description: 'puttyo',
            amount: 150
        })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    };
    //sqlデータ取得
    //sqlデータ取得
    const getData = () => {
        axios.get('http://localhost:8001/api/transactions')
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
    };
    //撮影画面に移行するためのボタンを追加（return関数内：63行目）
    return (
        <div className={"calendar"}>
            <FullCalendar
                plugins={[dayGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                locales={[jaLocale]}
                locale="ja"
                headerToolbar={{
                    right: 'dayGridMonth,listMonth',
                }}
                events={[
                    {title: 'event 1', start: time[0]},
                    {title: 'event 3', start: time[1]},
                    {title: 'event 2', start: time[0], end: time[2]}
                ]}
            />
            <button onClick={sendData}>データ送信</button>
            <button onClick={getData}>データ取得</button>
            <button　onClick={() => navigate('/camera')}>入力</button>
        </div>
    );
}
function CameraScreen() {//撮影画面
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState("");

    // カメラを開始する関数
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment", // 背面カメラを使用
                    aspectRatio: { exact: 1.6 } // 画面比率を指定
                },
                audio: false // 音声なし
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error("カメラに接続できません。", error);
        }
    };

    // 写真を撮る関数
    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL("image/png");
            setPhoto(imageData);
        }
    };

    // カメラを停止する関数
    const stopCamera = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }
    };

    //デスクトップのファイルを開く関数
    const appPhoto = () =>{

    }

    return (
        <div className="camera-screen">
            <h1>レシートを撮影しよう！</h1>
            <div className="camera">
                {/* カメラのプレビュー */}
                <video ref={videoRef} style={{ width: "100%", maxHeight: "400px" }} autoPlay playsInline></video>

                {/* 撮影用の隠しキャンバス */}
                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

                {/* カメラ操作用ボタン */}
                <div>
                    <button id="start" onClick={startCamera}>カメラを開始</button>
                    <button id="shoot" onClick={takePhoto}>写真を撮る！</button>
                    <button id="stop" onClick={stopCamera}>終了</button>
                    <button id="file" onClick={appPhoto}>画像をアップロード</button>
                </div>

                {/* 撮影した写真を表示 */}
                {photo && (
                    <div className="img">
                        <h1>撮影した写真</h1>
                        <img src={photo} alt="カメラをアクセスしてください。" style={{ maxWidth: "100%" }} />
                    </div>
                )}

                {/* ホームに戻るボタン */}
                <button id="back" onClick={() => navigate("/")}>戻る</button>
            </div>
        </div>
    );
}

function App() {//ベージ転移
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Calender />} />
                <Route path="/camera" element={<CameraScreen />} />
            </Routes>
        </Router>
    );
}

export default App;