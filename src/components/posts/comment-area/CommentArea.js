import React from 'react'
import { FaRegCommentAlt } from 'react-icons/fa';
import "./CommentArea.scss"
import PropTypes from 'prop-types';
import like from "@assets/reactions/like.png"
import Reactions from '../reactions/Reactions';
import { Utils } from '@services/utils/utils.service';
import { useDispatch } from 'react-redux';
const CommentArea = ({ post }) => {
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
                    <div className="like likes-block-icons reaction-icon">
                        <div className="reaction-display like"
                            data-testid="selected-reaction">
                            <img className="reaction-img" src={like} alt="" />
                            <span>Like</span>
                        </div>
                        {/* <div className="reaction-display" data-testid="default-reaction">
                    <img className="reaction-img" src="" alt="" /> <span>Like</span>
                  </div> */}
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
CommentArea.propTypes = {
    post: PropTypes.object
};

export default CommentArea;
