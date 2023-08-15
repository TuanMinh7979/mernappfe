import React, { useEffect } from 'react'
import { FaRegCommentAlt } from 'react-icons/fa';
import "./ReactionAndCommentArea.scss"
import PropTypes from 'prop-types';
import like from "@assets/reactions/like.png"
import Reactions from '../reactions/Reactions';
import { Utils } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useCallback } from 'react';
import { reactionsMap } from '@services/utils/static.data';
const ReactionAndCommentArea = ({ post }) => {
    const { reactions } = useSelector((state) => state.userPostReaction)
    const [choosedReaction, setChoosedReaction] = useState('Like');

    const initLoggedUserChoosedReaction = useCallback(
        (postReactions) => {
            const userReaction = postReactions?.filter((reaction) => reaction.postId === post._id)[0];
            const result = userReaction ? Utils.firstLetterUpperCase(userReaction.type) : 'Like';
            setChoosedReaction(result);
        },
        [post]
    );

    useEffect(() => {
        initLoggedUserChoosedReaction(reactions)
    }, [initLoggedUserChoosedReaction, reactions])

    const dispatch = useDispatch()
    const onReactionClick = async (reaction) => {
        try {
            console.log("ADD REACTYion");
        } catch (error) {
            Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
        }
    };
    return (
        <div className="comment-area" data-testid="comment-area">
            <div className="like-icon reactions">
                <div className="likes-block">
                    <div className={`likes-block-icons reaction-icon ${choosedReaction.toLowerCase()}`}>
                        {choosedReaction &&
                            <div className={`reaction-display ${choosedReaction.toLowerCase()} `} data-testid="selected-reaction">

                                <img className="reaction-img" src={reactionsMap[choosedReaction.toLowerCase()]} alt="" />
                                <span>{choosedReaction}</span>
                            </div>
                        }
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
            <div className="comment-block" >
                <span className="comments-text">
                    <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
                </span>
            </div>
        </div>
    )
}
ReactionAndCommentArea.propTypes = {
    post: PropTypes.object
};

export default ReactionAndCommentArea;
