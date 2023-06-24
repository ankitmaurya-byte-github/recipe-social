import { createSlice } from '@reduxjs/toolkit';
const user=createSlice({
    name: 'products',
    initialState: {
        currentuser:{}
    }, // Initial state of the counter
    reducers: {
        changeuser:(state,actions)=>{
            state.currentuser=actions.payload
        }
    }
})

export default user.reducer
export const {changeuser}=user.actions