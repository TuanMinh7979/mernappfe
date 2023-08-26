import PropTypes from 'prop-types';
import './MessageDisplay.scss';
import { timeAgo } from '@services/utils/time.ago.utils';
import { Utils } from '@services/utils/utils.service';
import RightMessageDisplay from './right-message-display/RightMessageDisplay';
import { useState } from 'react';
import { useRef } from 'react';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import useChatScrollToBottom from '@hooks/useChatScrollToBottom';
import RightMessageBubble from './right-message-display/RightMessageBubble';
import LeftMessageDisplay from './left-message-display/LeftMessageDisplay';
const MessageDisplay = ({ chatMessages, profile, updateMessageReaction, deleteChatMessage }) => {
   
    const [imageUrl, setImageUrl] = useState('');
    const [showReactionIcon, setShowReactionIcon] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        message: null,
        type: ''
    });
    const [activeElementIndex, setActiveElementIndex] = useState(null);
    const [selectedReaction, setSelectedReaction] = useState(null);
    const reactionRef = useRef(null);
    const [toggleReaction, setToggleReaction] = useDetectOutsideClick(reactionRef, false);
    const scrollRef = useChatScrollToBottom(chatMessages);

    const showReactionIconOnHover = (show, index) => {
        if (index === activeElementIndex || !activeElementIndex) {
            setShowReactionIcon(show);
        }
    };

    const handleReactionClick = (body) => {
        updateMessageReaction(body);
        setSelectedReaction(null);
    };

    const deleteMessage = (message, type) => {
        setDeleteDialog({
            open: true,
            message,
            type
        });
    };

    return (
        <>

            <div className="message-page" data-testid="message-page">
                {chatMessages.map((chat, index) => (
                    <div key={Utils.generateString(10)} className="message-chat" data-testid="message-chat">


                        {(index === 0 ||
                            timeAgo.dayMonthYear(chat.createdAt) !== timeAgo.dayMonthYear(chatMessages[index - 1].createdAt)) && (
                                <div className="message-date-group">
                                    <div className="message-chat-date" data-testid="message-chat-date">
                                        {timeAgo.chatMessageTransform(chat.createdAt)}
                                    </div>
                                </div>
                            )}


                        {/* data */}
                        {(chat.receiverUsername === profile?.username || chat.senderUsername === profile?.username) && (
                            <>
                                {chat.senderUsername === profile?.username && (
                                    <RightMessageDisplay
                                        chat={chat}
                                        lastChatMessage={chatMessages[chatMessages.length - 1]}
                                        profile={profile}
                                        toggleReaction={toggleReaction}
                                        showReactionIcon={showReactionIcon}
                                        index={index}
                                        activeElementIndex={activeElementIndex}
                                        reactionRef={reactionRef}
                                        setToggleReaction={setToggleReaction}
                                        handleReactionClick={handleReactionClick}
                                        deleteMessage={deleteMessage}
                                        showReactionIconOnHover={showReactionIconOnHover}
                                        setActiveElementIndex={setActiveElementIndex}
                                        setShowImageModal={setShowImageModal}
                                        setImageUrl={setImageUrl}
                                        showImageModal={showImageModal}
                                        setSelectedReaction={setSelectedReaction}
                                    />
                                )}

                                {chat.receiverUsername === profile?.username && (
                                    <LeftMessageDisplay
                                        chat={chat}
                                        profile={profile}
                                        toggleReaction={toggleReaction}
                                        showReactionIcon={showReactionIcon}
                                        index={index}
                                        activeElementIndex={activeElementIndex}
                                        reactionRef={reactionRef}
                                        setToggleReaction={setToggleReaction}
                                        handleReactionClick={handleReactionClick}
                                        deleteMessage={deleteMessage}
                                        showReactionIconOnHover={showReactionIconOnHover}
                                        setActiveElementIndex={setActiveElementIndex}
                                        setShowImageModal={setShowImageModal}
                                        setImageUrl={setImageUrl}
                                        showImageModal={showImageModal}
                                        setSelectedReaction={setSelectedReaction}
                                    />
                                )}
                            </>
                        )}


                    </div>
                ))}
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
