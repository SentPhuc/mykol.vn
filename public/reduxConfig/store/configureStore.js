import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';
import profileReducers from '../kolsProfileSlice';
import companyProfileReducer from "../companyProfileSlice";
import kolAdditionalProfileReducer from "../kolInformationSlice";
import loginLayoutReducer from '../loginSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        profiles: profileReducers,
        companyProfile: companyProfileReducer,
        kolAdditionalProfile: kolAdditionalProfileReducer,
        loginLayout: loginLayoutReducer
    },
});
