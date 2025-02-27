import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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

    const [newEventsList, setNewEventsList] = useState([]);

    const incrementCalendar = () => {
        setNowOpenCalendar(prev => {
            const newMonth = prev >= 12 ? 1 : prev + 1;
            if (calendarRef.current) {
                calendarRef.current.getApi().gotoDate(`2025-${String(newMonth).padStart(2, '0')}-01`);
            }
            return newMonth;
        });
    };

    const decreaseCalendar = () => {
        setNowOpenCalendar(prev => {
            const newMonth = prev <= 1 ? 12 : prev - 1;
            if (calendarRef.current) {
                calendarRef.current.getApi().gotoDate(`2025-${String(newMonth).padStart(2, '0')}-01`);
            }
            return newMonth;
        });
    };

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
            };

            setEvents([...events, newEvent]);
            setNewEventsList([...newEventsList, newEvent]); // 新しく作られたイベントを格納

            setShowModal(false);
            setSelectedOption("");
            setInput1("");
            setInput2("");
        }
    };


    //トランザクション削除
    const handleDeleteTransaction = async () => {
        try {
            const response = await axios.delete('http://localhost:8001/api/transactions', {
                headers: { "Content-Type": "application/json" },
                data: {
                    transactions: [
                        { id: 3 },
                        { id: 4 }
                    ]
                }
            });
            console.log("Delete successful:", response.data);
        } catch (error) {
            console.error('Error deleting transaction:', error.response ? error.response.data : error.message);
        }
    };


    //トランザクション送信
    const sendData = () => {
        // newEventsList のデータを transactions に変換して追加
        const updatedTransactions = [
            ...transactions,
            ...newEventsList.map(event => ({
                date: event.start,
                category: event.title.split(", ")[0],
                description: event.title.split(", ")[1],
                amount: parseInt(event.title.split(", ")[2].replace("円", ""), 10)
            }))
        ];

        // 状態を更新
        setTransactions(updatedTransactions);

        // APIに送信
        axios.post('http://localhost:8001/api/transactions', {
            transactions: updatedTransactions
        })
            .then(response => console.log(response))
            .catch(error => console.log(error));

        // newEventsListをクリア
        setNewEventsList([]);
    };

    //トランザクション入手
    const getData = () => {
        axios.get('http://localhost:8001/api/transactions')
            .then(response => {
                if (response.data && Array.isArray(response.data.results)) {
                    const fetchedTransactions = response.data.results;

                    setTransactions(fetchedTransactions); // `transactions` を更新

                    // `transactions` を `events` フォーマットに変換
                    const newEvents = fetchedTransactions.map((tx, index) => ({
                        id: String(index + 1),
                        title: `${tx.category}, ${tx.description}, ${tx.amount}円`,
                        start: tx.date,
                    }));

                    setEvents(newEvents); // `events` を更新
                } else {
                    console.error("Unexpected response format:", response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error.response ? error.response.data : error.message);
            });
    };

    useEffect(() => {
        getData();
    }, []);


    return (
        <div>
            <Header setNowOpenCalendar={(newMonth) => {
                setNowOpenCalendar(newMonth);
                if (calendarRef.current) {
                    calendarRef.current.getApi().gotoDate(`2025-${String(newMonth).padStart(2, '0')}-01`);
                }
            }} />
            <button className="save">保存</button>
            <div className="SecondaryHeader">
                <div className="PreviousMonth" onClick={decreaseCalendar}></div>
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

            <div className={"allDelete"}>

            </div>
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
