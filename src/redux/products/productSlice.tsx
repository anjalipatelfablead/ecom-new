
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

// export interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
//   rating: {
//     rate: number;
//     count: number;
//   };
// }

// interface ProductState {
//   items: Product[];
//   status: "idle" | "loading" | "succeeded" | "failed";
//   error: string | null;
// }

// const initialState: ProductState = {
//   items: [],
//   status: "idle",
//   error: null,
// };

// export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>("products/fetchProducts", async (_, { rejectWithValue }) => {
//   try {
//     const response = await axios.get<Product[]>(
//       "https://fakestoreapi.com/products"
//     );
//     return response.data;
//   } catch (error) {
//     return rejectWithValue("Failed to fetch products");
//   }
// });

// export const selectProductById = (
//   state: { products: ProductState },
//   productId: number
// ) => state.products.items.find((p) => p.id === productId);

// const productSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(
//         fetchProducts.fulfilled,
//         (state, action: PayloadAction<Product[]>) => {
//           state.status = "succeeded";
//           state.items = action.payload;
//         }
//       )
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Failed to fetch products";
//       });
//   },
// });

// export default productSlice.reducer;



import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

interface ProductState {
  items: Product[];
  selectedProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      "http://localhost:3030/ecom/product"
    );

    return response.data.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch products");
  }
});


export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/ecom/product/${id}`
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch product");
    }
  }
);



const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch products";
      })


      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
        state.selectedProduct = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.status = "succeeded";
          state.selectedProduct = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch product";
      });
  },
});

export default productSlice.reducer;