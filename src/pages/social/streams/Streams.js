import "@pages/social/streams/Streams.scss";
// import Suggestions from "@components/suggestions/Suggestions";

// import PostForm from "@components/posts/post-form/PostForm";
import Posts from "@components/posts/Posts";
import Suggestions from "@components/suggestions/Suggestions";
import { useRef } from "react";
import useEffectOnce from "@hooks/useEffectOnce";
import { useDispatch } from "react-redux";
import { fetchUpdSugUsers } from "@root/redux/api/suggestion";
import { useEffect } from "react";
import PostForm from "@components/posts/post-form/PostForm";
import { PostUtils } from "@services/utils/post-utils.service";
import { Utils } from "@services/utils/utils.service";
import { useState } from "react";
import { postService } from "@services/api/post/post.service";

const Streams = () => {
  const [loading, setLoading] = useState(true);

  // ? post
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  // * get all post from server
  const getAllPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts(currentPage);
      if (response.data.posts.length > 0) {
        setPosts([...response.data.posts]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.updToastsNewEle(error.response.data.message, "error", dispatch);
    }
  };
  // ? end  post

  // ? sug users
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();
  useEffectOnce(() => {
    dispatch(fetchUpdSugUsers());
    getAllPosts();
  });
  // ? end sug users

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
