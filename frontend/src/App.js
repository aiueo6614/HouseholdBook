import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import './App.css';
import Header from "./components/Header";
import Camera from "./components/Camera";

function Home() {
    const [transactions, setTransactions] = useState([]);
    const [events, setEvents] = useState([]);
    const currentMonth = new Date().getMonth() + 1;
    const [nowOpenCalendar, setNowOpenCalendar] = useState(currentMonth);
    const calendarRef = useRef(null);
    const navigate = useNavigate();

    const incrementCalendar = () => {
        setNowOpenCalendar(prev => (prev >= 12 ? 1 : prev + 1));
    };

    const mentCalendar = () => {
        setNowOpenCalendar(prev => (prev <= 1 ? 12 : prev - 1));
    };

    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(`2025-${String(nowOpenCalendar).padStart(2, '0')}-01`);
        }
    }, [nowOpenCalendar]);

    const handleDateSelect = (selectInfo) => {
        let title = prompt('イベントのタイトルを入力してください');
        let calendarApi = selectInfo.view.calendar;

        calendarApi.unselect();

        if (title) {
            const newEvent = {
                id: String(events.length + 1),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
            };
            setEvents([...events, newEvent]);
        }
    };

    const handleEventDrop = (dropInfo) => {
        const updatedEvents = events.map(event =>
            event.id === dropInfo.event.id
                ? { ...event, start: dropInfo.event.startStr, end: dropInfo.event.endStr }
                : event
        );
        setEvents(updatedEvents);
    };

    const sendData = () => {
        axios.post('http://localhost:8001/api/transactions', {
            date: '2025-01-21',
            category: '食費',
            description: 'puttyo',
            amount: 150
        })
            .then(response => console.log(response))
            .catch(error => console.log(error));
    };

    const getData = () => {
        axios.get('http://localhost:8001/api/transactions')
            .then(response => {
                console.log(response.data);
                setTransactions(response.data);
            })
            .catch(error => console.log(error));
    };

    return (
        <div>
            <Header setNowOpenCalendar={setNowOpenCalendar}/>
            <button className="save">保存</button>
            <div className="SecondaryHeader">
                <div className="PreviousMonth" onClick={mentCalendar}></div>
                <div className="CalendarValue">{nowOpenCalendar}月</div>
                <div className="NextMonth" onClick={incrementCalendar}></div>
            </div>
            <div className="calendar">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate={`2025-${String(nowOpenCalendar).padStart(2, '0')}-01`}
                    locales={[jaLocale]}
                    locale="ja"
                    headerToolbar={{
                        center: '',
                        right: '',
                        left: ''
                    }}
                    fixedWeekCount={false}
                    selectable={true}
                    editable={true}
                    events={events}
                    select={handleDateSelect}
                    eventDrop={handleEventDrop}
                />
                <button onClick={sendData}>データ送信</button>
                <button onClick={getData}>取得データ表示</button>
                <div>
                    <h2>取得したデータ</h2>
                    <ul>
                        {transactions.map((tx, index) => (
                            <li key={index}>{tx.date} - {tx.category} - {tx.description} - {tx.amount}円</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="cameraButton">
                <button onClick={() => navigate("/camera")}>
                    カメラを開く
                </button>
            </div>
            <div className="cameraButton">
                <Camera />
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/camera" element={<Camera />} />
            </Routes>
        </Router>
    );
}

export default App;
