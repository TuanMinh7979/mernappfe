import { createAsyncThunk } from "@reduxjs/toolkit";
import { Utils } from "@services/utils/utils.service";
import { chatService } from "@services/api/chat/chat.service";

const getConversationList = createAsyncThunk('chat/getUserChatList', async (name, { dispatch }) => {
    try {
        const response = await chatService.getConversationList();
        return response.data;
    } catch (error) {
        Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
    }
});

export { getConversationList };
