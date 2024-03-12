import {configureStore} from "@reduxjs/toolkit";
import kolProfileReducer from "./kolsProfileSlice";

const rootReducer = {
    profiles: kolProfileReducer,
}

const store = configureStore({
    reducer: rootReducer,
})

export default store;