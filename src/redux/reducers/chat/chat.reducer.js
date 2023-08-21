
import { createSlice } from '@reduxjs/toolkit';
import { orderBy } from 'lodash';
import { getConversationList } from '@redux/api/chat';
const initialState = {
    chatList: [],
    selectedChatUser: null,
    isLoading: false
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        updateChatNewEle: (state, action) => {
            const { isLoading, chatList } = action.payload;
            state.chatList = [...chatList];
            state.isLoading = isLoading;
        },
        updateChatSelectedUser: (state, action) => {
            const { isLoading, user } = action.payload;
            state.selectedChatUser = user;
            state.isLoading = isLoading;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getConversationList.pending, (state) => {
            
            state.isLoading = true;
        });
        builder.addCase(getConversationList.fulfilled, (state, action) => {
            console.log(action.payload);
            const { list } = action.payload;
            state.isLoading = false;
            const sortedList = orderBy(list, ['createdAt'], ['desc']);
            state.chatList = [...sortedList];
        });
        builder.addCase(getConversationList.rejected, (state) => {
            state.isLoading = false;
        });
    }
});

export const { updateChatNewEle, updateChatSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
