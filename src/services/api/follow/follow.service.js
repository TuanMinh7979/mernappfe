import axios from "@services/axios";

class FollowerService {
  async followUser(followerId) {
    const response = await axios.put(`/user/follow/${followerId}`);
    return response;
  }

  async getLoggedUserIdols() {
    // get my idols
    const response = await axios.get('/user/following');
    return response;
  }

}

export const followerService = new FollowerService();
