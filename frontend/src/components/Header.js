import React from 'react';
import styles from './Header.css';

const Header = () => {
    return (
        <div className="header">
            <button><a href="">ホーム</a></button>
            <select name="月選択" className="month">
                <option value="0">月選択</option>
                <option value="1">1月</option>
                <option value="2">2月</option>
                <option value="3">3月</option>
                <option value="4">4月</option>
                <option value="5">5月</option>
                <option value="6">6月</option>
                <option value="7">7月</option>
                <option value="8">8月</option>
                <option value="9">9月</option>
                <option value="10">10月</option>
                <option value="11">11月</option>
                <option value="12">12月</option>
            </select>
            <button><a href="">年間</a></button>
        </div>
    );
};

export default Header;