


// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Product } from "@/redux/products/productSlice";

// export interface CartItem extends Product {
//     quantity: number;
// }

// interface CartState {
//     items: CartItem[];
//     userEmail: string;
// }

// type CartMap = Record<string, CartItem[]>;

// const CART_KEY = "cartItems";

// const loadAllCarts = (): CartMap => {
//     if (typeof window === "undefined") return {};
//     try {
//         return JSON.parse(localStorage.getItem(CART_KEY) || "{}");
//     } catch {
//         return {};
//     }
// };

// const saveAllCarts = (carts: CartMap) => {
//     if (typeof window === "undefined") return;
//     localStorage.setItem(CART_KEY, JSON.stringify(carts));
// };

// const getLoggedEmail = (): string => {
//     if (typeof window === "undefined") return "guest";
//     try {
//         return JSON.parse(sessionStorage.getItem("loggedUser") || "{}")?.email || "guest";
//     } catch {
//         return "guest";
//     }
// };

// const email = getLoggedEmail();
// const carts = loadAllCarts();

// const initialState: CartState = {
//     userEmail: email,
//     items: carts[email] || [],
// };

// const cartSlice = createSlice({
//     name: "cart",
//     initialState,
//     reducers: {
//         setUserCart: (state, action: PayloadAction<string>) => {
//             const allCarts = loadAllCarts();

//             state.userEmail = action.payload;
//             state.items = allCarts[action.payload] || [];
//         },

//         addToCart: (
//             state,
//             action: PayloadAction<{ product: Product; quantity?: number }>
//         ) => {
//             const { product, quantity = 1 } = action.payload;
//             const allCarts = loadAllCarts();

//             const userCart = allCarts[state.userEmail] || [];

//             const existing = userCart.find(item => item.id === product.id);

//             if (existing) {
//                 existing.quantity += quantity;
//             } else {
//                 userCart.push({ ...product, quantity });
//             }

//             allCarts[state.userEmail] = userCart;
//             state.items = userCart;

//             saveAllCarts(allCarts);
//         },

//         removeFromCart: (state, action: PayloadAction<number>) => {
//             const allCarts = loadAllCarts();

//             const updatedCart = (allCarts[state.userEmail] || []).filter(
//                 item => item.id !== action.payload
//             );

//             allCarts[state.userEmail] = updatedCart;
//             state.items = updatedCart;

//             saveAllCarts(allCarts);
//         },

//         updateQuantity: (
//             state,
//             action: PayloadAction<{ productId: number; quantity: number }>
//         ) => {
//             const allCarts = loadAllCarts();
//             const cart = allCarts[state.userEmail] || [];

//             const item = cart.find(i => i.id === action.payload.productId);

//             if (item) {
//                 item.quantity = action.payload.quantity;
//             }

//             allCarts[state.userEmail] = cart;
//             state.items = cart;

//             saveAllCarts(allCarts);
//         },

//         clearUserCart: (state) => {
//             const allCarts = loadAllCarts();

//             allCarts[state.userEmail] = [];
//             state.items = [];

//             saveAllCarts(allCarts);
//         },
//     },
// });


// export const {
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     setUserCart,
//     clearUserCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;




import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "@/redux/products/productSlice";

const BASE_URL = "http://localhost:3030/ecom/cart";



export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    cartId: string | null;
    items: CartItem[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CartState = {
    cartId: null,
    items: [],
    status: "idle",
    error: null,
};

// -- fetch by user--
export const fetchCart = createAsyncThunk<
    any,
    string,
    { rejectValue: string }
>("cart/fetchCart", async (userId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE_URL}?user=${userId}`);
        console.log("cart:  ", res.data.data);
        return res.data.data;

    } catch (error) {
        return rejectWithValue("Failed to fetch cart");
    }
});

// -- create ---
export const createCart = createAsyncThunk<
    any,
    { user: string; items: { product: string; quantity: number }[] },
    { rejectValue: string }
>("cart/createCart", async (payload, { rejectWithValue }) => {
    try {
        const res = await axios.post(BASE_URL, payload);
        return res.data.data;
    } catch (error) {
        return rejectWithValue("Failed to create cart");
    }
});

// --- update ---
export const updateCart = createAsyncThunk<
    any,
    { cartId: string; items: { product: string; quantity: number }[] },
    { rejectValue: string }
>("cart/updateCart", async ({ cartId, items }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${BASE_URL}/${cartId}`, { items });
        return res.data.data;
    } catch (error) {
        return rejectWithValue("Failed to update cart");
    }
});

// -- delete ---
export const deleteCart = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("cart/deleteCart", async (cartId, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE_URL}/${cartId}`);
        return cartId;
    } catch (error) {
        return rejectWithValue("Failed to delete cart");
    }
});

// --- sclice

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartState: (state) => {
            state.cartId = null;
            state.items = [];
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            /* FETCH */
            .addCase(fetchCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCart.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "succeeded";

                if (action.payload) {
                    state.cartId = action.payload._id;
                    state.items = action.payload.items;
                } else {
                    state.cartId = null;
                    state.items = [];
                }
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to fetch cart";
            })

            /* CREATE */
            .addCase(createCart.fulfilled, (state, action: PayloadAction<any>) => {
                state.cartId = action.payload._id;
                state.items = action.payload.items;
            })

            /* UPDATE */
            .addCase(updateCart.fulfilled, (state, action: PayloadAction<any>) => {
                state.items = action.payload.items;
                console.log(state.items);
            })

            /* DELETE */
            .addCase(deleteCart.fulfilled, (state) => {
                state.cartId = null;
                state.items = [];
            });
    },
});

export const { clearCartState } = cartSlice.actions;

export default cartSlice.reducer;