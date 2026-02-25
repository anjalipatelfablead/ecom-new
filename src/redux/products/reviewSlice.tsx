import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3030/ecom/review";

export interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    email?: string;
  };
  product: {
    _id: string;
    title: string;
  } | string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface ReviewState {
  reviews: Review[];
  productReviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  productReviews: [],
  loading: false,
  error: null,
};

// Add a new review (user)
export const addReview = createAsyncThunk<
  Review,
  { userId: string; productId: string; rating: number; comment: string },
  { rejectValue: string }
>("reviews/addReview", async (reviewData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, reviewData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add review");
  }
});

// Get product reviews (public - only approved)
export const getProductReviews = createAsyncThunk<
  Review[],
  string,
  { rejectValue: string }
>("reviews/getProductReviews", async (productId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
  }
});

// Get all reviews (admin) - includes pending, approved, rejected
export const getAllReviews = createAsyncThunk<
  Review[],
  string | undefined,
  { rejectValue: string }
>("reviews/getAllReviews", async (status, { rejectWithValue }) => {
  try {
    const url = status ? `${API_URL}?status=${status}` : API_URL;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
  }
});

// Approve review (admin)
export const approveReview = createAsyncThunk<
  Review,
  string,
  { rejectValue: string }
>("reviews/approveReview", async (reviewId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/approve/${reviewId}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to approve review");
  }
});

// Reject review (admin)
export const rejectReview = createAsyncThunk<
  Review,
  string,
  { rejectValue: string }
>("reviews/rejectReview", async (reviewId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/reject/${reviewId}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to reject review");
  }
});

// Delete review (admin)
export const deleteReview = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("reviews/deleteReview", async (reviewId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${reviewId}`);
    return reviewId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete review");
  }
});

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- Add Review ----
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.productReviews.unshift(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---- Get Product Reviews ----
      .addCase(getProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.productReviews = action.payload;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---- Get All Reviews (Admin) ----
      .addCase(getAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---- Approve Review ----
      .addCase(approveReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        const index = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(approveReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---- Reject Review ----
      .addCase(rejectReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        const index = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(rejectReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ---- Delete Review ----
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
