import React, { useState } from "react";
import "./People.scss";
import { Utils } from "@services/utils/utils.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useRef } from "react";
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { FaCircle } from "react-icons/fa";
import Avatar from "@components/avatar/Avatar";
import CardElementButtons from "@components/card-element/CardElementButton";
import CardElementStats from "@components/card-element/CardElementStats";
import { useCallback } from "react";
import { uniqBy } from "lodash";
import { userService } from "@services/api/user/user.service";
import useEffectOnce from "@hooks/useEffectOnce";
import { ProfileUtils } from "@services/utils/profile-utils.service";
import { FollowersUtils } from "@services/utils/followers-utils.service";
import { followerService } from "@services/api/follow/follow.service";
import { useEffect } from "react";
import { chatService } from "@services/api/chat/chat.service";
import { socketService } from "@services/socket/socket.service";
import Skeleton from 'react-loading-skeleton';
import CardSkeleton from "@components/card-element/CardSkeleton";
const People = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [totalUserCnt, setTotalUserCnt] = useState(0);

  const [myIdols, setMyIdols] = useState([]);

  // ? init users
  //useCallback bc use it in useEffect
  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await userService.getAllUsers(currentPage);

      if (response.data.users.length > 0) {

        setUsers([...users, ...response.data.users])
      }
      setTotalUserCnt(response.data.totalUsers);
      setMyIdols(response.data.followees)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.displayError(error, dispatch);
    }
  }, [currentPage, dispatch]);

  // ? END init users
  // ? new user data when scroll

  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  useInfiniteScroll(bodyRef, bottomLineRef, fetchData);


  function fetchData() {

    let pageNum = currentPage;
    if (currentPage <= Math.ceil(totalUserCnt / Utils.POST_PAGE_SIZE) && myIdols.length < totalUserCnt && !loading) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllUsers();
    }
  }

  useEffectOnce(() => {
    getAllUsers();
  });

  //  END new user data when scroll
  //  follow and unfollow
  const followUser = async (user) => {
    try {
      await followerService.save(user?._id);

    } catch (error) {
      Utils.displayError(error, dispatch);
    }
  };

  const unFollowUser = async (idol) => {
    try {
      await followerService.delete(idol?._id, profile?._id);
    } catch (error) {
      Utils.displayError(error, dispatch);
    }
  };
  //  END follow and unfollow

  useEffect(() => {
    // users is list use now, myidols is user is folled by logged user
    FollowersUtils.socketIOFollowAndUnfollowInPeoplePage(users, myIdols, setMyIdols, setUsers)
    return () => {
      socketService.socket.off("added follow");
      socketService.socket.off("removed follow");

    };
  }, [myIdols, users])



  return (
    <div className="card-container" ref={bodyRef}>
      <div className="people">People</div>
      {users.length > 0 && (
        <div className="card-element scroll-3">
          {users.map((data) => (
            <div
              className="card-element-item"
              key={data?._id}
              data-testid="card-element-item"
            >
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
                  <span className="card-element-header-name">
                    {data?.username}
                  </span>
                </div>
              </div>

              <CardElementStats
                postsCount={data?.postsCount}
                followersCount={data?.followersCount}
                followingCount={data?.followingCount}
              />
              <CardElementButtons
                isChecked={Utils.checkIfUserIsFollowed(myIdols, data?._id)}
                btnTextOne="Follow"
                btnTextTwo="Unfollow"
                onClickBtnOne={() => followUser(data)}
                onClickBtnTwo={() => unFollowUser(data)}
                onNavigateToProfile={() =>
                  ProfileUtils.navigateToProfile(data, navigate)
                }
              />
            </div>
          ))}
        </div>
      )}

      {loading && !users.length && (
        <CardSkeleton />
      )}

      {!loading && !users.length && (
        <div className="empty-page" data-testid="empty-page">
          No user available
        </div>
      )}

      <div
        ref={bottomLineRef}
        style={{ marginBottom: "80px", height: "50px" }}
      ></div>
    </div>
  );
};

export default People;
