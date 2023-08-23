import Button from '@components/button/Button';
import Input from '@components/input/Input';
import PropTypes from 'prop-types';

import gif from '@assets/images/gif.png';
import photo from '@assets/images/photo.png';
import feeling from '@assets/images/feeling.png';

import './MessageInput.scss';




const MessageInput = ({ setChatMessage }) => {
//   let [message, setMessage] = useState('');
//   const [showEmojiContainer, setShowEmojiContainer] = useState(false);
//   const [showGifContainer, setShowGifContainer] = useState(false);
//   const [showImagePreview, setShowImagePreview] = useState(false);
//   const [file, setFile] = useState();
//   const [base64File, setBase64File] = useState('');
//   const [hasFocus, setHasFocus] = useState(false);
//   const fileInputRef = useRef();
//   const messageInputRef = useRef();



  return (
    <>

   
      <div className="chat-inputarea" data-testid="chat-inputarea">

        <form >
          <ul className="chat-list" 
          >
            <li
              className="chat-list-item"
              
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
            <li
              className="chat-list-item"
           
            >
              <img src={gif} alt="" />
            </li>
            <li
              className="chat-list-item"
             
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
        </form>
       
      </div>
    </>
  );
};

MessageInput.propTypes = {
  setChatMessage: PropTypes.func
};

export default MessageInput;
