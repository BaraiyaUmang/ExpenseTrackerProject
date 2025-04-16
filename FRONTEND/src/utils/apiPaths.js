export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
        FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
        RESET_PASSWORD: (token) => `/api/v1/auth/reset-password/${token}`,
    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_ALL_INCOME: "/api/v1/income/get",
        DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: "/api/v1/income/downloadexcel",
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/v1/expense/add",
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: "/api/v1/expense/downloadexcel",
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    },
    ADMIN: {
        GET_STATS: "/api/v1/admin/stats",
        GET_ALL_USERS: "/api/v1/admin/users",
        GET_USER_DETAILS: (userId) => `/api/v1/admin/users/${userId}`,
        UPDATE_USER: (userId) => `/api/v1/admin/users/${userId}`,
        DELETE_USER: (userId) => `/api/v1/admin/users/${userId}`,
        GET_USER_TRANSACTIONS: (userId) => `/api/v1/admin/users/${userId}/transactions`,
    }
}; 