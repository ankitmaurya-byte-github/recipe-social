import { createSlice } from '@reduxjs/toolkit';

const dish=createSlice({
    name: 'recipe',
    initialState: {
        data:{}
    }, // Initial state of the counter
    reducers: {
        changedata:(state,actions)=>{
            state.data=actions.payload
        }
    }
})
export default dish.reducer
export const {changedata}=dish.actions