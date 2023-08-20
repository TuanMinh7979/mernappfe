import axios from "@services/axios";

class FollowerService {
  async followUser(followerId) {
    const response = await axios.put(`/user/follow/${followerId}`);
    return response;
  }

  async unFollowUser(idolId, fanId) {
    const response = await axios.put(`/user/unfollow/${idolId}/${fanId}`);
    return response;
  }

  async getLoggedUserIdols() {
    // get my idols
    const response = await axios.get('/user/following');
    return response;
  }

  async getLoggedUserFans(userId) {
    // get my fans
    const response = await axios.get(`/user/followers/${userId}`);
    return response;
  }


  async blockUser(targetId) {
    const response = await axios.put(`/user/block/${targetId}`);
    return response;
  }

  async unblockUser(targetId) {
    const response = await axios.put(`/user/unblock/${targetId}`);
    return response;
  }


}

export const followerService = new FollowerService();
