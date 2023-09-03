import PropTypes from 'prop-types';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

import './ImageModal.scss';

const ImageModal = ({ image, onCancel, onClickLeft, onClickRight, showArrow, isLastItemRight, isLastItemLeft }) => {
    return (
        <div className="image-modal-container" data-testid="image-modal">
            <div className="image-modal-icon" onClick={onCancel}>
                <FaTimes />
            </div>
            {showArrow && (
                <div
                    className={'image-modal-icon-left'}
                    onClick={onClickLeft}
                    style={{ pointerEvents: `${isLastItemLeft ? 'none' : 'all'}`, color: `${isLastItemLeft ? '#bdbdbd' : ''}` }}
                >
                    <FaArrowLeft />
                </div>
            )}
            <div className="image-modal-overlay">
                <div className="image-modal-box">
                    <img className="modal-image" alt="" src={`${image}`} />
                </div>
            </div>
            {showArrow && (
                <div
                    className={'image-modal-icon-right'}
                    onClick={onClickRight}
                    style={{ pointerEvents: `${isLastItemRight ? 'none' : 'all'}`, color: `${isLastItemRight ? '#bdbdbd' : ''}` }}
                >
                    <FaArrowRight />
                </div>
            )}
        </div>
    );
};

ImageModal.propTypes = {
    image: PropTypes.string,
    onCancel: PropTypes.func,
    onClickRight: PropTypes.func,
    onClickLeft: PropTypes.func,
    showArrow: PropTypes.bool,
    isLastItemRight: PropTypes.bool,
    isLastItemLeft: PropTypes.bool
};

export default ImageModal;
