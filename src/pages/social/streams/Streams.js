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
import { getPosts } from "@redux/api/post";
import { getActiveElement } from "@testing-library/user-event/dist/utils";
import { orderBy, uniqBy } from 'lodash';
import useInfiniteScroll from "@hooks/useInfiniteScroll";

const Streams = () => {


  // ? app post

  let appPosts = useRef([])

  const fetchPostData = () => {
    let pageNum = currentPage
    console.log(currentPage, Math.round(reduxPosts.totalPostsCount / 3));
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
      console.log("FETCH NEW", currentPage, response.data.posts);
      if (response.data.posts.length > 0) {
        appPosts = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts, '_id');
        setPosts(allPosts);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("------------------------", error);
      Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
    }
  };
  // ? end app post

  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData)
  const [loading, setLoading] = useState(true);
  // ? all posts
  const reduxPosts = useSelector(state => state.posts)
  // ? end all posts
  // ? post
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [postsCnt, setPostsCnt] = useState(1);


  // ? end  post

  // ? sug users

  // ? end sug users
  useEffectOnce(() => {
    dispatch(fetchUpdSugUsers());

  });
  useEffect(() => {
    dispatch(getPosts())
  }, [dispatch]);
  useEffect(() => {

    setLoading(reduxPosts?.isLoading)
    setPosts(reduxPosts?.posts)
    setPostsCnt(reduxPosts?.totalPostsCount)
  }, [reduxPosts.posts]);
  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <PostForm />
          <Posts allPosts={posts} postsLoading={loading} userFollowing={[]} />
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
