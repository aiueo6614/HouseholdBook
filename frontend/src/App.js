import React, {useState} from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import jaLocale from '@fullcalendar/core/locales/ja';
import './App.css';
import Header from "./components/Header";

function App() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions,setFilteredTransactions] = useState([]);
    const [categoryFilter,setCategoryFilter] =useState('');
    //カレンダーイベントテストデータ
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
    const handleFilterChange = (event) => {
        const selectedCategory = event.target.value;
        setCategoryFilter(selectedCategory);
        if(selectedCategory === 'all'){
            //全データを表示
            setFilteredTransactions(transactions);
    }else{
        //選択されたカテゴリーのみ表示
            const filteredData = transactions.filter(tx => tx.category === selectedCategory);
        setFilteredTransactions(filteredData);
        }
    };

    return (
        <div>
            <Header/>
            <button className={"save"}>保存</button>
            <div className={"SecondaryHeader"}>
                {/*左三角形*/}
                <div className={"PreviousMonth"}><a href={""}></a></div>
                {/*右三角形*/}
                <div className={"NextMonth"}><a href={""}></a></div>
            </div>
            <div className={"calendar"}>
                <FullCalendar
                    plugins={[dayGridPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    locales={[jaLocale]}
                    locale="ja"
                    headerToolbar={{
                        left: '',
                        center:'',
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
                {/*取得したテストデータ表示*/}
                <div>
                    <h2>取得したデータ</h2>
                    <ul>
                        {transactions.map((tx, index) => (
                            <li key={index}>{tx.date} - {tx.category} - {tx.description} - {tx.amount}円</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2>取得したデータのカテゴリー別け</h2>

                    {/* フィルタ用のドロップダウン */}
                    <label htmlFor="categoryFilter">カテゴリーで絞り込み:</label>
                    <select id="categoryFilter" value={categoryFilter} onChange={handleFilterChange}>
                        <option value="all">すべて</option>
                        <option value="食費">食費</option>
                        <option value="交通費">交通費</option>
                        <option value="娯楽">娯楽</option>
                        {/* 必要に応じてカテゴリを追加 */}
                    </select>

                    <ul>
                        {filteredTransactions.map((tx, index) => (
                            <li key={index}>{tx.date} - {tx.category} - {tx.description} - {tx.amount}円</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;