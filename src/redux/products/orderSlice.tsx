import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3030/ecom/order";

export interface OrderItem {
    product: string | { _id: string; title: string; price: number; image?: string };
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    // user: string;
    user:
    {
        _id: string;
        username: string;
        email: string;
    };
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: {
        username: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    paymentMethod: string;
    stripeSessionId?: string;
    status: "processing" | "shipped" | "delivered";
    createdAt: string;
    trackingNumber?: string | null;
    estimatedDelivery?: string;
}

interface OrdersState {
    orders: Order[];
    loading: boolean;
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    loading: false,
    error: null,
};

export const createOrder = createAsyncThunk(
    "orders/createOrder",
    async (
        orderData: {
            user: string;
            items: Array<{ product: string; quantity: number; price: number }>;
            totalAmount: number;
            shippingAddress: any;
            paymentMethod: string;
            stripeSessionId?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            console.log("Sending to backend:", orderData);
            const response = await axios.post(API_URL, orderData);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create order");
        }
    }
);

export const getOrders = createAsyncThunk(
    "orders/getOrders",
    async (userId: string | undefined, { rejectWithValue }) => {
        try {
            const url = userId ? `${API_URL}?user=${userId}` : API_URL;
            const response = await axios.get(url);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
        }
    }
);

export const getOrderById = createAsyncThunk(
    "orders/getOrderById",
    async (orderId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${orderId}`);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch order");
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "orders/updateOrderStatus",
    async (
        { orderId, status }: { orderId: string; status: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(`${API_URL}/${orderId}`, { status });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update order");
        }
    }
);

export const deleteOrder = createAsyncThunk(
    "orders/deleteOrder",
    async (orderId: string, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${orderId}`);
            return orderId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete order");
        }
    }
);

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex((o) => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                } else {
                    state.orders.push(action.payload);
                }
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex((o) => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter((o) => o._id !== action.payload);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default ordersSlice.reducer;
