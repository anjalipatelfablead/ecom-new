import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3030/ecomuser";

// ================= TYPES =================

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;  
  address?: string;
}

interface AuthState {
  currentUser: User | null;
  users: User[];
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
  users: [],
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

// ================= UPDATE USER =================

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (
    {
      userId,
      formData,
    }: {
      userId: string;
      formData: {
        username?: string;
        email?: string;
        phone?: string;
        address?: string;
        dateofbirth?: string;
      };
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(`${API_URL}/${userId}`, formData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

// ================= DELETE USER =================
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (userId: string, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/${userId}`);
      return userId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete failed"
      );
    }
  }
);

// ================= FETCH ALL USERS =================
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch users failed"
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
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        if (typeof window !== "undefined") {
          sessionStorage.setItem("user", JSON.stringify(state.currentUser));
        }
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
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Update current user data if the updated user is the current user
        if (state.currentUser && action.payload.updateduser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload.updateduser,
          };
          // Update sessionStorage
          if (typeof window !== "undefined") {
            sessionStorage.setItem(
              "user",
              JSON.stringify(state.currentUser)
            );
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // FETCH ALL USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;