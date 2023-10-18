import axios from "@services/axios";
import { getAPI, putAPI } from "@services/utils/fetchData";
import { freshAccessToken } from "@services/utils/tokenUtils";
export const followerService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },
  followUser: async function (followerId) {
    let accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch)
    return await putAPI(`/user/follow/${followerId}`, {}, accessToken);
  },

  unFollowUser: async function (idolId, fanId) {
    let accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch)
    return await putAPI(`/user/unfollow/${idolId}/${fanId}`, {}, accessToken);
  },

  getLoggedUserIdols: async function () {
    // get my idols
    let accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch)
    return await getAPI("/user/following", accessToken);
  },
  getLoggedUserFans: async function (userId) {
    // get my fans
    let accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch)
    return await getAPI(`/user/followers/${userId}`, accessToken);
  },
  blockUser: async function (targetId) {
    let accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch)
    return await putAPI(`/user/block/${targetId}`, {}, accessToken);
  },
  unblockUser: async function (targetId) {
    let accessToken = await freshAccessToken(sessionStorage.getItem('accessToken'), this.dispatch)
    await putAPI(`/user/unblock/${targetId}`, {}, accessToken);
  },
};
