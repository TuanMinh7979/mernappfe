import axios from '@services/axios';

class ChatService {
  async getConversationList() {
    const response = await axios.get('/chat/message/conversations');
    return response;
  }


  async addChatUsers(body) {
    const response = await axios.post('/chat/message/add-chat-users', body);
    return response;
  }


  async removeChatUsers(body) {
    const response = await axios.post('/chat/message/remove-chat-users', body);
    return response;
  }


}

export const chatService = new ChatService();
