import axios from "@services/axios";
import { getAPI, postAPI, putAPI } from "@services/utils/fetchData";
import { freshAccessToken } from "@services/utils/tokenUtils";
export const userService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },

  fetchUpdSugUsers: async function (accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await getAPI("/user/profile/user/suggestions", accessToken);
  },
  logoutUser: async function (accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await postAPI("/signout", {}, accessToken);
  },

  getAllUsers: async function (page, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await getAPI(`/user/all/${page}`, accessToken);
  },

  // search user for chat
  searchUsers: async function (query, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await getAPI(`/user/profile/search/${query}`, accessToken);
  },

  getUserProfileByUserId: async function (userId, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await getAPI(`/user/profile/${userId}`, accessToken);
  },
  getUserProfileAndPosts: async function (username, userId, accessToken) {
    console.log("--------------access token in getUserProfileAndPosts",accessToken);
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await getAPI(
      `/user/profile/posts/${username}/${userId}`,
      accessToken
    );
  },

  // update
  changePassword: async function (body, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await putAPI("/user/profile/change-password", body, accessToken);
  },

  updateNotificationSettings: async function (settings, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await putAPI("/user/profile/settings", settings, accessToken);
  },

  updateBasicInfo: async function (info, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await putAPI("/user/profile/basic-info", info, accessToken);
  },

  updateSocialLinks: async function (info, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch);
    return await putAPI("/user/profile/social-links", info, accessToken);
  },
};
