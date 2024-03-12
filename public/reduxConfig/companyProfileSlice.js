import { createSlice } from '@reduxjs/toolkit';

export const companyProfile = createSlice({
    name: 'companyProfiles',
    initialState: {
        idJob: 0,  
    },
    reducers: {
        addCompanyProfile: (state, action) => {
            const newCompanyProfile = action.payload;

            if (state.length === 0) {
                state.push(newCompanyProfile);
            } else {
                state[0] = newCompanyProfile;
            }
        },
        addIdJobFilter: (state, action) => {
            state.idJob = action.payload;
        }
    }
});

export const { addCompanyProfile, addIdJobFilter } = companyProfile.actions;
export default companyProfile.reducer;