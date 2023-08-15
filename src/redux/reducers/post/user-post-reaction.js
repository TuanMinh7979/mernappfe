import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reactions: []
};

const reactionsSlice = createSlice({
    name: 'reactions',
    initialState,
    reducers: {
        updReactions: (state, action) => {
            state.reactions = action.payload;
        }
    }
});

export const { updReactions } = reactionsSlice.actions;
export default reactionsSlice.reducer;