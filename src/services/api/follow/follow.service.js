
import { getAPI, putAPI } from "@services/utils/fetchData";
import { newestAccessToken } from "@services/utils/tokenUtils";
export const followerService = {
  dispatch: null,

  setDispatch: function (newDispatch) {
    this.dispatch = newDispatch;
  },
  save: async function (followerId) {
    let accessToken = await newestAccessToken( this.dispatch)
    return await putAPI(`/user/follow/${followerId}`, {}, accessToken);
  },

  delete: async function (idolId, fanId) {
    let accessToken = await newestAccessToken( this.dispatch)
    return await putAPI(`/user/unfollow/${idolId}/${fanId}`, {}, accessToken);
  },

  getLoggedUserFollowee: async function () {
    // get my idols
    let accessToken = await newestAccessToken( this.dispatch)
    return await getAPI("/user/following", accessToken);
  },
  getByUser: async function (userId) {

    let accessToken = await newestAccessToken( this.dispatch)
    return await getAPI(`/user/followers/${userId}`, accessToken);
  },
  blockUser: async function (targetId) {
    let accessToken = await newestAccessToken( this.dispatch)
    return await putAPI(`/user/block/${targetId}`, {}, accessToken);
  },
  unblockUser: async function (targetId) {
    let accessToken = await newestAccessToken( this.dispatch)
    await putAPI(`/user/unblock/${targetId}`, {}, accessToken);
  },
};
