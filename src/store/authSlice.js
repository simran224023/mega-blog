import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: null, 
    userData: null,
    loading: true, 
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.loading = false;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})

export const {login, logout, setLoading} = authSlice.actions;
export default authSlice.reducer;