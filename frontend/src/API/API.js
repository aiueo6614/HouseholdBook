import axios from 'axios';

// APIのベースURLを設定
const API_URL = 'http://localhost:8001/api/transactions';

// 1. 取引のリストを取得する
export const getTransactions = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;  // 取得したデータを返す
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

// 2. 新しい取引を作成する
export const createTransaction = async (transactionData) => {
    try {
        const response = await axios.post(API_URL, transactionData);
        return response.data;  // 作成した取引のデータを返す
    } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
    }
};

// 3. 特定の取引を取得する
export const getTransactionById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;  // 取得した取引のデータを返す
    } catch (error) {
        console.error(`Error fetching transaction with id ${id}:`, error);
        throw error;
    }
};

// 4. 取引を更新する
export const updateTransaction = async (transactionData) => {
    try {
        const response = await axios.put(API_URL, transactionData);
        return response.data;  // 更新後の取引データを返す
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
};

// 5. 取引を削除する
export const deleteTransaction = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;  // 削除結果を返す
    } catch (error) {
        console.error(`Error deleting transaction with id ${id}:`, error);
        throw error;
    }
};
