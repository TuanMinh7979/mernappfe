import { fetchUpdSugUsers } from '@redux/api/suggestion';
import { createSlice } from '@reduxjs/toolkit';
import { emptyPostData } from '@services/utils/static.data';

const initialState = emptyPostData
const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        updatePost: (state, action) => {
            for (const [key, value] of Object.entries(action.payload)) {
             
                state[key] = value
            }
        },
        emptyPost: () => {
            return emptyPostData
        }

    },

});

export const { updatePost, emptyPost } = postSlice.actions;
export default postSlice.reducer;
