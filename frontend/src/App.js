import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';
import './App.css';
import Header from "./components/Header";

function App() {
    const [transactions, setTransactions] = useState([]);
    //カレンダー表示設定
    const currentMonth = new Date().getMonth() + 1;
    const [nowOpenCalendar, setNowOpenCalendar] = useState(currentMonth);
    const calendarRef = useRef(null);
    const incrementCalendar = () => {
        setNowOpenCalendar(prev => (prev >= 12 ? 1 : prev + 1));
    };
    const mentCalendar = () => {
        setNowOpenCalendar(prev => (prev <= 1 ? 12 : prev - 1));
    }
    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(`2025-${String(nowOpenCalendar).padStart(2, '0')}-01`);
        }
    }, [nowOpenCalendar]);
    //sqlデータ送信テストデータ
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
    //sqlデータ取得
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
            <Header/>
            <button className={"save"}>保存</button>
            <div className={"SecondaryHeader"}>
                {/*左三角形*/}
                <div className={"PreviousMonth"} onClick={mentCalendar}></div>
                {/*月表示*/}
                <div className={"CalendarValue"}>{nowOpenCalendar}月</div>
                {/*右三角形*/}
                <div className={"NextMonth"} onClick={incrementCalendar}></div>
            </div>
            <div className={"calendar"}>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    initialDate={`2025-${String(nowOpenCalendar).padStart(2, '0')}-01`}
                    locales={[jaLocale]}
                    locale="ja"
                    headerToolbar={{
                        //left: '',
                        center: '',
                        right: 'dayGridMonth,listMonth',
                    }}
                    //events={[{title: 'event 1', start: time[0]},]}
                />
                <button onClick={sendData}>データ送信</button>
                {/*取得したテストデータ表示*/}
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
        </div>
    );
}

export default App;