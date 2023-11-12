import { updateLoggedUserProfile } from '@redux/reducers/user/user.reducer';
import { socketService } from '@services/socket/socket.service';
export class FollowersUtils {
  //  use in People page
  static socketIOFollowAndUnfollowInPeoplePage(users, myIdols, setMyIdols, setUsers) {
    // when follow some one and then will be received from server socket "added follow"
    socketService?.socket?.on('added follow', (newIdolData) => {
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
    // when remove follow some one and then will be received from server socket "added follow"
    socketService?.socket?.on('removed follow', (newIdolData) => {

      const idolIndex = users.findIndex((user) => user._id === newIdolData?._id);
      if (idolIndex != -1) {

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
  static socketIOFollowAndUnfollowInStreamsPage(loggedUserIdols, setLoggedUserIdols) {
    // when follow some one and then will be received from server socket "added follow"
    socketService?.socket?.on('added follow', (newIdolData) => {
      const idolIndex = loggedUserIdols.findIndex((user) => user._id === newIdolData._id);

      if (idolIndex == -1) {
        setLoggedUserIdols([...loggedUserIdols, newIdolData]);
      }
    });
    // when remove follow some one and then will be received from server socket "added follow"
    socketService?.socket?.on('removed follow', (newIdolData) => {


      let newMyIdols = loggedUserIdols.filter((idol) => idol._id !== newIdolData._id);
      setLoggedUserIdols([...newMyIdols])


    });
  }

  //  use for following page
  static socketIORemoveFollowing(following, setFollowing) {
    socketService?.socket?.on('removed follow', (data) => {
      const updatedFollowing = following.filter((user) => user._id !== data?._id);
      setFollowing([...updatedFollowing]);
    });
  }



  // block and unblock
  // in socket/user.ts
  // update profile in redux
  static socketIOBlockAndUnblock(profile, dispatch) {

    // **   Chỉ khởi tạo socket block và real time được khi user đã vào trang /follower và chạy hàm này
    // **  nếu không sẽ không thể real time
    socketService?.socket?.on('blocked user id', (data) => {
      // data:  blockedUser: toBlockUser._id, blockedBy: profile._id
      // updating reduxUser.profile
      const newProfile = FollowersUtils.updateProfileWhenBlock(profile, data);

      // update blockedUsers State in Follower Component
      // update blocked list in state
      // setMyBlockedUsers(newProfile?.blocked);
      // update profile in redux
      dispatch(updateLoggedUserProfile(newProfile));
    });

    socketService?.socket?.on('unblocked user id', (data) => {

      // updating reduxUser.profile
      const newProfile = FollowersUtils.updateProfileWhenUnBlock(profile, data);
      // update blockedUsers State in Follower Component
      // setMyBlockedUsers(newProfile?.blocked);

      dispatch(updateLoggedUserProfile(newProfile));
    });
  }

  static socketIOBlockAndUnblockProfileFollowTab(user, setUser) {
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

    if (newProfile._id === data.blockedBy) {

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
