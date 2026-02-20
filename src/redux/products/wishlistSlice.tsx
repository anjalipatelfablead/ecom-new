// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Product } from "./productSlice";

// export interface WishlistItem extends Product {
//     addedDate: string;
// }

// interface WishlistState {
//     items: WishlistItem[];
// }

// const initialState: WishlistState = {
//     items: [],
// };

// const wishlistSlice = createSlice({
//     name: "wishlist",
//     initialState,
//     reducers: {
//         addToWishlist: (state, action: PayloadAction<Product>) => {
//             const exists = state.items.some(
//                 (item) => item.id === action.payload.id
//             );

//             if (!exists) {
//                 state.items.push({
//                     ...action.payload,
//                     addedDate: new Date().toISOString(),
//                 });
//             }
//         },

//         removeFromWishlist: (state, action: PayloadAction<number>) => {
//             state.items = state.items.filter(
//                 (item) => item.id !== action.payload
//             );
//         },

//         clearWishlist: (state) => {
//             state.items = [];
//         },
//     },
// });

// export const {
//     addToWishlist,
//     removeFromWishlist,
//     clearWishlist,
// } = wishlistSlice.actions;

// export default wishlistSlice.reducer;



import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "./productSlice";

export interface WishlistItem extends Product {
    addedDate: string;
}

interface WishlistState {
    items: WishlistItem[];
    userEmail: string;
}

type WishlistMap = Record<string, WishlistItem[]>;

const WISHLIST_KEY = "wishlistItems";

const loadAllWishlists = (): WishlistMap => {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "{}");
    } catch {
        return {};
    }
};

const saveAllWishlists = (data: WishlistMap) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(data));
};

const getLoggedEmail = (): string => {
    if (typeof window === "undefined") return "guest";
    try {
        return JSON.parse(sessionStorage.getItem("loggedUser") || "{}")?.email || "guest";
    } catch {
        return "guest";
    }
};

const email = getLoggedEmail();
const allWishlists = loadAllWishlists();

const initialState: WishlistState = {
    userEmail: email,
    items: allWishlists[email] || [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setUserWishlist: (state, action: PayloadAction<string>) => {
            const data = loadAllWishlists();

            state.userEmail = action.payload;
            state.items = data[action.payload] || [];
        },

        addToWishlist: (state, action: PayloadAction<Product>) => {
            const data = loadAllWishlists();
            const list = data[state.userEmail] || [];

            const exists = list.some(item => item.id === action.payload.id);
            if (!exists) {
                list.push({
                    ...action.payload,
                    addedDate: new Date().toISOString(),
                });
            }

            data[state.userEmail] = list;
            state.items = list;

            saveAllWishlists(data);
        },

        removeFromWishlist: (state, action: PayloadAction<number>) => {
            const data = loadAllWishlists();

            const updated = (data[state.userEmail] || []).filter(
                item => item.id !== action.payload
            );

            data[state.userEmail] = updated;
            state.items = updated;

            saveAllWishlists(data);
        },

        clearWishlist: (state) => {
            const data = loadAllWishlists();

            data[state.userEmail] = [];
            state.items = [];

            saveAllWishlists(data);
        },
    },
});


export const {
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    setUserWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
