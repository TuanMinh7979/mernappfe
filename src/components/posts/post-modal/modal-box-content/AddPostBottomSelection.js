import React, { useRef } from "react";
import photo from "@assets/images/photo.png";
import gif from "@assets/images/gif.png";
import feeling from "@assets/images/feeling.png";
import Input from "@root/base-components/input/Input";
import useDetectOutsideClick from "@hooks/useDetectOutsideClick";
import Feelings from "@components/feelings/Feelings";
import { useDispatch, useSelector } from "react-redux";
import { ImageUtils } from "@services/utils/image-utils.service";
import PropTypes from "prop-types";
import { updatePost } from "@redux/reducers/post/post.reducer";
import { updateModalIsGifModalOpen } from "@redux/reducers/modal/modal.reducer";
const AddPostBottomSelection = ({onPostImageInputChange}) => {
  const dispatch = useDispatch();
  // Feeling
  const reduxModal = useSelector((state) => state.modal);

  const feelingsRef = useRef(null);
  const [isFeelingActive, setIsFeelingActive] = useDetectOutsideClick(
    feelingsRef,
    reduxModal.isFeelingOpen
  );
  // Input
  const fileInputRef = useRef(null);
  // Use for trigger file input
  const onFileInputClicked = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {isFeelingActive && (
        <div ref={feelingsRef}>
          <Feelings></Feelings>
        </div>
      )}
      <div className="modal-box-selection" data-testid="modal-box-selection">
        <ul className="post-form-list" data-testid="list-item">
          <li
            className="post-form-list-item image-select"
            onClick={onFileInputClicked}
          >
            <Input
              ref={fileInputRef}
              name="image"
              type="file"
              className="file-input"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = null;
                }
              }}
              handleChange={(event) => onPostImageInputChange(event)}
            />
            <img src={photo} alt="" /> Photo
          </li>
          <li
            className="post-form-list-item"
            onClick={() =>
              dispatch(updateModalIsGifModalOpen(!reduxModal.isGifModalOpen))
            }
          >
            <img src={gif} alt="" /> Gif
          </li>
          <li
            className="post-form-list-item"
            onClick={() => setIsFeelingActive(!isFeelingActive)}
          >
            <img src={feeling} alt="" /> Feeling
          </li>
        </ul>
      </div>
    </>
  );
};
AddPostBottomSelection.propTypes = {
  setSelectedPostImage: PropTypes.func,
};
export default AddPostBottomSelection;
