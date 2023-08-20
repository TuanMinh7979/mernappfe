import axios from "@services/axios";

class UserService {
  async fetchUpdSugUsers() {
    const response = await axios.get("/user/profile/user/suggestions");
    return response;
  }

  async logoutUser() {
    const response = await axios.post('/signout');
    return response;
  }
  async checkCurrentUser() {
    const response = await axios.get('/currentuser');
    return response;
  }
  async getAllUsers(page) {
    const response = await axios.get(`/user/all/${page}`);
    return response;
  }

}

export const userService = new UserService();
