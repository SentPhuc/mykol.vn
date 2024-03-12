import { createSlice } from '@reduxjs/toolkit';

export const loginLayout = createSlice({
    name: 'loginLayout',
    initialState: {
        isOpenPopup: false,
        isBuy: false,
    },
    reducers: {
        openPopupLogin: (state) => {
            state.isOpenPopup = true;
        },
        closePopupLogin: (state) => {
            state.isOpenPopup = false;
        },
        isBuyLogin: (state, action) => {
            state.isBuy = action.payload;
        }
    }
});

export const { openPopupLogin, closePopupLogin, isBuyLogin } = loginLayout.actions;
export default loginLayout.reducer;
