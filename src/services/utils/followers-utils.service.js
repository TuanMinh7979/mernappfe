import { updateLoggedUser } from '@redux/reducers/user/user.reducer';
import { followerService } from '@services/api/follow/follow.service';

import { Utils } from '@services/utils/utils.service';
import { socketService } from '@services/socket/socket.service';


export class FollowersUtils {
  static async followUser(user, dispatch) {
    const response = await followerService.followUser(user?._id);
    Utils.updToastsNewEle(response.data.message, 'success', dispatch);
  }

  static async unFollowUser(user, profile, dispatch) {
    const response = await followerService.unFollowUser(user?._id, profile?._id);
    Utils.updToastsNewEle(response.data.message, 'success', dispatch);
  }


  static async blockUserInServer(user, dispatch) {
    const response = await followerService.blockUser(user?._id);
    Utils.updToastsNewEle(response.data.message, 'success', dispatch);
  }

  static async unblockUser(user, dispatch) {
    const response = await followerService.unblockUser(user?._id);
    Utils.updToastsNewEle(response.data.message, 'success', dispatch);
  }


  static socketIOFollowAndUnfollow(users, followers, setFollowers, setUsers) {
    // in follow-user
    socketService?.socket?.on('add follow', (data) => {
      const userData = users.find((user) => user._id === data?._id);
      if (userData) {
        const updatedFollowers = [...followers, data];
        setFollowers(updatedFollowers);
        FollowersUtils.updateSingleUser(users, userData, data, setUsers);
      }
    });

    socketService?.socket?.on('remove follow', (data) => {
      const userData = users.find((user) => user._id === data?._id);
      if (userData) {
        const updatedFollowers = followers.filter((follower) => follower._id !== data?._id);
        setFollowers(updatedFollowers);
        FollowersUtils.updateSingleUser(users, userData, data, setUsers);
      }
    });
  }

  //  use for following page
  static socketIORemoveFollowing(following, setFollowing) {
    socketService?.socket?.on('remove follow', (data) => {
      const updatedFollowing = following.filter((user) => user._id !== data?._id);
      setFollowing(updatedFollowing);
    });
  }

  static updateSingleUser(users, userData, followerData, setUsers) {
    let newUsers = { ...users };
    userData.followersCount = followerData.followersCount;
    userData.followingCount = followerData.followingCount;
    userData.postsCount = followerData.postsCount;
    const index = users.findIndex((item) => item._id === userData?._id);
    if (index > -1) {
      newUsers.splice(index, 1, userData);
      setUsers({ ...newUsers });
    }
  }


  // block and unblock
  // in socket/user.ts
  // update profile in redux
  static socketIOBlockAndUnblock(profile, token, setBlockedUsers, dispatch) {
    socketService?.socket?.on('blocked user id', (data) => {
      // updating reduxUser.profile
      const newProfile = FollowersUtils.updateProfileWhenBlock(profile, data);
      // update blockedUsers State in Follower Component
      setBlockedUsers(newProfile?.blocked);
      dispatch(updateLoggedUser({ token, profile: newProfile }));
    });

    socketService?.socket?.on('unblocked user id', (data) => {
      // updating reduxUser.profile
      const newProfile = FollowersUtils.updateProfileWhenUnBlock(profile, data);
      // update blockedUsers State in Follower Component
      setBlockedUsers(newProfile?.blocked);
      dispatch(updateLoggedUser({ token, profile: newProfile }));
    });
  }

  static socketIOBlockAndUnblockCard(user, setUser) {
    socketService?.socket?.on('blocked user id', (data) => {
      const userData = FollowersUtils.updateProfileWhenBlock(user, data);
      setUser(userData);
    });

    socketService?.socket?.on('unblocked user id', (data) => {
      const userData = FollowersUtils.updateProfileWhenUnBlock(user, data);
      setUser(userData);
    });
  }


  static updateProfileWhenBlock(profile, data) {
    let newProfile = { ...profile };
    if (newProfile?._id === data.blockedBy) {
      // if i give a block
      let newBlockeds = [...newProfile.blocked]
      newBlockeds.push(data.blockedUser)
      newProfile.blocked = [...newBlockeds];
    }
    // if i receive a block
    if (newProfile?._id === data.blockedUser) {

      let newBlockedBys = [...newProfile.blockedBy]
      newBlockedBys.push(data.blockedBy)
      newProfile.blocked = [...newBlockedBys];

    }
    return newProfile;
  }

  static updateProfileWhenUnBlock(profile, data) {
    let newProfile = { ...profile };
    // if i get back a block
    if (newProfile?._id === data.blockedBy) {
      let newBlockeds = [...newProfile.blocked]
      newBlockeds = newBlockeds.filter(el => el !== data.blockedUser)
      newProfile.blocked = [...newBlockeds];
    }
    // if someone get back my block
    if (newProfile?._id === data.blockedUser) {
      let newBlockedBys = [...newProfile.blockedBy]
      newBlockedBys = newBlockedBys.filter(el => el !== data.blockedBy)
      newProfile.blockedBy = [...newBlockedBys];
    }
    return newProfile;
  }






}
