import Button from '@components/button/Button';
import Input from '@components/input/Input';
import PropTypes from 'prop-types';

import gif from '@assets/images/gif.png';
import photo from '@assets/images/photo.png';
import feeling from '@assets/images/feeling.png';

import './MessageInput.scss';
import { FaPaperPlane } from 'react-icons/fa';
import loadable from '@loadable/component';
import { useState } from 'react';
import { useRef } from 'react';
import ImagePreview from '@components/chat/image-preview/ImagePreview';
import GiphyContainer from '@components/chat/giphy-container/GiphyContainer';
import { ImageUtils } from '@services/utils/image-utils.service';
const EmojiPickerComponent = loadable(() => import('./EmojiPicker'), {
    fallback: <p id="loading">Loading...</p>
});

const MessageInput = ({ setChatMessage }) => {
      let [message, setMessage] = useState('');
    const [showEmojiContainer, setShowEmojiContainer] = useState(false);
    const [showGifContainer, setShowGifContainer] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    //   const [file, setImageUrl] = useState();
    //   const [base64File, setBase64File] = useState('');
    //   const [hasFocus, setHasFocus] = useState(false);
    const fileInputRef = useRef();
    const onfileInputClicked = () => {
        fileInputRef.current.click();
      };
    //   const messageInputRef = useRef();

    const handleGiphyClick = () => {
        fileInputRef.current.clicked();
    }
    const [imageUrl, setImageUrl] = useState();
    const [base64File, setBase64File] = useState('');
    //  
    const onImageInputChange = async (file) => {
        ImageUtils.checkFile(file);
        setImageUrl(URL.createObjectURL(file));
        const result = await ImageUtils.readAsBase64(file);
        setBase64File(result);
        setShowImagePreview(!showImagePreview);
        setShowEmojiContainer(false);
        setShowGifContainer(false);
    };
console.log("-------------------------",showEmojiContainer);
    return (
        <>

            {showEmojiContainer && (
                <EmojiPickerComponent
                    onEmojiClick={(event, eventObject) => {
                        console.log("set mesage111111111111111111111111111111111111111");
                        setMessage((text) => (text += ` ${eventObject.emoji}`));
                    }}
                    pickerStyle={{ width: '352px', height: '447px' }}
                />
            )}

            {showGifContainer && <GiphyContainer handleGiphyClick={handleGiphyClick} />}

            <div className="chat-inputarea" data-testid="chat-inputarea">
                {showImagePreview && (
                    <ImagePreview
                        image={imageUrl}
                        onRemoveImage={() => {
                            setImageUrl('');
                            setBase64File('');
                            setShowImagePreview(!showImagePreview);
                        }}
                    />
                )} 
                <form >
                    <ul className="chat-list"
                    >
                        <li
                            className="chat-list-item"
                            onClick={() => {

                                onfileInputClicked()
                                setShowImagePreview(!showImagePreview)
                                setShowEmojiContainer(false)
                                setShowGifContainer(false)

                            }}
                        >
                            <Input

                                ref={fileInputRef}

                                id="image"
                                name="image"
                                type="file"
                                className="file-input"
                                placeholder="Select file"
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = null;
                                    }
                                }}
                                handleChange={(event) => onImageInputChange(event.target.files[0])}

                            />
                            <img src={photo} alt="" />
                        </li>
                        {/* Gif */}
                        <li
                            className="chat-list-item"
                            onClick={() => {
                                setShowGifContainer(!showGifContainer)
                                setShowEmojiContainer(false);
                                setShowImagePreview(false)
                            }}
                        >
                            <img src={gif} alt="" />
                        </li>
                        {/* Emoji */}
                        <li
                            className="chat-list-item"
                            onClick={() => {
                        
                                setShowEmojiContainer(!showEmojiContainer);
                                setShowGifContainer(false);
                                setShowImagePreview(false)
                            }}

                        >
                            <img src={feeling} alt="" />
                        </li>
                    </ul>
                    <Input

                        id="message"
                        name="message"
                        type="text"

                        className="chat-input"
                        labelText=""
                        placeholder="Enter your message..."

                    />
                    <Button label={<FaPaperPlane />} className="paper" />

                </form>

            </div>
        </>
    );
};

MessageInput.propTypes = {
    setChatMessage: PropTypes.func
};

export default MessageInput;
