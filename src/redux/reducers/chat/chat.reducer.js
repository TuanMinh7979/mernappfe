import { createSlice } from "@reduxjs/toolkit";
import { orderBy } from "lodash";
import { getConversationList } from "@redux/api/chat";
const initialState = {
  conversationList: [],
  selectedChatUser: null,
  isLoading: false


};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    updateChatSelectedUser: (state, action) => {
      state.selectedChatUser = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder.addCase(getConversationList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getConversationList.fulfilled, (state, action) => {

      const { list } = action.payload;
      state.isLoading = false;
      const sortedList = orderBy(list, ["createdAt"], ["desc"]);
      state.conversationList = [...sortedList];
    });
    builder.addCase(getConversationList.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {

  updateChatSelectedUser,

} = chatSlice.actions;
export default chatSlice.reducer;
