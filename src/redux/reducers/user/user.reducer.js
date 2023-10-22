import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  
    profile: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // updateLoggedUserProfile: (state, action) => {          
        //     state = action.payload;
        // },

        emptyLoggedUser:(state)=>{
            state.token= '';
            state.profile=null
        },
        updateLoggedUserProfile:(state, action)=>{
        
            state.profile=action.payload
        }

    }
});

export const { emptyLoggedUser, updateLoggedUserProfile} = userSlice.actions;
export default userSlice.reducer;