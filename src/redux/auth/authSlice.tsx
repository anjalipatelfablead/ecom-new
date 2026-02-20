import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3030/ecomuser";

// ================= TYPES =================

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ================= SESSION HELPERS =================

const getStoredAuth = () => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");

    return {
      token: token || null,
      currentUser: user ? JSON.parse(user) : null,
    };
  }

  return { token: null, currentUser: null };
};

const stored = getStoredAuth();

const initialState: AuthState = {
  currentUser: stored.currentUser,
  token: stored.token,
  loading: false,
  error: null,
};

// ================= LOGIN =================

export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// ================= REGISTER =================

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    formData: {
      username: string;
      email: string;
      password: string;
      address?: string;
      dateofbirth?: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(API_URL, formData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ================= SLICE =================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.token = null;

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        state.token = action.payload.token;
        state.currentUser = action.payload.user;

        if (typeof window !== "undefined") {
          sessionStorage.setItem("token", action.payload.token);
          sessionStorage.setItem(
            "user",
            JSON.stringify(action.payload.user)
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;