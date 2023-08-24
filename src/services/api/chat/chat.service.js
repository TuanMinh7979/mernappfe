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

  // get chat messages
  async getChatMessages(receiverId) {
    const response = await axios.get(`/chat/message/user/${receiverId}`);
    return response;
  }

  // 
  async saveChatMessage(body) {
    const response = await axios.post('/chat/message', body);
    return response;
  }

  async updateMessageReaction(body) {
    const response = await axios.put('/chat/message/reaction', body);
    return response;
  }
  async markMessageAsDelete(messageId, senderId, receiverId, type) {
    const response = await axios.delete(`/chat/message/mark-as-deleted/${messageId}/${senderId}/${receiverId}/${type}`);
    return response;
  }

}

export const chatService = new ChatService();
