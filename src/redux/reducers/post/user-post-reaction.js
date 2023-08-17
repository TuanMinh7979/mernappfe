import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reactions: []
};

const reactionsSlice = createSlice({
    name: 'reactions',
    initialState,
    reducers: {
        updateLoggedUserReactions: (state, action) => {
            state.reactions = action.payload;
        }
    }
});

export const { updateLoggedUserReactions } = reactionsSlice.actions;
export default reactionsSlice.reducer;