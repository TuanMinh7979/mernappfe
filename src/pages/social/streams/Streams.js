import "@pages/social/streams/Streams.scss";
// import Suggestions from "@components/suggestions/Suggestions";

// import PostForm from "@components/posts/post-form/PostForm";
import Posts from "@components/posts/Posts";
import Suggestions from "@components/suggestions/Suggestions";
import { useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchUpdSugUsers } from "@root/redux/api/suggestion";
import { useEffect } from "react";
import PostForm from "@components/posts/post-form/PostForm";
import { PostUtils } from "@services/utils/post-utils.service";
import { Utils } from "@services/utils/utils.service";
import { useState } from "react";
import { postService } from "@services/api/post/post.service";
import { uniqBy } from 'lodash';
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { followerService } from "@services/api/follow/follow.service";
import { socketService } from "@services/socket/socket.service";
import { updateLoggedUserReactions } from "@redux/reducers/post/user-post-reaction";
import PostSkeleton from "@components/posts/post/PostSkeleton";
import { FollowersUtils } from "@services/utils/followers-utils.service";

const Streams = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { profile } = useSelector((state) => state.user);
  const [loadingPost, setLoadingPost] = useState(false)
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([]);
  const [postsCnt, setPostsCnt] = useState(1);
  const [loggedUserIdols, setLoggedUserIdols] = useState([]);
  const validatePosts = (posts, loggedUserIdolsArr) => {
    let validPosts = posts.filter((el, idx) => {
      return (!Utils.checkIfUserIsBlocked(profile.blockedBy, el.userId) ||
        el?.userId === profile._id) && PostUtils.checkPrivacy(el, profile, loggedUserIdolsArr)
    })
    return [...validPosts]
  }

  // ? app post



  const fetchPostData = async () => {

    let pageNum = currentPage
    if (currentPage <= Math.ceil(postsCnt / Utils.POST_PAGE_SIZE) && posts.length < postsCnt && !loadingPost) {
      pageNum += 1
      try {
        setLoadingPost(true)
        const response = await postService.getAllPosts(pageNum);
        if (response.data.posts.length > 0) {
          let newAllPost = [...posts, ...response.data.posts];
          newAllPost = uniqBy([...newAllPost], '_id');
          setPosts(validatePosts([...newAllPost], loggedUserIdols));
        }

        setLoadingPost(false);

        setCurrentPage(pageNum)
      } catch (error) {

        setLoadingPost(false);

        Utils.displayError(error, dispatch);
      }
    }
  }


  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  const dispatch = useDispatch();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData)



  useEffect(() => {
    async function initFetch() {
      try {

        setLoading(true)
        dispatch(fetchUpdSugUsers());
        const res2 = await followerService.getLoggedUserFollowee();
        setLoggedUserIdols(res2.data.following);
        const res1 = await postService.getReactionsByUsername(profile?.username)
        dispatch(updateLoggedUserReactions(res1.data.reactions));
        const fetchPostRes = await postService.getAllPosts(1);

        let allPost = fetchPostRes.data.posts
        setPostsCnt(fetchPostRes.data.totalPosts)


        let validFirstPagePosts = validatePosts([...allPost], res2.data.following)

        // rare case
        if (validFirstPagePosts.length == 0) {
          if (currentPage <= Math.ceil(postsCnt / Utils.POST_PAGE_SIZE) && posts.length < postsCnt && !loadingPost) {
            let pageNum = currentPage + 1
            const res3 = await postService.getAllPosts(pageNum);
            let newAllPost = [...allPost, ...res3.data.posts];
            newAllPost = uniqBy([...newAllPost], '_id');
            setPosts(newAllPost)
            setCurrentPage(pageNum)

          }
        } else {
          setPosts(allPost);
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        Utils.displayError(error, dispatch);
      }
    }

    initFetch()
  }
    , []);



  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
    return () => {
      socketService.socket.off("add post");
      socketService.socket.off("update post");
      socketService.socket.off("delete post");
      socketService.socket.off("update reaction");
      socketService.socket.off("update comment");

    };
  }, [posts]);
  useEffect(() => {
    FollowersUtils.socketIOFollowAndUnfollowInStreamsPage(loggedUserIdols, setLoggedUserIdols)
    return () => {
      socketService.socket.off("added follow");
      socketService.socket.off("removed follow");
    };
  }, [loggedUserIdols])


  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <PostForm />
          {loading ? <>{[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index}>
              <PostSkeleton />
            </div>
          ))}</> :
            <Posts loadingPost={loadingPost} allPosts={posts} loggedUserIdolsProp={loggedUserIdols} />

          }

          <div
            ref={bottomLineRef}
            style={{ marginBottom: "150px", height: "50px" }}
          ></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Streams;
