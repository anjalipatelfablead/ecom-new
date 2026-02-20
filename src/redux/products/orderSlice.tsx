import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/redux/products/cartSlice";

export interface Order {
    id: string;
    date: string;
    status: "processing" | "shipped" | "delivered";
    total: number;
    items: CartItem[];
    trackingNumber?: string | null;
    estimatedDelivery: string;
}

interface OrdersState {
    ordersByEmail: Record<string, Order[]>;
}

const STORAGE_KEY = "userOrders";

const loadOrders = (): OrdersState["ordersByEmail"] => {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
};

const saveOrders = (data: OrdersState["ordersByEmail"]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const initialState: OrdersState = {
    ordersByEmail: loadOrders(),
};

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        addOrder: (
            state,
            action: PayloadAction<{ email: string; order: Order }>
        ) => {
            const { email, order } = action.payload;

            if (!state.ordersByEmail[email]) {
                state.ordersByEmail[email] = [];
            }

            state.ordersByEmail[email].unshift(order);
            saveOrders(state.ordersByEmail);
        },

        clearOrdersByEmail: (state, action: PayloadAction<string>) => {
            delete state.ordersByEmail[action.payload];
            saveOrders(state.ordersByEmail);
        },
    },
});

export const { addOrder, clearOrdersByEmail } = ordersSlice.actions;
export default ordersSlice.reducer;
