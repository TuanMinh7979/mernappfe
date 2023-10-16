
import { deleteAPI, getAPI, postAPI, putAPI } from '@services/utils/fetchData';
import { freshAccessToken } from '@services/utils/tokenUtils';


export const chatService = {


  dispatch: null,


  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch
  }
  ,
  getConversationListService: async function (accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    console.log("__________________>>>>>>", accessToken);
    return await getAPI('/chat/message/conversations', accessToken)
  }
  ,

  markMessagesAsRead: async function (senderId, receiverId, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await putAPI(`/chat/message/mark-as-readed`, { senderId, receiverId }, accessToken);
  }
  ,
  // get chat messages
  getChatMessages: async function (receiverId, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await getAPI(`/chat/message/user/${receiverId}`, accessToken);

  }
  ,

  // 
  saveChatMessage: async function (body, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await postAPI('/chat/message', body, accessToken);

  }
  ,

  updateMessageReaction: async function (body, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await putAPI('/chat/message/reaction', body, accessToken);

  }
  ,
  markMessageAsDelete: async function (messageId, senderId, receiverId, type, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await deleteAPI(`/chat/message/mark-as-deleted/${messageId}/${senderId}/${receiverId}/${type}`, accessToken);

  }

}


