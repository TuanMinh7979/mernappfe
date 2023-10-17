import axios from "@services/axios";
import { getAPI, putAPI } from "@services/utils/fetchData";
import { freshAccessToken } from "@services/utils/tokenUtils";
export const followerService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },
  followUser: async function (followerId, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await putAPI(`/user/follow/${followerId}`, {}, accessToken);
  },

  unFollowUser: async function (idolId, fanId, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await putAPI(`/user/unfollow/${idolId}/${fanId}`, {}, accessToken);
  },

  getLoggedUserIdols: async function (accessToken) {
    // get my idols
    accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch)
    return await getAPI("/user/following", accessToken);
  },
  getLoggedUserFans: async function (userId, accessToken) {
    // get my fans
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await getAPI(`/user/followers/${userId}`, accessToken);
  },
  blockUser: async function (targetId, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    return await putAPI(`/user/block/${targetId}`, {}, accessToken);
  },
  unblockUser: async function (targetId, accessToken) {
    accessToken = await freshAccessToken(accessToken, this.dispatch)
    await putAPI(`/user/unblock/${targetId}`, {}, accessToken);
  },
};
