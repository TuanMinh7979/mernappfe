import axios from "@services/axios";
import { getAPI, putAPI } from "@services/utils/fetchData";

class FollowerService {
  async followUser(followerId, accessToken) {
    console.log("followUser>>>>>", followerId);
    return await putAPI(`/user/follow/${followerId}`, {}, accessToken);

  }

  async unFollowUser(idolId, fanId, accessToken) {
    return await putAPI(`/user/unfollow/${idolId}/${fanId}`,{},  accessToken);

  }

  async getLoggedUserIdols(accessToken) {
    // get my idols
    return await getAPI('/user/following', accessToken);
  }

  async getLoggedUserFans(userId, accessToken) {
    // get my fans
    return await getAPI(`/user/followers/${userId}`, accessToken);

  }


  async blockUser(targetId, accessToken) {
    return await putAPI(`/user/block/${targetId}`,{},  accessToken);

  }

  async unblockUser(targetId, accessToken) {
    await putAPI(`/user/unblock/${targetId}`,{},  accessToken);

  }


}

export const followerService = new FollowerService();
