import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LocationData } from "../types";

interface LocationState {
    location: LocationData | null,
    city: string
}

const initialState: LocationState = {
    location: null,
    city: "Fetching location"
}

export const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<LocationData>) => {
            state.location = action.payload
        },
        setCity: (state, action: PayloadAction<string>) => {
            state.city = action.payload
        }
    }
});

export const { setLocation, setCity } = locationSlice.actions;
export default locationSlice.reducer;