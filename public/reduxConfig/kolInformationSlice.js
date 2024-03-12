import { createSlice } from '@reduxjs/toolkit';

export const kolAdditionalProfile = createSlice({
    name: 'kolAdditionalProfile',
    initialState: [],
    reducers: {
        addKolAdditionalProfileProfile: (state, action) => {
            const newKolAdditionalProfileProfileProfile = action.payload;

            if (state.length === 0) {
                state.push(newKolAdditionalProfileProfileProfile);
            } else {
                state[0] = newKolAdditionalProfileProfileProfile;
            }
        }
    }
});

export const { addKolAdditionalProfileProfile } = kolAdditionalProfile.actions;
export default kolAdditionalProfile.reducer;