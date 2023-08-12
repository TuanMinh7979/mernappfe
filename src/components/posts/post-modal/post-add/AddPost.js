import PostWrapper from '@components/posts/modal-wrappers/post-wrapper/PostWrapper'
import { setDate } from 'date-fns'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import "./AddPost.scss"
import ModalBoxContent from '../modal-box-content/ModalBoxContent'
import { FaTimes } from 'react-icons/fa'
import { bgColors } from '@services/utils/static.data'
import ModalBoxSelection from '../modal-box-content/ModalBoxSelection'
import Button from '@components/button/Button'
const AddPost = () => {
    const { gifModalIsOpen } = useSelector(state => state.modal)
    const [loading] = useState(false)

    const [postImage, setPostImage] = useState('');
    const [allowedNumberOfCharacters] = useState('100/100');


    return (
        <PostWrapper>
            <div></div>
            {!gifModalIsOpen &&
                <div className='modal-box'>
                    {loading && <div className='modal-box-loading'
                        data-testid='modal-box-loading'
                    >
                        <span>Posting...</span>

                    </div>
                    }
                    <div className="modal-box-header">
                        <h2>Createpost</h2>
                        <button className='modal-box-header-cancel'>X</button>
                    </div>
                    <hr />
                    <ModalBoxContent></ModalBoxContent>

                    {!postImage && (
                        <>
                            <div
                                className="modal-box-form"
                                data-testid="modal-box-form"

                            >
                                <div className="main" >
                                    <div className="flex-row">
                                        <div
                                            data-testid="editable"
                                            id="editable"
                                            name="post"

                                            className='editable'
                                            contentEditable={true}

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
                                <div
                                    data-testid="post-editable"
                                    name="post"
                                    id="editable"

                                    className="post-input flex-item"
                                    contentEditable={true}
                                    data-placeholder="What's on your mind?..."
                                ></div>
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
                                >

                                </li>
                            )}
                        </ul>
                    </div>
                    <span className='char_count' data-testid="allowed-number">
                        {allowedNumberOfCharacters}
                    </span>

                    <ModalBoxSelection></ModalBoxSelection>

                    <div className="modal-box-button" data-testid="post-button">

                        <Button label="Create Post" className="post-button"
                            disable={true}>


                        </Button>
                    </div>





                </div>

            }
            {gifModalIsOpen && <div>GIF</div>

            }

        </PostWrapper>
    )
}

export default AddPost