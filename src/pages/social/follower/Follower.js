import React, { useState } from 'react'
import "./Follower.scss"
import { Utils } from '@services/utils/utils.service'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import useInfiniteScroll from '@hooks/useInfiniteScroll'
import { FaCircle } from 'react-icons/fa'
import Avatar from '@components/avatar/Avatar'
import CardElementButtons from '@components/card-element/CardElementButton'
import CardElementStats from '@components/card-element/CardElementStats'
import { useCallback } from 'react'
import { uniqBy } from "lodash"
import { userService } from '@services/api/user/user.service'
import useEffectOnce from '@hooks/useEffectOnce'
import { ProfileUtils } from '@services/utils/profile-utils.service'
import { FollowersUtils } from '@services/utils/followers-utils.service'
import { socketService } from '@services/socket/socket.service'
import { followerService } from '@services/api/follow/follow.service'
import { useEffect } from 'react'
const Follower = () => {
  const { profile, token } = useSelector((state) => state.user);
  const [followers, setFollowers] = useState([]);
  const [myblockedUsers, setMyBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ? init follower

  const getMyFans = useCallback(async () => {
    try {
      if (profile) {
        const response = await followerService.getLoggedUserFans(profile?._id);
        setFollowers(response.data.followers);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
    }
  }, [profile, dispatch]);

  // ? END init followers
  // ? new user data when scroll 


  useEffect(() => {
    getMyFans();
    setMyBlockedUsers(profile.blocked)

  }, [getMyFans, profile]);
  useEffect(() => {
    FollowersUtils.socketIOBlockAndUnblock(profile, token, setMyBlockedUsers, dispatch)

  }, [dispatch, profile, token]);

  // ? END new user data when scroll 


  // ? block and unblock
  const blockUser = async (user) => {
    try {
      // hdl in sockets/user.ts
      //   TODO: change to client=>service=>socket to clients
      socketService?.socket?.emit('block user', {
        blockedUser: user._id, blockedBy: profile._id
      })
      //  service
      FollowersUtils.blockUserInServer(user, dispatch)
    } catch (error) {
      Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
    }
  };

  const unBlockUser = async (user) => {
    try {
      socketService?.socket?.emit('unblock user', {

        blockedUser: user._id, blockedBy: profile._id
      })
      FollowersUtils.unblockUser(user, dispatch)
    } catch (error) {
      Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
    }
  };
  // ? END block and unBlock
  return (
    <div className="card-container" >
      <div className="followers">People</div>
      {followers.length > 0 && (
        <div className="card-element">
          {followers.map((data) => (
            <div className="card-element-item" key={data?._id} data-testid="card-element-item">

              <div className="card-element-header">
                <div className="card-element-header-bg"></div>
                <Avatar
                  name={data?.username}
                  bgColor={data?.avatarColor}
                  textColor="#ffffff"
                  size={120}
                  avatarSrc={data?.profilePicture}
                />
                <div className="card-element-header-text">
                  <span className="card-element-header-name">{data?.username}</span>
                </div>
              </div>

              <CardElementStats
                postsCount={data?.postsCount}
                followersCount={data?.followersCount}
                followingCount={data?.followingCount}
              />
              <CardElementButtons
                isChecked={Utils.checkIfUserIsBlocked(myblockedUsers, data?._id)}
                btnTextOne="Block"
                btnTextTwo="UnBlock"
                onClickBtnOne={() => blockUser(data)}
                onClickBtnTwo={() => unBlockUser(data)}
                onNavigateToProfile={() => ProfileUtils.navigateToProfile(data, navigate)}
              />

            </div>
          ))}
        </div>
      )}

      {loading && !followers.length && <div className="card-element" style={{ height: '350px' }}></div>}

      {!loading && !followers.length && (
        <div className="empty-page" data-testid="empty-page">
          You have no follower
        </div>
      )}


    </div>
  )
}

export default Follower