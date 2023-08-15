import ReactionAndCommentArea from '../comment-area/ReactionAndCommentArea';
import PropTypes from 'prop-types';
import ReactionsAndCommentsDisplay from '../reactions/reactions-comments-display/ReactionsAndCommentsDisplay';

const PostCommentSection = ({ post }) => {
    return (
        <div data-testid="comment-section">
            <ReactionsAndCommentsDisplay post={post} />
            <ReactionAndCommentArea post={post} />
        </div>
    );
};

PostCommentSection.propTypes = {
    post: PropTypes.object
};

export default PostCommentSection;