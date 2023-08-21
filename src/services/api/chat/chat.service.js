import axios from '@services/axios';

class ChatService {
  async getConversationList() {
    const response = await axios.get('/chat/message/conversations');
    return response;
  }

 
}

export const chatService = new ChatService();
