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
import { useEffect } from 'react';
const EmojiPickerComponent = loadable(() => import('./EmojiPicker'), {
    fallback: <p id="loading">Loading...</p>
});

const MessageInput = ({ sendChatMessage }) => {

  

    let [message, setMessage] = useState('');
    const [showEmojiContainer, setShowEmojiContainer] = useState(false);
    const [showGifContainer, setShowGifContainer] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    //   const [file, setImageUrl] = useState();
    //   const [base64File, setBase64File] = useState('');
    const [hasFocus, setHasFocus] = useState(false);
    const fileInputRef = useRef();
    const messageInputRef = useRef();
    const onfileInputClicked = () => {
        fileInputRef.current.click();
    };


    const handleGiphyClick = (url) => {
        sendChatMessage("Sent a GIF", url, "")
        reset()
    }
    const [imageUrl, setImageUrl] = useState();
    const [base64File, setBase64File] = useState('');
    //  
    const onImageInputChange = async (file) => {
        ImageUtils.checkFile(file);
        setImageUrl(URL.createObjectURL(file));
        const result = await ImageUtils.readAsBase64(file);
        console.log("BASSSSSSSSSSSSSE 64 ", result);
        setBase64File(result);
        setShowImagePreview(true);
        setShowEmojiContainer(false);
        setShowGifContainer(false);
    };

    const handleClick = (event) => {
        event.preventDefault();
        message = message || 'Sent an Image';
        sendChatMessage(message.replace(/ +(?= )/g, ''), '',);
        setMessage('');
        reset();
    };

    const handleImageClick = () => {
        message = message || 'Sent an Image';
        sendChatMessage(message.replace(/ +(?= )/g, ''), '', message ? message : base64File);
        setMessage('');
        reset();
    };

    const reset = () => {
        setBase64File('');
        setShowImagePreview(false);
        setShowEmojiContainer(false);
        setShowGifContainer(false);
        setImageUrl('');
    };

  
    return (
        <>

            {showEmojiContainer && (
                <EmojiPickerComponent
                    onEmojiClick={(event, eventObject) => {
                        console.log("event", event, eventObject);
                        setMessage((text) => (text += ` ${event.emoji}`));
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
                    <ul className="chat-list" style={{ borderColor: `${hasFocus ? '#50b5ff' : '#f1f0f0'}` }}>


                        <li
                            className="chat-list-item"
                            onClick={() => {

                                onfileInputClicked()

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

                        ref={messageInputRef}
                        id="message"
                        name="message"
                        type="text"
                        value={message}
                        className="chat-input"
                        labelText=""
                        placeholder="Enter your message..."
                        onFocus={() => setHasFocus(true)}
                        onBlur={() => setHasFocus(false)}
                        handleChange={(event) => setMessage(event.target.value)}

                    />
                </form>
                <Button label={<FaPaperPlane />} className="paper" handleClick={handleImageClick} />
            </div>
        </>
    );
};

MessageInput.propTypes = {
    sendChatMessage: PropTypes.func
};

export default MessageInput;
