import PropTypes from "prop-types";

import Post from "@components/posts/post/Post";
import "./Post.scss";

import { useSelector } from "react-redux";
import { Utils } from "@services/utils/utils.service";
import { PostUtils } from "@services/utils/post-utils.service";

const Posts = ({ allPosts, loggedUserIdolsProp, loadingPost }) => {

  const { profile } = useSelector((state) => state.user);


  return (
    <div className="posts-container" style={{ minHeight: "100vh" }} data-testid="posts">


      {
        allPosts.length > 0 &&
        allPosts.map((post) => (
          <div key={post?._id} data-testid="posts-item">

            {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) ||
              post?.userId === profile?._id) && (
                <>
                  {PostUtils.checkPrivacy(post, profile, loggedUserIdolsProp) && (
                    <>
                      <Post post={post} showIcons={post.userId == profile._id} />
                    </>
                  )}
                </>
              )}

          </div>


        ))

      }

      {loadingPost && <h2 style={{ textAlign: "center" }}>Loading...</h2>}
    </div>
  );
};
Posts.propTypes = {
  allPosts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool,
};
export default Posts;
