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


  // use in People page, user is user state list in page
  static socketIOFollowAndUnfollow(users, myIdols, setMyIdols, setUsers) {

    // in follow-user
    socketService?.socket?.on('add follow', (newIdolData) => {
    
      const idolIndex = users.findIndex((user) => user._id === newIdolData?._id);
      if (idolIndex != -1) {
        
        // update idol state
        setMyIdols([...myIdols, newIdolData]);
        // update users state
        let newUser = { ...users[idolIndex] }
        newUser.followersCount = newIdolData.followersCount;
        newUser.followingCount = newIdolData.followingCount;

        let newUsers = [...users]
        newUsers.splice(idolIndex, 1, newUser);
        setUsers([...newUsers])

      }
    });

    socketService?.socket?.on('remove follow', (newIdolData) => {
     
      const idolIndex = users.findIndex((user) => user._id === newIdolData?._id);
      if (idolIndex) {
        // update idol state
        let newMyIdols = myIdols.filter((idol) => idol._id !== newIdolData?._id);
        setMyIdols([...newMyIdols])
        // update users state
        let newUser = { ...users[idolIndex] }
        newUser.followersCount = newIdolData.followersCount;
        newUser.followingCount = newIdolData.followingCount;
        newUser.postsCount = newIdolData.postsCount;
        let newUsers = [...users]
        newUsers.splice(idolIndex, 1, newUser);
        setUsers([...newUsers])

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



  // block and unblock
  // in socket/user.ts
  // update profile in redux
  static socketIOBlockAndUnblock(profile, token, setBlockedUsers, dispatch) {

    // **   Chỉ khởi tạo socket block và real time được khi user đã vào trang /follower và chạy hàm này
    // **  nếu không sẽ không thể real time
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
      newProfile.blockedBy = [...newBlockedBys];

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
