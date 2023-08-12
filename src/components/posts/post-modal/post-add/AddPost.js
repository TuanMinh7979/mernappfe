import PostWrapper from '@components/posts/modal-wrappers/post-wrapper/PostWrapper'
import { setDate } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./AddPost.scss"
import AddPostHeader from '../modal-box-content/AddPostHeader'
import { FaTimes } from 'react-icons/fa'
import { bgColors } from '@services/utils/static.data'

import Button from '@components/button/Button'
import { PostUtils } from '@services/utils/post-utils.service'
import { useRef } from 'react'
import { closeModal } from '@redux/reducers/modal/modal.reducer'
import { emptyPost } from '@redux/reducers/post/post.reducer'
import AddPostBottomSelection from '../modal-box-content/AddPostBottomSelection'
const AddPost = () => {
    const dispatch = useDispatch()
    const { isGifModalOpen } = useSelector(state => state.modal)
    const { gifUrl, image, privacy, video } = useSelector((state) => state.post);
    //  Form post image state
    const [postImage, setPostImage] = useState('');
    const [selectedPostImage, setSelectedPostImage] = useState('')

    // Limit character
    const [allowedNumberOfCharacters] = useState('100/100');
    // Disable add post button
    const [disable, setDisable] = useState(false);
    //*  Background color for post (for text background):
    // state for color background
    const [textAreaBackground, setTextAreaBackground] = useState("#ffffff")
    // select post banckground color
    const selectBackground = (bgColor) => {
        PostUtils.selectBackground(
            bgColor,
            postData,
            setTextAreaBackground,
            setPostData,
            setDisable
        )
    }
    //  * Loading
    const [loading] = useState(false)


    // * Data for new post:
    const [postData, setPostData] = useState({
        post: '',
        bgColor: textAreaBackground,
        privacy: '',
        feeling: '',
        gifUrl: '',
        profilePicture: '',
        image: ''
    })

    const counterRef = useRef(null);
    // TODO: move to env
    const max_char_cnt = 100;
    const onInputPostText = (event) => {
        const currentTextLength = event.target.textContent.length
        const counter = max_char_cnt - currentTextLength;
        counterRef.current.textContent = `${counter}/100`
        postData.post = event.target.textContent;
        //! TO STATE
        setPostData(postData);
    }

    //  TODO: fix when client copy and paste
    const onKeyDownPostText = (event) => {
        const currentTextLength = event.target.textContent.length
        if (currentTextLength >= max_char_cnt && event.keyCode !== 8) {
            event.preventDefault()
        }
    }
    // * UseEffect: 
    useEffect(() => {
        if (gifUrl) {
            setPostImage(gifUrl)
        } else {
            setPostImage(image)
        }
    }, [gifUrl, image])

    const closePostModal = () => {
        dispatch(closeModal())
        dispatch(emptyPost())
    }

    return (
        <PostWrapper>
            <div></div>
            {!isGifModalOpen &&
                <div className='modal-box'>
                    {loading && <div className='modal-box-loading'
                        data-testid='modal-box-loading'
                    >
                        <span>Posting...</span>

                    </div>
                    }
                    <div className="modal-box-header">
                        <h2>Createpost</h2>
                        <button
                            onClick={closePostModal}
                            className='modal-box-header-cancel'>X</button>
                    </div>
                    <hr />
                    <AddPostHeader></AddPostHeader>

                    {!postImage && (
                        <>
                            <div
                                className="modal-box-form"
                                data-testid="modal-box-form"
                                style={{ background: `${textAreaBackground}` }}

                            >
                                <div className="main"
                                    style={{
                                        margin: textAreaBackground != '#ffffff' ?
                                            '0 auto' : ''
                                    }}

                                >
                                    {/* //* content in background color */}
                                    <div className="flex-row">
                                        <div
                                            data-testid="editable"
                                            id="editable"
                                            name="post"

                                            className={`editable flex-item ${textAreaBackground != '#ffffff' ?
                                                'textInputColor' : ''}`}
                                            contentEditable={true}
                                            onInput={(event) => onInputPostText(event)}
                                            onKeyDown={onKeyDownPostText}
                                            data-placeholder="What's on your mind?..."
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {postImage && (
                        <>
                            <div className="modal-box-image-form">
                                {/* //* content  */}
                                <div
                                    data-testid="post-editable"
                                    name="post"
                                    id="editable"

                                    className="post-input flex-item"
                                    contentEditable={true}
                                    data-placeholder="What's on your mind?..."
                                ></div>
                                {/* //* image  */}
                                <div className="image-display">
                                    <div
                                        className="image-delete-btn"
                                        data-testid="image-delete-btn"

                                    >
                                        <FaTimes />
                                    </div>
                                    <img data-testid="post-image" className="post-image" src={`${postImage}`} alt="" />

                                </div>
                            </div>
                        </>
                    )}
                    <div className="modal-box-bg-colors">
                        <ul>

                            {bgColors.map((color, index) =>

                                <li
                                    data-testid="bg-colors"
                                    key={index}
                                    className={`${color === "#ffffff" ? 'whiteColorBorder' : ''}`}
                                    style={{ backgroundColor: `${color}` }}
                                    onClick={() => selectBackground(color)}
                                >

                                </li>
                            )}
                        </ul>
                    </div>
                    <span className='char_count' data-testid="allowed-number"
                        ref={counterRef}>
                        {allowedNumberOfCharacters}
                    </span>

                    <AddPostBottomSelection setSelectedPostImage={setSelectedPostImage}></AddPostBottomSelection>

                    <div className="modal-box-button" data-testid="post-button">

                        <Button label="Create Post" className="post-button"
                            disable={disable}>


                        </Button>
                    </div>
                </div>

            }
            {isGifModalOpen && <div>GIF</div>

            }


        </PostWrapper>
    )
}

export default AddPost