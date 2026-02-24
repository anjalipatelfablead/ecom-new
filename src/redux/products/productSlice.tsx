
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
  stock?: number;
  status?: string;
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

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:3030/ecom/product/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue("Failed to delete product");
  }
});

export const addProduct = createAsyncThunk<
  Product,
  Omit<Product, "_id">,
  { rejectValue: string }
>("products/addProduct", async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      "http://localhost:3030/ecom/product",
      productData
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue("Failed to add product");
  }
});


export const updateProduct = createAsyncThunk<
  Product,
  { id: string; data: Omit<Product, "_id"> },
  { rejectValue: string }
>(
  "products/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3030/ecom/product/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to update product");
    }
  }
);


const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---- get all product ---
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

      // get product by id ----
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
      })

      // ---- delete product ------
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((product) => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete product";
      })

      // --- add product -----
      .addCase(addProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add product";
      })

      // ------ update prodct----

      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        state.selectedProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update product";
      })
  },
});

export default productSlice.reducer;