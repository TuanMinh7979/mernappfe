import React, { useState } from 'react'
import "../people/People.scss"
import { Utils } from '@services/utils/utils.service'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import Avatar from '@components/avatar/Avatar'
import CardElementButtons from '@components/card-element/CardElementButton'
import CardElementStats from '@components/card-element/CardElementStats'
import { useCallback } from 'react'

import { ProfileUtils } from '@services/utils/profile-utils.service'
import { FollowersUtils } from '@services/utils/followers-utils.service'
import { socketService } from '@services/socket/socket.service'
import { followerService } from '@services/api/follow/follow.service'
import { useEffect } from 'react'
import useEffectOnce from '@hooks/useEffectOnce'
const Follower = () => {
  const { profile } = useSelector((state) => state.user);
  const [followers, setFollowers] = useState([]);
  const [myblockedUsers, setMyBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  init follower

  const getMyFans = useCallback(async () => {
    try {
      if (profile) {
        const response = await followerService.getByUser(profile?._id);
        setFollowers(response.data.followers);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Utils.displayError(error, dispatch);
    }
  }, [profile, dispatch]);

  //  END init followers
  //  new user data when scroll 


  useEffectOnce(() => {
    getMyFans();
  });

  useEffect(() => {
    setMyBlockedUsers(profile.blocked)
  }, [profile])
  useEffect(() => {
    FollowersUtils.socketIOBlockAndUnblock(profile, setMyBlockedUsers, dispatch)

  }, [dispatch, profile]);

  //  END new user data when scroll 


  //  block and unblock
  const blockUser = async (toBlockUser) => {
    try {
      // hdl in sockets/user.ts
      //   TODO: change to client=>service=>socket to clients
      socketService?.socket?.emit('block user', {
        blockedUser: toBlockUser._id, blockedBy: profile._id
      })
      //  service

      await followerService.blockUser(toBlockUser?._id);
    } catch (error) {
      Utils.displayError(error, dispatch);
    }
  };

  const unBlockUser = async (user) => {
    try {
      socketService?.socket?.emit('unblock user', {
        blockedUser: user._id, blockedBy: profile._id
      })

      await followerService.unblockUser(user?._id);
    } catch (error) {
      Utils.displayError(error, dispatch);
    }
  };
  //  END block and unBlock
  return (
    <div className="card-container" >
      <div className="followers">People</div>
      {followers.length > 0 && (
        <div className="card-element scroll-3">
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