import React, { useRef } from 'react'
import photo from '@assets/images/photo.png';
import gif from '@assets/images/gif.png';
import feeling from '@assets/images/feeling.png';
import Input from '@components/input/Input';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import Feelings from '@components/feelings/Feelings';
import { useDispatch, useSelector } from 'react-redux';
import { ImageUtils } from '@services/utils/image.-utils.service';
import PropTypes from 'prop-types';
const ModalBoxSelection = ({ setSelectedPostImage }) => {
  const dispatch = useDispatch()
  // feeling
  const { feelingsIsOpen } = useSelector((state) => state.modal)
  const { post } = useSelector((state) => state.post)
  const feelingsRef = useRef(null)
  const [isFeelingActive, setIsFeelingActive] = useDetectOutsideClick(feelingsRef, feelingsIsOpen)
  // feeling
  const fileInputRef = useRef(null)
  // *Params:
  // *Res:
  // use for trigger file input
  const onFileInputClicked = () => {
    fileInputRef.current.click();

  }
  const onFileInputChange = (event) => {
    ImageUtils.addFileToRedux(event, post, setSelectedPostImage, dispatch)
  }
  return (
    <>
      {isFeelingActive && (
        <div ref={feelingsRef}>
          <Feelings></Feelings>
        </div>
      )}
      <div className="modal-box-selection" data-testid="modal-box-selection">
        <ul className="post-form-list" data-testid="list-item">
          <li className="post-form-list-item image-select"
            onClick={onFileInputClicked}
          >
            <Input
              ref={fileInputRef}
              name="image"
              type="file"
              className="file-input"
              onClick={(event) => {
            
                if (fileInputRef.current) {
                  fileInputRef.current.value = null
                }
              }}
              handleChange={(event)=>onFileInputChange(event)}

            />
            <img src={photo} alt="" /> Photo
          </li>
          <li className="post-form-list-item"

          >
            <img src={gif} alt="" /> Gif
          </li>
          <li className="post-form-list-item"
            onClick={() => setIsFeelingActive(!isFeelingActive)}
          >
            <img src={feeling} alt="" /> Feeling
          </li>

        </ul>
      </div>
    </>
  )
}
ModalBoxSelection.propTypes = {
  setSelectedPostImage: PropTypes.func,

};
export default ModalBoxSelection