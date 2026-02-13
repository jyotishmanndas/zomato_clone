import { createSlice } from "@reduxjs/toolkit";
import type { AuthUser } from "../types";

interface AuthState {
    user: AuthUser | null;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: true
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        removeUser: (state) => {
            state.user = null;
            state.loading = false;
        }
    }
});

export const { setUser, removeUser } = authSlice.actions;
export default authSlice.reducer;