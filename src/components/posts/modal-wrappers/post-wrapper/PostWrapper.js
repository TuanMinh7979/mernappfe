import "./PostWrapper.scss"
import React from 'react'
import PropTypes from 'prop-types';
const PostWrapper = ({ children }) => {
    return (
        <div className="modal-wrapper" data-testid="post-modal">
            {children[1]}
            {children[2]}
            {children[3]}
            {/* background layout */}
            <div className="modal-bg"></div>
            {/* background layout */}
        </div>
    )
}
PostWrapper.propTypes = {
    children: PropTypes.node.isRequired

}
export default PostWrapper