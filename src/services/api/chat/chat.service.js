
import { deleteAPI, getAPI, postAPI, putAPI } from '@services/utils/fetchData';


class ChatService {
  async getConversationListService(accessToken) {
    return await getAPI('/chat/message/conversations', accessToken)
  }

  async markMessagesAsRead(senderId, receiverId, accessToken) {
    return await putAPI(`/chat/message/mark-as-readed`, { senderId, receiverId }, accessToken);
  }

  // get chat messages
  async getChatMessages(receiverId, accessToken) {
    return await getAPI(`/chat/message/user/${receiverId}`, accessToken);

  }

  // 
  async saveChatMessage(body, accessToken) {
    return await postAPI('/chat/message', body, accessToken);

  }

  async updateMessageReaction(body, accessToken) {

    return await putAPI('/chat/message/reaction', body, accessToken);

  }
  async markMessageAsDelete(messageId, senderId, receiverId, type, accessToken) {
    return await deleteAPI(`/chat/message/mark-as-deleted/${messageId}/${senderId}/${receiverId}/${type}`, accessToken);

  }

}

export const chatService = new ChatService();
