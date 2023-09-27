import { createSlice } from "@reduxjs/toolkit";
import { orderBy } from "lodash";
import { getConversationList } from "@redux/api/chat";
const initialState = {
  conversationList: [],
  selectedChatUser: null,
  isLoading: false,
  curConversationId: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateChatNewEle: (state, action) => {
      const { isLoading, conversationList } = action.payload;
      state.conversationList = [...conversationList];
      state.isLoading = isLoading;
    },
    updateChatSelectedUser: (state, action) => {
      const { isLoading, user } = action.payload;
      state.selectedChatUser = user;
      state.isLoading = isLoading;
    },
    updateCurConversationId: (state, action) => {
      state.curConversationId = action.payload;
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
  updateChatNewEle,
  updateChatSelectedUser,
  updateCurConversationId,
} = chatSlice.actions;
export default chatSlice.reducer;
