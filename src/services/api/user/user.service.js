import axios from "@services/axios";
import { getAPI, postAPI, putAPI } from "@services/utils/fetchData";

class UserService {
  async fetchUpdSugUsers(accessToken) {
    return await getAPI("/user/profile/user/suggestions", accessToken);

  }

  async logoutUser(accessToken) {
    return await postAPI('/signout', {}, accessToken);

  }

  async getAllUsers(page, accessToken) {
    return await getAPI(`/user/all/${page}`, accessToken);

  }

  // search user for chat
  async searchUsers(query, accessToken) {
    return await getAPI(`/user/profile/search/${query}`, accessToken);

  }

  async getUserProfileByUserId(userId, accessToken) {
    return await getAPI(`/user/profile/${userId}`, accessToken);

  }


  async getUserProfileAndPosts(username, userId, accessToken) {

    return await getAPI(`/user/profile/posts/${username}/${userId}`, accessToken);

  }

  // update
  async changePassword(body, accessToken) {
    return await putAPI('/user/profile/change-password', body, accessToken);

  }

  async updateNotificationSettings(settings, accessToken) {
    return await putAPI('/user/profile/settings', settings, accessToken);

  }

  async updateBasicInfo(info, accessToken) {
    return await putAPI('/user/profile/basic-info', info, accessToken);

  }

  async updateSocialLinks(info, accessToken) {
    return await putAPI('/user/profile/social-links', info, accessToken);

  }


}

export const userService = new UserService();
