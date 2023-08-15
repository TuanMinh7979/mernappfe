import PropTypes from "prop-types";

import Post from "@components/posts/post/Post";
import "./Post.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Utils } from "@services/utils/utils.service";
import { useEffect } from "react";
import { PostUtils } from "@services/utils/post-utils.service";
const Posts = ({ allPosts, loggedUserIdolsProp, postsLoading }) => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loggedUserIdols, setLoggedUserIdols] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPosts(allPosts);
    setLoggedUserIdols(loggedUserIdolsProp);
    setLoading(postsLoading);
  }, [allPosts, loggedUserIdolsProp, postsLoading]);

  return (
    <div className="posts-container" data-testid="posts">
      {!loading &&
        posts.length > 0 &&
        posts.map((post) => (
          <div key={post?._id} data-testid="posts-item">
            {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) ||
              post?.userId === profile?._id) && (
              <>
                {PostUtils.checkPrivacy(post, profile, loggedUserIdols) && (
                  <>
                    <Post post={post} showIcons={false} />
                  </>
                )}
              </>
            )}
          </div>
        ))}

      {/* {loading &&
        !posts.length &&
        [1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index}>
            <PostSkeleton />
          </div>
        ))} */}
    </div>
  );
};
Posts.propTypes = {
  allPosts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool,
};
export default Posts;
