import React, { useCallback } from "react";
import "./TimeLine.scss";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useState } from "react";
import PostFormSkeleton from "@components/posts/post-form/PostFormSkeleton";
import PostSkeleton from "@components/posts/post/PostSkeleton";
import Post from "@components/posts/post/Post";
import { Utils } from "@services/utils/utils.service";
import { PostUtils } from "@services/utils/post-utils.service";
import { useParams } from "react-router-dom";
import PostForm from "@components/posts/post-form/PostForm";
import { followerService } from "@services/api/follow/follow.service";
import { useDispatch } from "react-redux";
import useEffectOnce from "@hooks/useEffectOnce";
import { useEffect } from "react";
import CountContainer from "./CountContainer";
import BasicInfo from "./BasicInfo";
import SocialLinks from "./SocialLinks";
import { postService } from "@services/api/post/post.service";
import { updateLoggedUserReactions } from "@redux/reducers/post/user-post-reaction";
import { newestAccessToken } from "@services/utils/tokenUtils";
const TimeLine = ({ userProfileData, loading }) => {
  const [editableInputs, setEditableInputs] = useState({
    quote: "",
    work: "",
    school: "",
    location: "",
  });
  const [editableSocialInputs, setEditableSocialInputs] = useState({
    instagram: "",
    twitter: "",
    facebook: "",
    youtube: "",
  });

  const dispatch = useDispatch();
  const { profile, token } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loggedUserIdols, setLoggedUserIdols] = useState([]);
  const { username } = useParams();
  useEffect(() => {
    if (userProfileData) {
      setPosts(userProfileData.posts);
      setUser(userProfileData.user);

      setEditableInputs({
        quote: userProfileData.user.quote,
        work: userProfileData.user.work,
        school: userProfileData.user.school,
        location: userProfileData.user.location,
      });
      setEditableSocialInputs(userProfileData.user?.social);
    }
  }, [userProfileData]);

  const getMyIdols = async () => {
    try {
      const response = await followerService.getLoggedUserIdols();
      setLoggedUserIdols(response.data.following);
    } catch (error) {
     Utils.displayError(error ,dispatch);
    }
  };

  useEffectOnce(() => {
    const fetchInitData = async () => {
      await newestAccessToken( dispatch);
      getMyIdols();
      getReactionsByUsername();
    };
    fetchInitData();
  });

  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
  }, [posts]);

  const getReactionsByUsername = async () => {
    try {
      const reactionsResponse = await postService.getReactionsByUsername(
        username
      );
      dispatch(updateLoggedUserReactions(reactionsResponse.data.reactions));
    } catch (error) {
     Utils.displayError(error ,dispatch);
    }
  };

  return (
    <div className="timeline-wrapper">
      <div className="timeline-wrapper-container">
        <div className="timeline-wrapper-container-side">
          <div className="timeline-wrapper-container-side-count">
            <CountContainer
              followingCount={user?.followingCount}
              followersCount={user?.followersCount}
              loading={loading}
            />

            <div className="side-content">
              <BasicInfo
                setEditableInputs={setEditableInputs}
                editableInputs={editableInputs}
                username={username}
                profile={profile}
                loading={loading}
              ></BasicInfo>
            </div>

            <div className="side-content social">
              <SocialLinks
                setEditableSocialInputs={setEditableSocialInputs}
                editableSocialInputs={editableSocialInputs}
                username={username}
                profile={profile}
                loading={loading}
              />
            </div>
          </div>
        </div>
        {/* loading post */}
        {!userProfileData && !posts.length && (
          <div className="timeline-wrapper-container-main">
            <div className="" style={{ marginBottom: "10px" }}>
              <PostFormSkeleton />
            </div>

            <>
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx}>
                  <PostSkeleton />
                </div>
              ))}
            </>
          </div>
        )}
        {/* show post */}
        {userProfileData && posts.length > 0 && (
          <div className="timeline-wrapper-container-main">
            {username === profile?.username && <PostForm />}

            {posts.map((post) => (
              <div key={post?._id} data-testid="posts-item">
                {(!Utils.checkIfUserIsBlocked(
                  profile?.blockedBy,
                  post?.userId
                ) ||
                  post?.userId === profile?._id) && (
                  <>
                    {PostUtils.checkPrivacy(post, profile, loggedUserIdols) && (
                      <>
                        <Post
                          post={post}
                          showIcons={username == profile?.username}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* no post to show */}
        {userProfileData && posts.length === 0 && (
          <div className="timeline-wrapper-container-main">
            <div className="empty-page">No post to show</div>
          </div>
        )}
      </div>
    </div>
  );
};
TimeLine.propTypes = {
  userProfileData: PropTypes.object,
  loading: PropTypes.bool,
};
export default TimeLine;
