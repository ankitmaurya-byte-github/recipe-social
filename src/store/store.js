import {configureStore } from '@reduxjs/toolkit'
import userreducer from './slice'
import datareducer from './recipeSlice'
import { getDefaultMiddleware } from '@reduxjs/toolkit';
export const store=configureStore({
    reducer:{
        user:userreducer,
        dishdata:datareducer
    },
    middleware:getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})
