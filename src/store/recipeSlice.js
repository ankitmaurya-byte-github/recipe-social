import { createSlice } from '@reduxjs/toolkit';

const dish=createSlice({
    name: 'recipe',
    initialState: {
        data:{}
    }, 
    reducers: {
        changedata:(state,actions)=>{
            state.data=actions.payload
        }
    }
})
export default dish.reducer
export const {changedata}=dish.actions