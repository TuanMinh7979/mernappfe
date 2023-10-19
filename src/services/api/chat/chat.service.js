import { deleteAPI, getAPI, postAPI, putAPI } from "@services/utils/fetchData";
import { newestAccessToken } from "@services/utils/tokenUtils";

export const chatService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },
  getConversationListService: async function () {
    let accessToken = await newestAccessToken(this.dispatch);

    return await getAPI("/chat/message/conversations", accessToken);
  },
  markMessagesAsRead: async function (senderId, receiverId) {
    let accessToken = await newestAccessToken(this.dispatch);
    return await putAPI(
      `/chat/message/mark-as-readed`,
      { senderId, receiverId },
      accessToken
    );
  },
  // get chat messages
  getChatMessages: async function (receiverId) {
    let accessToken = await newestAccessToken(this.dispatch);
    return await getAPI(`/chat/message/user/${receiverId}`, accessToken);
  },
  //
  saveChatMessage: async function (body) {
    let accessToken = await newestAccessToken(this.dispatch);
    return await postAPI("/chat/message", body, accessToken);
  },
  updateMessageReaction: async function (body) {
    let accessToken = await newestAccessToken(this.dispatch);
    return await putAPI("/chat/message/reaction", body, accessToken);
  },
  markMessageAsDelete: async function (messageId, senderId, receiverId, type) {
    let accessToken = await newestAccessToken(this.dispatch);
    return await deleteAPI(
      `/chat/message/mark-as-deleted/${messageId}/${senderId}/${receiverId}/${type}`,
      accessToken
    );
  },
};
