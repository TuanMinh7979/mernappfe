import CommentArea from '../comment-area/CommentArea';
import PropTypes from 'prop-types';
import ReactionsAndCommentDisplay from '../reactions/reactions-comments-display/ReactionsAndCommentsDisplay';

const PostCommentSection = ({ post }) => {
    return (
        <div data-testid="comment-section">
            <ReactionsAndCommentDisplay post={post} />
            <CommentArea post={post} />
        </div>
    );
};

PostCommentSection.propTypes = {
    post: PropTypes.object
};

export default PostCommentSection;