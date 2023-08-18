import ReactionAndCommentArea from '../reaction-comment-area/ReactionAndCommentArea';
import PropTypes from 'prop-types';
import ReactionsAndCommentsDisplay from '../reactions/reactions-comments-display/ReactionsAndCommentsDisplay';

const ReactionAndCommentSection = ({ post }) => {
    return (
        <div data-testid="comment-section">
            <ReactionsAndCommentsDisplay post={post} />
            <ReactionAndCommentArea post={post} />
        </div>
    );
};

ReactionAndCommentSection.propTypes = {
    post: PropTypes.object
};

export default ReactionAndCommentSection;