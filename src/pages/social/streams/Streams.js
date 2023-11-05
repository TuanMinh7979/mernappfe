import "@pages/social/streams/Streams.scss";
// import Suggestions from "@components/suggestions/Suggestions";

// import PostForm from "@components/posts/post-form/PostForm";
import Posts from "@components/posts/Posts";
import Suggestions from "@components/suggestions/Suggestions";
import { useRef } from "react";
import useEffectOnce from "@hooks/useEffectOnce";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpdSugUsers } from "@root/redux/api/suggestion";
import { useEffect } from "react";
import PostForm from "@components/posts/post-form/PostForm";
import { PostUtils } from "@services/utils/post-utils.service";
import { Utils } from "@services/utils/utils.service";
import { useState } from "react";
import { postService } from "@services/api/post/post.service";
import { fetchPosts } from "@redux/api/post";

import { uniqBy } from 'lodash';
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { followerService } from "@services/api/follow/follow.service";
import { socketService } from "@services/socket/socket.service";
import { updateLoggedUserReactions } from "@redux/reducers/post/user-post-reaction";

const Streams = () => {
  const { profile } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false)

  // ? app post
  let appPosts = useRef([])
  const fetchPostData = () => {
    let pageNum = currentPage

    if (currentPage <= Math.round(reduxPosts.totalPostsCount / 3)) {
      pageNum += 1
      setCurrentPage(pageNum)
      getPostByPage()
    }
  }

  const getPostByPage = async () => {
    try {
      setLoading(true)
      const response = await postService.getAllPosts(currentPage);

      if (response.data.posts.length > 0) {
        appPosts = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts, '_id');
        setPosts(allPosts);
      }
      setLoading(false);
    } catch (error) {

      setLoading(false);
      Utils.displayError(error, dispatch);
    }
  };

  const [loggedUserIdols, setLoggedUserIdols] = useState([]);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData)


  // ? all posts
  const reduxPosts = useSelector(state => state.posts)
  // ? end all posts


  // ? post
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [postsCnt, setPostsCnt] = useState(1);
  // ? end  post
  useEffect(() => {
    async function initFetch() {
      try {
        setLoading(true)
        dispatch(fetchUpdSugUsers());
        const response = await followerService.getLoggedUserFollowee();
        setLoggedUserIdols(response.data.following);
        const rs = await postService.getReactionsByUsername(profile?.username)
        dispatch(updateLoggedUserReactions(rs.data.reactions));

        dispatch(fetchPosts())
      } catch (error) {
        setLoading(false);
        Utils.displayError(error, dispatch);
      }
    }

    initFetch()
  }

    , []);

  useEffect(() => {
    setPosts(reduxPosts?.posts)
    setPostsCnt(reduxPosts?.totalPostsCount)
  }, [reduxPosts.posts]);



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

  // ? get all reactions of current user



  // ? END get all reactions of current user


  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <PostForm />
          <Posts allPosts={posts} loggedUserIdolsProp={loggedUserIdols} />
          <div
            ref={bottomLineRef}
            style={{ marginBottom: "50px", height: "50px" }}
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
