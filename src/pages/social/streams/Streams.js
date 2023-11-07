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

import Spinner from "@root/base-components/spinner/Spinner";
import { uniqBy } from 'lodash';
import useInfiniteScroll from "@hooks/useInfiniteScroll";
import { followerService } from "@services/api/follow/follow.service";
import { socketService } from "@services/socket/socket.service";
import { updateLoggedUserReactions } from "@redux/reducers/post/user-post-reaction";
import { useSearchParams } from "react-router-dom";

const Streams = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { profile } = useSelector((state) => state.user);
  const [loadingPost, setLoadingPost] = useState(false)
  const [posts, setPosts] = useState([]);
  const [postsCnt, setPostsCnt] = useState(1);
  // ? app post

  const fetchPostData = async () => {
    console.log("postsCnt", postsCnt);
    let pageNum = currentPage
    if (currentPage <= Math.ceil(postsCnt / 8)) {
      pageNum += 1
      // getPostByPage()
      try {
        setLoadingPost(true)
        const response = await postService.getAllPosts(pageNum);
        if (response.data.posts.length > 0) {
          let newAllPost = [...posts, ...response.data.posts];
          let abc = uniqBy([...newAllPost], '_id');
          setPosts([...abc]);
        }
        setLoadingPost(false);
        setCurrentPage(pageNum)
      } catch (error) {

        setLoadingPost(false);
        Utils.displayError(error, dispatch);
      }


    }
  }

  const [loggedUserIdols, setLoggedUserIdols] = useState([]);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  const dispatch = useDispatch();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData)



  useEffect(() => {
    async function initFetch() {
      try {
        // setLoadingPost(true)
        dispatch(fetchUpdSugUsers());
        const response = await followerService.getLoggedUserFollowee();
        setLoggedUserIdols(response.data.following);
        const rs = await postService.getReactionsByUsername(profile?.username)
        dispatch(updateLoggedUserReactions(rs.data.reactions));

        const fetchPostRes = await postService.getAllPosts(1);
        const { posts, totalPosts } = fetchPostRes.data
        setPosts([...posts])
        setPostsCnt(totalPosts)
        // setLoadingPost(false)

      } catch (error) {
        // setLoadingPost(false);
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

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <PostForm />
          <Posts loadingPost={loadingPost} allPosts={posts} loggedUserIdolsProp={loggedUserIdols} />


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
