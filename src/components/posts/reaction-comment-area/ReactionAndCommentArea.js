import React, { useEffect } from "react";
import { FaRegCommentAlt } from "react-icons/fa";
import "./ReactionAndCommentArea.scss";
import PropTypes from "prop-types";
import like from "@assets/reactions/like.png";
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
import { nextWednesday } from "date-fns";
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

  const [choosedReaction, setChoosedReaction] = useState("Default");
  const initLoggedUserChoosedReaction = useCallback(
    (postReactions) => {
      const userReaction = postReactions?.filter(
        (reaction) => reaction.postId === post._id
      )[0];
      // console.log("------------------", userReaction);
      const result = userReaction
        ? Utils.firstLetterUpperCase(userReaction.type)
        : "Default";
      console.log("sett----------------again, ", postReactions, userReaction);
      setChoosedReaction(result);
    },
    [post]
  );
  // ? END init reaction of this user in current post

  // ? onClick in reaction
  const onReactionClick = async (newReactionText) => {
    // console.log(newReactionText);
    try {

      updLoggedUserReactionsInRedux(
        newReactionText,
        choosedReaction,

        dispatch
      );

      let newPost = updateReactionsPropertyOfCurrentPost(
        newReactionText.toLowerCase(),
        choosedReaction.toLowerCase()
      );


      emitReactionToServer(newPost);

      // Data send to server
      const reactionDataToServer = {
        userTo: post?.userId,
        postId: post?._id,
        type: newReactionText,
        postReactions: post.reactions,
        profilePicture: profile?.profilePicture,
        previousReaction: newReactionText.toLowerCase() == choosedReaction.toLowerCase() || choosedReaction.toLowerCase() != "default"
          ? choosedReaction.toLowerCase()
          : "",
      };
      //  call api update

      if (newReactionText.toLowerCase() !== choosedReaction.toLowerCase()) {
        // add if exist
        console.log("ADD", reactionDataToServer, newReactionText.toLowerCase(), choosedReaction.toLowerCase());
        await postService.addReaction(reactionDataToServer);
      } else {

        if (newReactionText.toLowerCase() === reactionDataToServer.previousReaction.toLowerCase()) {
          console.log("RM", reactionDataToServer, newReactionText.toLowerCase(), choosedReaction.toLowerCase());
          await postService.removeReaction(
            post?._id,
            reactionDataToServer.previousReaction,
            post.reactions
          );
        } else {
          console.log("ADD2", reactionDataToServer, newReactionText.toLowerCase(), choosedReaction.toLowerCase());
          //  create new
          await postService.addReaction(reactionDataToServer);
        }
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

    if (newReactionText.toLowerCase() !== previousReactionText.toLowerCase()) {
      //   * if dont exist old reaction(in Reactions table )=> inc newReactText by 1
      const newReactions = { ...newPost.reactions };
      newReactions[newReactionText] += 1;
      newPost.reactions = { ...newReactions };
      if (previousReactionText !== "default" && newPost.reactions[previousReactionText] > 0) {
        const newReactions = { ...newPost.reactions };

        newReactions[previousReactionText] -= 1;
        if (newReactions[previousReactionText] < 0) {
          newReactions[previousReactionText] = 0
        }
        newPost.reactions = { ...newReactions };
      }
    } else {
      //  * if exist old reaction (in Reactions table ) and:
      //  * update current post.reations property:
      // * if post.reactions.happy>1=> to 0 (always)
      if (newPost.reactions[previousReactionText] > 0) {
        const newReactions = { ...newPost.reactions };

        newReactions[previousReactionText] -= 1;
        if (newReactions[previousReactionText] < 0) {
          newReactions[previousReactionText] = 0
        }
        newPost.reactions = { ...newReactions };
      }
      // * if new reaction 0=>1

    }
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
    const newReaction = {
      avatarColor: profile?.avatarColor,
      createdAt: `${new Date()}`,
      postId: post?._id,
      profilePicture: profile?.profilePicture,
      username: profile?.username,
      type: newReactionText,
    };


    console.log(previousReactionText.toLowerCase(), "><><<><><<>", newReactionText.toLowerCase());
    if (previousReactionText.toLowerCase() !== newReactionText.toLowerCase()) {
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
  // console.log("----------------", post);

  return (
    <div className="comment-area" data-testid="comment-area">
      <div className="like-icon reactions">
        <div className="likes-block" onClick={() => onReactionClick(choosedReaction)}>
          <div
            className={`likes-block-icons reaction-icon ${choosedReaction.toLowerCase()}`}
          >
            {choosedReaction && (
              <div
                className={`reaction-display ${choosedReaction.toLowerCase()} `}
                data-testid="selected-reaction"
              >
                <img
                  className="reaction-img"
                  src={reactionsMap[choosedReaction != "Default" ? choosedReaction.toLowerCase() : "like"]}
                  alt=""
                />
                <span>{choosedReaction}</span>
              </div>
            )}
            {/* {!choosedReaction &&
              <div className="reaction-display" data-testid="default-reaction">
                <img className="reaction-img" src="" alt="" /> <span>Like</span>
              </div>
            } */}
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
