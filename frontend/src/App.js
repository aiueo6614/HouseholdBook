import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {deleteTransaction} from "./API/API";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import './App.css';
import Header from "./components/Header";
import Camera from "./components/Camera";

function App() {
    const [transactions, setTransactions] = useState([]); //リストの状態

    const [events, setEvents] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const currentMonth = new Date().getMonth() + 1;
    const [nowOpenCalendar, setNowOpenCalendar] = useState(currentMonth);
    const calendarRef = useRef(null);

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
        setSelectedDate(selectInfo.startStr);
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (selectedOption && input1 && input2) {
            const newEvent = {
                id: String(events.length + 1),
                title: `${selectedOption}, ${input1}, ${input2}円`,
                start: selectedDate,
                //end: selectedDate,
            };
            setEvents([...events, newEvent]);
            setShowModal(false);
            setSelectedOption("");
            setInput1("");
            setInput2("");
        }
    };





    //トランザクション削除
    const handleDeleteTransaction = async () => {
        try {
            await axios.delete('http://localhost:8001/api/transactions');
            await deleteTransaction('17');
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    //トランザクション送信
    const sendData = () => {
        axios.post('http://localhost:8001/api/transactions',
            {transactions: [
                { date: "2025-02-25", category: "食費", description: "smile", amount: 0 },
                { date: "2025-02-25", category: "食費", description: "insert me please", amount: 0 },
            ],
        },
            )
            .then(response => console.log(response))
            .catch(error => console.log(error));
    };
    //トランザクション入手
    const getData = () => {
        axios.get('http://localhost:8001/api/transactions')
            .then(response => {
                if (response.data && Array.isArray(response.data.results)) {
                    setTransactions(response.data.results); // `results` 配列を state にセット
                } else {
                    console.error("Unexpected response format:", response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error.response ? error.response.data : error.message);
            });
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
                />
            </div>


            <button onClick={sendData}>送信</button>
            <button onClick={handleDeleteTransaction}>Delete Transaction</button>

                <button onClick={getData}>取得データ表示</button>
                <div>
                    <h2>取得したデータ</h2>
                    <ul>
                        {transactions.map((tx, index) => (
                            <li key={index}>{tx.date} - {tx.category} - {tx.description} - {tx.amount}円</li>
                        ))}
                    </ul>
                </div>


            <button className="camera-button" onClick={() => setShowOverlay(true)}>カメラ</button>
            {showOverlay && (
                <div className="overlay" onClick={() => setShowOverlay(false)}>
                    <div className="CameraPage" onClick={(e) => e.stopPropagation()}>
                        <Camera onClose={() => setShowOverlay(false)}/>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>イベントを追加</h2>
                        <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                            <option value="">勘定科目を選択</option>
                            <option value="食費">食費</option>

                        </select>
                        <input type="text" placeholder="商品名" value={input1}
                               onChange={(e) => setInput1(e.target.value)}/>
                        <input type="text" placeholder="値段" value={input2}
                               onChange={(e) => setInput2(e.target.value)}/>
                        <button onClick={handleSubmit}>追加</button>
                        <button onClick={() => setShowModal(false)}>キャンセル</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
