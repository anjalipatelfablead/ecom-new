import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "./productSlice";

const BASE_URL = "http://localhost:3030/ecom/wishlist";

export interface WishlistItem extends Product {
    addedDate: string;
}

interface WishlistState {
    items: WishlistItem[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    status: "idle",
    error: null,
};

export const fetchWishlist = createAsyncThunk<
    WishlistItem[],
    string,
    { rejectValue: string }
>("wishlist/fetchWishlist", async (userId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BASE_URL}/${userId}`);
        if (res.data.data?.products) {
            return res.data.data.products
                .filter((p: any) => p.productId)
                .map((p: any) => ({
                    ...p.productId,
                    addedDate: p.addedAt || new Date().toISOString(),
                }));
        }
        return [];
    } catch (error) {
        return rejectWithValue("Failed to fetch wishlist");
    }
});

export const addToWishlist = createAsyncThunk<
    WishlistItem[],
    { userId: string; productId: string },
    { rejectValue: string }
>("wishlist/addToWishlist", async ({ userId, productId }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${BASE_URL}/add`, { userId, productId });
        if (res.data.data?.products) {
            return res.data.data.products
                .filter((p: any) => p.productId)
                .map((p: any) => ({
                    ...p.productId,
                    addedDate: p.addedAt || new Date().toISOString(),
                }));
        }
        return [];
    } catch (error: any) {
        console.error("Add to wishlist error:", error.response?.data);
        return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist");
    }
});

export const removeFromWishlist = createAsyncThunk<
    WishlistItem[],
    { userId: string; productId: string },
    { rejectValue: string }
>("wishlist/removeFromWishlist", async ({ userId, productId }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${BASE_URL}/remove`, { userId, productId });
        if (res.data.data?.products) {
            return res.data.data.products
                .filter((p: any) => p.productId)
                .map((p: any) => ({
                    ...p.productId,
                    addedDate: p.addedAt || new Date().toISOString(),
                }));
        }
        return [];
    } catch (error) {
        return rejectWithValue("Failed to remove from wishlist");
    }
});

export const clearWishlist = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>("wishlist/clearWishlist", async (userId, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE_URL}/clear`, { data: { userId } });
    } catch (error) {
        return rejectWithValue("Failed to clear wishlist");
    }
});

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to fetch wishlist";
            })

            .addCase(addToWishlist.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to add to wishlist";
            })

            .addCase(removeFromWishlist.pending, (state) => {
                state.status = "loading";
            })
            .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Failed to remove from wishlist";
            })

            .addCase(clearWishlist.fulfilled, (state) => {
                state.items = [];
                state.status = "succeeded";
            });
    },
});

export default wishlistSlice.reducer;
