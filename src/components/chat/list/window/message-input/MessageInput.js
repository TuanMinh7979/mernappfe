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
import GiphyContainer from '@components/chat/giphy-container/GiphyContainer';
const EmojiPickerComponent = loadable(() => import('./EmojiPicker'), {
    fallback: <p id="loading">Loading...</p>
});

const MessageInput = ({ setChatMessage }) => {
    //   let [message, setMessage] = useState('');
    const [showEmojiContainer, setShowEmojiContainer] = useState(false);
    const [showGifContainer, setShowGifContainer] = useState(false);
    //   const [showImagePreview, setShowImagePreview] = useState(false);
    //   const [file, setFile] = useState();
    //   const [base64File, setBase64File] = useState('');
    //   const [hasFocus, setHasFocus] = useState(false);
    //   const fileInputRef = useRef();
    //   const messageInputRef = useRef();

    const handleGiphyClick=()=>{
        
    }

    return (
        <>

            {showEmojiContainer && (
                <EmojiPickerComponent
                    onEmojiClick={(event, eventObject) => {
                        console.log("set mesage");
                        // setMessage((text) => (text += ` ${eventObject.emoji}`));
                    }}
                    pickerStyle={{ width: '352px', height: '447px' }}
                />
            )}

            {showGifContainer && <GiphyContainer handleGiphyClick={handleGiphyClick} />}

            <div className="chat-inputarea" data-testid="chat-inputarea">

                <form >
                    <ul className="chat-list"
                    >
                        <li
                            className="chat-list-item"
                            onClick={() => {

                                setShowEmojiContainer(false);

                            }}
                        >
                            <Input

                                id="image"
                                name="image"
                                type="file"
                                className="file-input"
                                placeholder="Select file"

                            />
                            <img src={photo} alt="" />
                        </li>
                        {/* Gif */}
                        <li
                            className="chat-list-item"
                            onClick={() => {
                                setShowGifContainer(!showGifContainer)
                                setShowEmojiContainer(false);
                            }}
                        >
                            <img src={gif} alt="" />
                        </li>
                        {/* Emoji */}
                        <li
                            className="chat-list-item"
                            onClick={() => {
                                setShowEmojiContainer(!showEmojiContainer);
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
