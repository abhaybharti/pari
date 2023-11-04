import {configureStore, createReducer} from "@reduxjs/toolkit";

const appstore = configureStore({
    reducer:{
        cart: createReducer,
        products: productReducer
    }
})

export default appstore;