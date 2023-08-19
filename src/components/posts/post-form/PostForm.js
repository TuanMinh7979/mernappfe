import Avatar from "@components/avatar/Avatar";
import Input from "@components/input/Input";
import { ImageUtils } from "@services/utils/image-utils.service";
import { updatePost } from "@redux/reducers/post/post.reducer";
import photo from "@assets/images/photo.png";
import gif from "@assets/images/gif.png";
import feeling from "@assets/images/feeling.png";
import video from "@assets/images/video.png";
import "@components/posts/post-form/PostForm.scss";
import {
  updateModalIsFeelingOpen,
  updateModalIsGifModalOpen,
} from "@redux/reducers/modal/modal.reducer";
import { useSelector } from "react-redux";
import "./PostForm.scss";
import { useDispatch } from "react-redux";
import { openModal } from "@redux/reducers/modal/modal.reducer";
import AddPost from "../post-modal/post-add/AddPost";
import { useRef } from "react";

import { useState } from "react";
import EditPost from "../post-modal/post-edit/EditPost";
const PostForm = () => {
  const [globalChoosedPostImage, setGlobalChoosedPostImage] = useState(null);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const { type, isOpen, isGifModalOpen, isFeelingSelectOpen } = useSelector(
    (state) => state.modal
  );
  const openPostModal = () => {
    dispatch(openModal({ type: "add" }));
  };

  //  For photo click
  const fileInputRef = useRef(null);
  const onFileInputClicked = () => {
    dispatch(openModal({ type: "add" }));
    fileInputRef.current.click();
  };
  const onPostImageInputChange = (event) => {
    const file = event.target.files[0];
    const errMessage=ImageUtils.checkFile(file);
    if(errMessage){
      return alert(errMessage)
    }
    setGlobalChoosedPostImage(file);
    // ! TO REDUX
    dispatch(
      updatePost({
        image: URL.createObjectURL(file),
      })
    );
  };
  //  For Gif click
  const openGifModal = () => {
    dispatch(openModal({ type: "add" }));
    dispatch(updateModalIsGifModalOpen(!isGifModalOpen));
  };

  // for feeling click
  const openModalAndFeeling = () => {
    dispatch(openModal({ type: "add" }));
    dispatch(updateModalIsFeelingOpen(true));
  };

  return (
    <>
      <div className="post-form" data-testid="post-form">
        <div className="post-form-row">
          <div className="post-form-header">
            <h4 className="post-form-title">Create Post</h4>
          </div>
          <div className="post-form-body">
            <div
              className="post-form-input-body"
              data-testid="input-body"
              onClick={() => openPostModal()}
            >
              <Avatar
                name={profile?.username}
                bgColor={profile?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={profile?.profilePicture}
              />
              <div
                className="post-form-input"
                data-placeholder="Write something here..."
              ></div>
            </div>
            <hr />
            {/* //*bottom preview */}
            <ul className="post-form-list" data-testid="list-item">
              <li
                className="post-form-list-item image-select"
                onClick={() => onFileInputClicked()}
              >
                <Input
                  ref={fileInputRef}
                  name="image"
                  type="file"
                  className="file-input"
                  handleChange={(event) => onPostImageInputChange(event)}
                />
                <img src={photo} alt="" /> Photo
              </li>
              <li
                className="post-form-list-item"
                onClick={() => openGifModal()}
              >
                <img src={gif} alt="" /> Gif
              </li>
              <li
                className="post-form-list-item"
                onClick={() => openModalAndFeeling()}
              >
                <img src={feeling} alt="" /> Feeling
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isOpen && type === "add" && (
        <AddPost
        globalChoosedPostImage={globalChoosedPostImage}
        onPostImageInputChange ={onPostImageInputChange}
        
        />
      )}
      {isOpen && type === "edit" && (
        <EditPost
     
        
        />
      )}
    </>
  );
};
export default PostForm;
