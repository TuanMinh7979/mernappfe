import Input from '@components/input/Input';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Utils } from '@services/utils/utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { socketService } from '@services/socket/socket.service';
import { postService } from '@services/api/post/post.service';

import "./CommentInputBox.scss"
const CommentInputBox = ({ post }) => {

    const { profile } = useSelector((state) => state.user);
    const [comment, setComment] = useState('');
    const commentInputRef = useRef(null);
    const dispatch = useDispatch();



    const submitComment = async (event) => {
        event.preventDefault();
        try {
            let newPost = { ...post };
            newPost.commentsCount += 1;
            const commentBody = {
                userTo: newPost?.userId,
                postId: newPost?._id,
                comment: comment.trim(),
                commentsCount: newPost.commentsCount,
                profilePicture: profile?.profilePicture
            };
            //   in post.socket
            socketService?.socket?.emit('comment', commentBody);
            await postService.createComment(commentBody);
            setComment('');
        } catch (error) {
            console.log(error);
            Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
        }
    };

    useEffect(() => {
        if (commentInputRef?.current) {
            commentInputRef.current.focus()
        }
    })

    return (
        <div className="comment-container" data-testid="comment-input">
            <form className="comment-form" onSubmit={submitComment}>
                <Input
                    ref={commentInputRef}
                    name="comment"
                    type="text"
                    value={comment}
                    labelText=""
                    className="comment-input"
                    placeholder="Write a comment..."
                    handleChange={(event) => setComment(event.target.value)}
                />
            </form>
        </div>
    );
};
CommentInputBox.propTypes = {
    post: PropTypes.object
};
export default CommentInputBox;
