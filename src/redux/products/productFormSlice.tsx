import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface ProductFormData {
  title: string;
  price: number | string;
  description: string;
  category: string;
  image: string;
}

interface ProductFormState {
  formData: ProductFormData;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  imageUploadStatus: "idle" | "uploading" | "uploaded" | "failed";
  imageUrl: string | null;
}

const initialState: ProductFormState = {
  formData: {
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  },
  status: "idle",
  error: null,
  imageUploadStatus: "idle",
  imageUrl: null,
};

export const uploadProductImage = createAsyncThunk<
  string,
  FormData,
  { rejectValue: string }
>("productForm/uploadImage", async (formData, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      } as Record<string, string>,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Uploading image...");
    const response = await axios.post(
      "http://localhost:3030/ecom/upload",
      formData,
      config
    );
    console.log("Image upload response:", response.data);
    return response.data.url || response.data.path;
  } catch (error: any) {
    console.error("Image upload error:", error.response?.data || error.message);
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to upload image"
    );
  }
});

export const createProduct = createAsyncThunk<
  ProductFormData,
  ProductFormData,
  { rejectValue: string }
>("productForm/createProduct", async (productData, { rejectWithValue }) => {
  try {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

    const config = {
      headers: {
        "Content-Type": "application/json",
      } as Record<string, string>,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Sending product data:", productData);

    const response = await axios.post(
      "http://localhost:3030/ecom/product",
      productData,
      config
    );
    console.log("Product created response:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Product creation error:", error.response?.data || error.message);
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to create product"
    );
  }
});

const productFormSlice = createSlice({
  name: "productForm",
  initialState,
  reducers: {
    setFormField: (
      state,
      action: PayloadAction<{ field: keyof ProductFormData; value: string }>
    ) => {
      state.formData[action.payload.field] = action.payload.value;
    },
    setFormData: (state, action: PayloadAction<ProductFormData>) => {
      state.formData = action.payload;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.status = "idle";
      state.error = null;
      state.imageUploadStatus = "idle";
      state.imageUrl = null;
    },
    setImageUrl: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload;
      state.formData.image = action.payload;
      state.imageUploadStatus = "uploaded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProductImage.pending, (state) => {
        state.imageUploadStatus = "uploading";
        state.error = null;
      })
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        state.imageUploadStatus = "uploaded";
        state.imageUrl = action.payload;
        state.formData.image = action.payload;
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.imageUploadStatus = "failed";
        state.error = action.payload || "Failed to upload image";
      })
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.status = "succeeded";
        state.formData = initialState.formData;
        state.imageUrl = null;
        state.imageUploadStatus = "idle";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create product";
      });
  },
});

export const { setFormField, setFormData, resetForm, setImageUrl } =
  productFormSlice.actions;
export default productFormSlice.reducer;
