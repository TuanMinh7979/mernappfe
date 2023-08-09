import "@pages/social/streams/Streams.scss";
// import Suggestions from "@components/suggestions/Suggestions";

// import PostForm from "@components/posts/post-form/PostForm";
// import Posts from "@components/posts/Posts";
import Suggestions from "@components/suggestions/Suggestions";
import { useRef } from "react";
import useEffectOnce from "@hooks/useEffectOnce";
import { useDispatch } from "react-redux";
import { getUserSuggestions } from "@root/redux/api/suggestion";
import { useEffect } from "react";
const Streams = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();
  useEffectOnce(() => {
    dispatch(getUserSuggestions());
  });



  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          {/* <PostForm /> */}
          {/* <Posts
            allPosts={posts}
            postsLoading={loading}
            userFollowing={following}
          />  */}

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
