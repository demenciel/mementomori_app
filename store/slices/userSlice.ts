// app/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    dateOfBirth: Date | undefined | string;
}

interface TimeLeft {
    years: number;
    months: number;
    seasons: number;
    days: number;
    timeLeft: string | undefined;
    yearsPassed: number;
}

interface UserState {
    profile: UserProfile | null;
    timeLeft: TimeLeft | null;
}

const initialState: UserState = {
    profile: null,
    timeLeft: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserProfile(state, action: PayloadAction<UserProfile>) {
            state.profile = action.payload;
        },
        clearUserProfile(state) {
            state.profile = null;
        },
        setTimeLeftRedux(state, action: PayloadAction<TimeLeft>) {
            state.timeLeft = action.payload;
        }
    },
});

export const { setUserProfile, clearUserProfile, setTimeLeftRedux } = userSlice.actions;
export default userSlice.reducer;
