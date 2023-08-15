import CommentArea from '../comment-area/CommentArea';
import PropTypes from 'prop-types';

const PostCommentSection = ({ post }) => {
    return (
        <div data-testid="comment-section">

            <CommentArea post={post} />
        </div>
    );
};

PostCommentSection.propTypes = {
    post: PropTypes.object
};

export default PostCommentSection;