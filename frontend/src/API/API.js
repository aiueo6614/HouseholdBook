import axios from 'axios';

// APIのベースURLを設定
const API_URL = 'http://localhost:8001/api/transactions';

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
