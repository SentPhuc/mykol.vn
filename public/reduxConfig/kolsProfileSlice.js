import { createSlice } from '@reduxjs/toolkit';

export const profile = createSlice({
    name: 'profiles',
    initialState: [],
    reducers: {
        addProfile: (state, action) => {
            const newData = action.payload;
            if (state.length === 0) {
                state.push(newData);
            } else {
                state[0] = newData;
            }
        }
    }
});

export const { addProfile } = profile.actions;
export default profile.reducer;
