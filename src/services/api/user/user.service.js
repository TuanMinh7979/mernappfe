import axios from "@services/axios";
import { getAPI, postAPI, putAPI } from "@services/utils/fetchData";
import { newestAccessToken } from "@services/utils/tokenUtils";
export const userService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },

  fetchUpdSugUsers: async function () {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI("/user/profile/user/suggestions", accessToken);
  },
  logoutUser: async function () {
    let accessToken = await newestAccessToken( this.dispatch);
    return await postAPI("/signout", {}, accessToken);
  },

  getAllUsers: async function (page) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI(`/user/all/${page}`, accessToken);
  },

  // search user for chat
  searchUsers: async function (query) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI(`/user/profile/search/${query}`, accessToken);
  },

  getUserProfileByUserId: async function (userId) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await getAPI(`/user/profile/${userId}`, accessToken);
  },
  getUserProfileAndPosts: async function (username, userId) {
    let accessToken = await newestAccessToken(

      this.dispatch
    );

    return await getAPI(
      `/user/profile/posts/${username}/${userId}`,
      accessToken
    );
  },

  // update
  changePassword: async function (body) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await putAPI("/user/profile/change-password", body, accessToken);
  },

  updateNotificationSettings: async function (settings) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await putAPI("/user/profile/settings", settings, accessToken);
  },

  updateBasicInfo: async function (info) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await putAPI("/user/profile/basic-info", info, accessToken);
  },

  updateSocialLinks: async function (info) {
    let accessToken = await newestAccessToken( this.dispatch);
    return await putAPI("/user/profile/social-links", info, accessToken);
  },
};
