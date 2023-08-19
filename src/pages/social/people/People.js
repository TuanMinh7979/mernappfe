import React, { useState } from 'react'
import "./People.scss"
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
const People = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);


  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [totalUsersCount, setTotalUsersCount] = useState(0);





  // ? new user data when scroll 
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  useInfiniteScroll(bodyRef, bottomLineRef, fetchData);
  const PAGE_SIZE = 12;
  function fetchData() {

  }
  // ? END new user data when scroll 
  return (
    <div className="card-container" ref={bodyRef}>
      <div className="people">People</div>
      {users.length > 0 && (
        <div className="card-element">
          {users.map((data) => (
            <div className="card-element-item" key={data?._id} data-testid="card-element-item">
              {Utils.checkIfUserIsOnline(data?.username, onlineUsers) && (
                <div className="card-element-item-indicator">
                  <FaCircle className="online-indicator" />
                </div>
              )}
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
                // isChecked={Utils.checkIfUserIsFollowed(following, data?._id)}
                btnTextOne="Follow"
                btnTextTwo="Unfollow"
              //   onClickBtnOne={() => followUser(data)}
              //   onClickBtnTwo={() => unFollowUser(data)}
              //   onNavigateToProfile={() => ProfileUtils.navigateToProfile(data, navigate)}
              />

            </div>
          ))}
        </div>
      )}

      {loading && !users.length && <div className="card-element" style={{ height: '350px' }}></div>}

      {!loading && !users.length && (
        <div className="empty-page" data-testid="empty-page">
          No user available
        </div>
      )}

      <div ref={bottomLineRef} style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  )
}

export default People