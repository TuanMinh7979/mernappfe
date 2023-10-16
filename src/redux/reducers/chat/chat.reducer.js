import { createSlice } from "@reduxjs/toolkit";
import { orderBy } from "lodash";
import { fetchConversationList } from "@redux/api/chat";
const initialState = {
  conversationList: [],

  isLoading: false


};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    updateConversationList: (state, action) => {

      state.conversationList = action.payload;

    }



  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversationList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchConversationList.fulfilled, (state, action) => {

      // const { list } = action.payload;
      // state.isLoading = false;
      // const sortedList = orderBy(list, ["createdAt"], ["desc"]);
      // state.conversationList = [...sortedList];
    
    });
    builder.addCase(fetchConversationList.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  updateConversationList
} = chatSlice.actions;
export default chatSlice.reducer;