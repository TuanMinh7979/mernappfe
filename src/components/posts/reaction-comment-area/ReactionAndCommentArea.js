import React, { useEffect } from "react";
import { FaRegCommentAlt } from "react-icons/fa";
import "./ReactionAndCommentArea.scss";
import PropTypes from "prop-types";

import Reactions from "../reactions/Reactions";
import { Utils } from "@services/utils/utils.service";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useCallback } from "react";
import { reactionsMap } from "@services/utils/static.data";
import { postService } from "@services/api/post/post.service";
import { socketService } from "@services/socket/socket.service";
import { updateLoggedUserReactions } from "@redux/reducers/post/user-post-reaction";

import { emptyPost, updatePost } from "@redux/reducers/post/post.reducer";

const ReactionAndCommentArea = ({ post }) => {
  const dispatch = useDispatch();
  // ? comment
  const { _id } = useSelector(state => state.post)

  const toggleCommentInput = () => {
    if (!_id || _id !== post?._id) {
      dispatch(updatePost({ ...post }))
    } else {
      dispatch(emptyPost())
    }
  }
  // comment

  const { profile } = useSelector((state) => state.user);
  // ? init reaction of this user in current post
  const loggedUserReactions = useSelector(
    (state) => state.userPostReaction.reactions
  );

  const [choosedReaction, setChoosedReaction] = useState("default");
  const initLoggedUserChoosedReaction = useCallback(
    (postReactions) => {
      const userReaction = postReactions?.filter(
        (reaction) => reaction.postId === post._id
      )[0];

      const result = userReaction
        ? userReaction.type
        : "default";
      setChoosedReaction(result);
    },
    [post]
  );
  // ? END init reaction of this user in current post

  // ? onClick in reaction
  const onReactionClick = async (newReactionText) => {
    let newReactionTextLower = newReactionText.toLowerCase()
    let choosedReactionLower = choosedReaction.toLowerCase()
    try {

      updLoggedUserReactionsInRedux(
        newReactionTextLower,
        choosedReactionLower,

        dispatch
      );

      let newPost = updateReactionsPropertyOfCurrentPost(
        newReactionTextLower,
        choosedReactionLower
      );


      emitReactionToServer(newPost);

      // Data send to server
      // if !previousReaction -> add new else -> remove previous
      const reactionDataToServer = {
        userTo: post?.userId,
        postId: post?._id,
        type: newReactionText,
        postReactions: post.reactions,
        profilePicture: profile?.profilePicture,
        previousReaction: newReactionTextLower == choosedReactionLower && choosedReactionLower != "default"
          ? ""
          : choosedReactionLower,
      };
      //  call api update
      if (newReactionTextLower !== choosedReactionLower) {
        // if newReactTextLower !== choosedReactionLower -> if previousReaction-> server update +- else update +
        await postService.addReaction(reactionDataToServer);
      } else {
        // if newReactTextLower !== choosedReactionLower ->  remove reaction and update post
        await postService.removeReaction(
          post?._id,
          choosedReactionLower,
          post.reactions
        );

      }
    } catch (error) {

      Utils.displayError(error, dispatch);
    }
  };
  const updateReactionsPropertyOfCurrentPost = (
    newReactionText,
    previousReactionText
  ) => {


    let newPost = { ...post };

    let newReactions = { ...newPost.reactions };

    if (previousReactionText != "default") {
      newReactions[previousReactionText] -= 1;
      if (newReactions[previousReactionText] < 0) {
        newReactions[previousReactionText] = 0
      }
    }

    if (newReactionText !== previousReactionText) {
      //   * if dont exist old reaction(in Reactions table )=> inc newReactText by 1

      newReactions[newReactionText] += 1;
    }
    newPost.reactions = { ...newReactions };

    return newPost;
  };

  const updLoggedUserReactionsInRedux = (
    newReactionText,
    previousReactionText,

    dispatch
  ) => {
    let restLoggedUserReactions = loggedUserReactions.filter(
      (el) => el?.postId !== post?._id
    );

    // remove old reaction
    const newReaction = {
      avatarColor: profile?.avatarColor,
      createdAt: `${new Date()}`,
      postId: post?._id,
      profilePicture: profile?.profilePicture,
      username: profile?.username,
      type: newReactionText,
    };



    if (previousReactionText !== newReactionText) {
      // if adding new reaction
      restLoggedUserReactions.push(newReaction);
    }



    dispatch(updateLoggedUserReactions(restLoggedUserReactions));
    return;
  };

  const emitReactionToServer = (post) => {
    const socketReactionData = {
      postId: post._id,
      postReactions: post.reactions,
    };
    socketService?.socket?.emit("reaction", socketReactionData);
  };

  // ? END onClick in reaction

  useEffect(() => {
    initLoggedUserChoosedReaction(loggedUserReactions);
  }, [initLoggedUserChoosedReaction, loggedUserReactions]);


  return (
    <div className="comment-area" data-testid="comment-area">
      <div className="like-icon reactions">
        <div className="likes-block" onClick={() => onReactionClick(choosedReaction != "default" ? choosedReaction : "like")}>
          <div
            className={`likes-block-icons reaction-icon ${choosedReaction}`}
          >
            {choosedReaction && (
              <div
                className={`reaction-display ${choosedReaction} `}
                data-testid="selected-reaction"
              >
                <img
                  className="reaction-img"
                  src={reactionsMap[choosedReaction]}
                  alt=""
                />
                <span>{choosedReaction != "default" ? choosedReaction : "like"}</span>
              </div>
            )}

          </div>
        </div>
        <div className="reactions-container app-reactions">
          <Reactions handleClick={onReactionClick}></Reactions>
        </div>
      </div>
      <div className="comment-block" onClick={toggleCommentInput}>
        <span className="comments-text">
          <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
        </span>
      </div>
    </div>
  );
};
ReactionAndCommentArea.propTypes = {
  post: PropTypes.object,
};

export default ReactionAndCommentArea;
