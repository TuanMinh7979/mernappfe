import PropTypes from 'prop-types';
import './MessageDisplay.scss';
import { timeAgo } from '@services/utils/time.ago.utils';
import { Utils } from '@services/utils/utils.service';

const MessageDisplay = ({ chatMessages, profile, updateMessageReaction, deleteChatMessage }) => {


    return (
        <>

            <div className="message-page" data-testid="message-page">
                {/* {chatMessages.map((chat, index) => ( */}
                <div key={Utils.generateString(10)} className="message-chat" data-testid="message-chat">
        
        
                            <div className="message-date-group">
                                <div className="message-chat-date" data-testid="message-chat-date">
                                    {/* {timeAgo.chatMessageTransform(chat.createdAt)} */}
                                    1/1
                                </div>
                            </div>
                  

                </div>
                {/* ))} */}
            </div>
        </>
    );
};

MessageDisplay.propTypes = {
    chatMessages: PropTypes.array,
    profile: PropTypes.object,
    updateMessageReaction: PropTypes.func,
    deleteChatMessage: PropTypes.func
};

export default MessageDisplay;
