import PostWrapper from "@components/posts/modal-wrappers/post-wrapper/PostWrapper";
import { setDate } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./EditPost.scss";
import AddPostHeader from "../modal-box-content/AddPostHeader";
import { FaTimes } from "react-icons/fa";
import { bgColors } from "@services/utils/static.data";
import { ImageUtils } from "@services/utils/image-utils.service";
import { postService } from "@services/api/post/post.service";
import Button from "@components/button/Button";
import { updatePost } from "@redux/reducers/post/post.reducer";
import { useRef } from "react";
import {
    closeModal,

    updateModalIsGifModalOpen,
} from "@redux/reducers/modal/modal.reducer";
import { emptyPost } from "@redux/reducers/post/post.reducer";
import AddPostBottomSelection from "../modal-box-content/AddPostBottomSelection";
import { FaArrowLeft } from "react-icons/fa";
import Giphy from "@components/giphy/Giphy";
import { Utils } from "@services/utils/utils.service";
import Spinner from "@components/spinner/Spinner";

import { privacyList } from "@services/utils/static.data";
const EditPost = () => {

    // ? image
    const [globalChoosedPostImage, setGlobalChoosedPostImage] = useState(null);
    const onPostImageInputChange = (event) => {
        const file = event.target.files[0];
        const errMessage = ImageUtils.checkFile(file);
        if (errMessage) {
            alert(errMessage)
            return
        }
        setGlobalChoosedPostImage(file);
        // ! TO REDUX

        dispatch(
            updatePost({
                image: URL.createObjectURL(file),
                gifUrl: ''
            })
        );
    };
    // ? image

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const reduxModal = useSelector((state) => state.modal);
    const reduxPost = useSelector((state) => state.post);

    // ? use for create new post (only read)
    const { token } = useSelector((state) => state.user);
    // ? use for create new post

    // * Limit character
    const [allowedNumberOfCharacters] = useState("100/100");
    // * Disable add post button
    const [disabled, setDisabled] = useState(true);
    // * Data for new post:
    const [postData, setPostData] = useState({
        post: reduxPost.post ? reduxPost.post : "",
        bgColor: reduxPost.bgColor ? reduxPost.bgColor : "#ffffff",
        privacy: reduxPost.privacy ? reduxPost.privacy : "",

        gifUrl: reduxPost.gifUrl ? reduxPost.gifUrl : "",
        profilePicture: reduxPost.profilePicture ? reduxPost.profilePicture : "",
        image: reduxPost.image,
        feelings: reduxPost.feelings?.name,

        // for update
        imgId: reduxPost.imgId,
        imgVersion: reduxPost.imgVersion,

    });
    useEffect(() => {
        setDisabled(postData.post.length <= 0 && !reduxPost.image && !reduxPost.gifUrl);
    }, [reduxPost.image, postData.post, reduxPost.gifUrl])
    //*  Background color for post (for text background):
    // * For color background

    //  * Loading



    // select post banckground color
    const changePostDataBgColor = (bgColor) => {
        // TODO : Dont do this
        // postData.bgColor = bgColor;
        // setPostData(postData)
        // TODO : Do this mean: postData= new object(not current old object)
        setPostData({ ...postData, bgColor });
    };

    const counterRef = useRef(null);
    // TODO: move to env
    const max_char_cnt = 100;
    const onInputPostText = (event) => {
        const text = event.currentTarget.textContent;
        const currentTextLength = text.length;
        const counter = max_char_cnt - currentTextLength;
        counterRef.current.textContent = `${counter}/100`;

        //! TO STATE
        setPostData({ ...postData, post: text });
    };

    //  TODO: fix when client copy and paste
    const onKeyDownPostText = (event) => {
        const currentTextLength = event.target.textContent.length;
        if (currentTextLength >= max_char_cnt && event.keyCode !== 8) {
            event.preventDefault();
        }
    };

    const closePostModal = () => {
        dispatch(closeModal());
        dispatch(emptyPost());
    };

    const postAndImagePostInputRef = useRef(null);
    // ?
    const postNoImagePostInputRef = useRef(null);
    const clearPostModalImage = () => {
        dispatch(
            updatePost({
                gifUrl: "",
                image: "",
                imgId: "",
                imgVersion: "",
                video: "",
                videoId: "",
                videoVersion: "",
            })
        );
    };
    // ?

    const updatePostToServer = async () => {
        setLoading(true);

        try {
            //  postData.post is always newest and reduxPost.post is not change
            //   new feeling

            if (reduxPost.feelings && Object.keys(reduxPost.feelings).length) {
                postData.feelings = reduxPost.feelings?.name;
            }
            //   new privacy
            postData.privacy = reduxPost.privacy || "Public";
            //   new imgId, imgVersion

            if (postData.image !== reduxPost.image) {
                // reduxPost.image is blob of newest image need to show in preview image
                // globalChoosedPostImage is newest image file
                // empty mean upload image and replace old image or add new image to none image post
                postData.imgId = "";
                postData.imgVersion = "";

                // if reduxPost.image ="" is not choose image
                postData.image = reduxPost.image ? await ImageUtils.readAsBase64(globalChoosedPostImage) : reduxPost.image

                // additional
                if (reduxPost.image) {
                    postData.bgColor = "#ffffff"
                    postData.gifUrl = "";
                }


            }

            if (postData.gifUrl !== reduxPost.gifUrl) {

                // must do
                postData.gifUrl = reduxPost.gifUrl;
                // additional
                if (reduxPost.gifUrl) {
                    postData.imgId = "";
                    postData.imgVersion = "";
                    postData.bgColor = "#ffffff"
                }


            }
            if (reduxPost.bgColor !== postData.bgColor) {
                // additional
                if (postData.bgColor !== "#ffffff") {
                    postData.imgId = "";
                    postData.imgVersion = "";
                    postData.gifUrl = "";
                }

            }

            let response = ""
            if (postData.image && !postData.imgId && !postData.imgVersion) {
                response = await postService.updatePostWithNewImage(reduxPost._id, postData);
            } else {
                response = await postService.updatePost(reduxPost._id, postData);
            }

            setLoading(false);
            dispatch(closeModal());
            dispatch(emptyPost());
            Utils.displaySuccess(res.data.message, dispatch)



        } catch (error) {
            setLoading(false);
            console.log("ERR", error);
           Utils.displayError(error ,dispatch);
        }
    };



    // get privacy object from reduxPost
    const getPrivacyObject = (type) => {

        let privacy = privacyList.find((data) => data.topText === type);
        return privacy = privacy ? privacy : privacyList[0];
    };





    //   ? END get feellings  from post in redux

    return (
        <PostWrapper>
            <div></div>
            {!reduxModal.isGifModalOpen && (
                <div
                    className="modal-box"
                    style={{
                        height: reduxPost.image || reduxPost.gifUrl ? "700px" : "auto",
                    }}
                >
                    {loading && (
                        <div className="modal-box-loading" data-testid="modal-box-loading">
                            <span>Updating...</span>
                            <Spinner />
                        </div>
                    )}
                    <div className="modal-box-header">
                        <h2>Edit Post</h2>
                        <button
                            onClick={closePostModal}
                            className="modal-box-header-cancel"
                        >
                            X
                        </button>
                    </div>
                    <hr />
                    <AddPostHeader privacyObject={getPrivacyObject(reduxPost.privacy)}></AddPostHeader>

                    {!reduxPost.image && !reduxPost.gifUrl && (
                        <>
                            <div
                                className={`modal-box-form ${postData.bgColor}`}
                                data-testid="modal-box-form"
                                style={{ background: postData.bgColor }}
                            >
                                <div
                                    className="main"
                                    style={{
                                        margin: postData.bgColor != "#ffffff" ? "0 auto" : "",
                                    }}
                                >
                                    {/* //* content in background color */}
                                    <div className="flex-row">
                                        <div
                                            data-testid="editable"
                                            id="editable"
                                            ref={(el) => {
                                                postNoImagePostInputRef.current = el;
                                                postNoImagePostInputRef?.current?.focus();
                                            }}
                                            name="post"
                                            className={`editable flex-item ${postData.bgColor !== "#ffffff" ? "textInputColor" : ""
                                                }
                        ${postData.post.length === 0 && postData.bgColor !== '#ffffff' ? 'defaultInputTextColor' : ''
                                                }`

                                            }
                                            contentEditable={true}
                                            onInput={(event) => onInputPostText(event)}
                                            onKeyDown={onKeyDownPostText}
                                            data-placeholder="What's on your mind?..."
                                        >{reduxPost.post}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {(reduxPost.image || reduxPost.gifUrl) && (
                        <>
                            <div className="modal-box-image-form">
                                {/* //* content  */}

                                <div
                                    data-testid="post-editable"
                                    name="post"
                                    id="editable"
                                    ref={(el) => {
                                        postAndImagePostInputRef.current = el;
                                        postAndImagePostInputRef?.current?.focus();
                                    }}
                                    onInput={(event) => onInputPostText(event)}
                                    onKeyDown={onKeyDownPostText}
                                    className="post-input flex-item"
                                    contentEditable={true}
                                    data-placeholder="What's on your mind?..."
                                >{reduxPost.post}</div>
                                {/* //* image  */}
                                <div className="image-display">
                                    <div
                                        className="image-delete-btn"
                                        data-testid="image-delete-btn"
                                        onClick={clearPostModalImage}
                                    >
                                        <FaTimes />
                                    </div>
                                    <img
                                        data-testid="post-image"
                                        className="post-image"
                                        src={reduxPost.image ? reduxPost.image :
                                            reduxPost.gifUrl

                                        }
                                        alt=""
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <div className="modal-box-bg-colors">
                        <ul>
                            {bgColors.map((color, index) => (
                                <li
                                    data-testid="bg-colors"
                                    key={index}
                                    className={`${color === "#ffffff" ? "whiteColorBorder" : ""}`}
                                    style={{ backgroundColor: `${color}` }}
                                    onClick={() => changePostDataBgColor(color)}
                                ></li>
                            ))}
                        </ul>
                    </div>
                    <span
                        className="char_count"
                        data-testid="allowed-number"
                        ref={counterRef}
                    >
                        {allowedNumberOfCharacters}
                    </span>

                    <AddPostBottomSelection
                        onPostImageInputChange={onPostImageInputChange}
                    ></AddPostBottomSelection>

                    <div className="modal-box-button" data-testid="post-button">
                        <Button
                            label="Update Post"
                            className="post-button"
                            disabled={disabled}
                            handleClick={updatePostToServer}
                        />
                    </div>
                </div>
            )}
            {reduxModal.isGifModalOpen && (
                <div className="modal-giphy" data-testid="modal-giphy">
                    <div className="modal-giphy-header">
                        <Button
                            label={<FaArrowLeft />}
                            className="back-button"
                            disabled={false}
                            handleClick={() =>
                                dispatch(updateModalIsGifModalOpen(!reduxModal.isGifModalOpen))
                            }
                        />
                        <h2>Choose a GIF</h2>
                    </div>
                    <hr />
                    <Giphy />
                </div>
            )}
        </PostWrapper>
    );
};

export default EditPost;
