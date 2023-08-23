import axios from '@services/axios';
import userEvent from '@testing-library/user-event';

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
    // 
    console.log("send to api remove chat user", body);
    const response = await axios.post('/chat/message/remove-chat-users', body);
    return response;
  }
  async markMessagesAsRead(senderId, receiverId) {
    const response = await axios.put(`/chat/message/mark-as-readed`, { senderId, receiverId });
    return response;
  }

}

export const chatService = new ChatService();
