import api from "../../../services/api";

export const createExpense = async (expense, group_id) => {
    const response = await api.post(`/expenses/create/${group_id}`, expense);
    return response.data;
};

export const getExpense = async (expense_id) => {
    const response = await api.get(`/get/expense/${expense_id}`);
    return response.data;
};

export const getAllExpenses = async (group_id) => {
    const response = await api.get(`/get/expense/all/${group_id}`);
    return response.data;
};
