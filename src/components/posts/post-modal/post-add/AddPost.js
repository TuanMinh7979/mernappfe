import PostWrapper from '@components/posts/modal-wrappers/post-wrapper/PostWrapper'
import { setDate } from 'date-fns'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import "./AddPost.scss"
import ModalBoxContent from '../modal-box-content/ModalBoxContent'
const AddPost = () => {
    const { gifModalIsOpen } = useSelector(state => state.modal)
    const [loading] = useState(false)
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
                </div>

            }
            {gifModalIsOpen && <div>GIF</div>

            }

        </PostWrapper>
    )
}

export default AddPost