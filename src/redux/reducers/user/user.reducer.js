import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: '',
    profile: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateLoggedUser: (state, action) => {
            const { token, profile } = action.payload;
            state.token = token;
            state.profile = profile;
        },

        emptyLoggedUser:(state)=>{
            state.token= '';
            state.profile=null
        },
        updateLoggedUserProfile:(state, action)=>{
        
            state.profile=action.payload.profile
        }

    }
});

export const { updateLoggedUser,emptyLoggedUser, updateLoggedUserProfile} = userSlice.actions;
export default userSlice.reducer;