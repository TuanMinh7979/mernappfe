import Avatar from '@components/avatar/Avatar';
import Reactions from '@components/posts/reactions/Reactions';
import { reactionsMap } from '@services/utils/static.data';
import { timeAgo } from '@services/utils/time.ago.utils';
import PropTypes from 'prop-types';

const LeftMessageDisplay = ({
  chat,
  profile,
  isShowReactionSelection,

  messageIdx,
  isBeingHovered,
  reactionRef,
  setIsShowReactionSelection,
  postMessageReaction,
  deleteMessage,
  
  setHoveringMessageIndex,

  setShowImageModal,
  setImageUrl,
  showImageModal
}) => {
  return (
    <div className="message left-message" data-testid="left-message">
      <div className="message-reactions-container">
        {isShowReactionSelection && isBeingHovered && (
          <div ref={reactionRef}>
            <Reactions
              showLabel={false}
              handleClick={(event) => {
                const body = {
                  conversationId: chat?.conversationId,
                  messageId: chat?._id,
                  reaction: event,
                  type: 'add'
                };
                postMessageReaction(body);
                setIsShowReactionSelection(false);
              }}
            />
          </div>
        )}
      </div>
      <div className="left-message-bubble-container">
        <div className="message-img">
          <Avatar
            name={chat.senderUsername}
            bgColor={chat.senderAvatarColor}
            textColor="#ffffff"
            size={40}
            avatarSrc={chat.senderProfilePicture}
          />
        </div>
        <div className="message-content-container">
          <div className="message-content-container-wrapper">
            <div
              className="message-content"
              onClick={() => {
                if (!chat?.deleteForMe) {
                  deleteMessage(chat, 'deleteForMe');
                }
              }}
              onMouseEnter={() => {
                if (!chat?.deleteForMe) {
     
                  setHoveringMessageIndex(messageIdx);
                }
              }}
            >
              {chat?.deleteForMe && chat?.receiverUsername === profile?.username && (
                <div className="message-bubble left-message-bubble">
                  <span className="message-deleted">message deleted</span>
                </div>
              )}

              {!chat?.deleteForMe && (
                <>
                  {chat?.body !== 'Sent a GIF' && chat?.body !== 'Sent an Image' && (
                    <div className="message-bubble left-message-bubble">{chat?.body}</div>
                  )}
                  {chat?.selectedImage && (
                    <div
                      className="message-image"
                      style={{
                        marginTop: `${chat?.body && chat?.body !== 'Sent an Image' ? '5px' : ''}`
                      }}
                    >
                      <img
                        src={chat?.selectedImage}
                        onClick={() => {
                          setImageUrl(chat?.selectedImage);
                          setShowImageModal(!showImageModal);
                        }}
                        alt=""
                      />
                    </div>
                  )}
                  {chat?.gifUrl && (
                    <div className="message-gif">
                      <img src={chat?.gifUrl} alt="" />
                    </div>
                  )}
                </>
              )}
            </div>
            {  isBeingHovered && !chat?.deleteForMe && (
              <div className="message-content-emoji-container" onClick={() => setIsShowReactionSelection(true)}>
                &#9786;
              </div>
            )}
          </div>
          {chat?.reaction && chat.reaction.length > 0 && !chat?.deleteForMe && (
            <div className="message-reaction">
              {chat?.reaction.map((data, index) => (
                <img
                  src={reactionsMap[data?.type]}
                  alt=""
                  key={index}
                  onClick={() => {
                    if (data?.senderName === profile?.username) {
                      const body = {
                        conversationId: chat?.conversationId,
                        messageId: chat?._id,
                        reaction: data?.type,
                        type: 'remove'
                      };
                      setIsShowReactionSelection(body);
                    }
                  }}
                />
              ))}
            </div>
          )}
          <div className="message-time">
            <span data-testid="chat-time">{timeAgo.timeFormat(chat?.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
LeftMessageDisplay.propTypes = {
  chat: PropTypes.object,
  profile: PropTypes.object,
  reactionRef: PropTypes.any,
  isShowReactionSelection: PropTypes.bool,
  showReactionIcon: PropTypes.bool,
  messageIdx: PropTypes.number,
  activeElementIndex: PropTypes.number,
  setIsShowReactionSelection: PropTypes.func,
  postMessageReaction: PropTypes.func,
  deleteMessage: PropTypes.func,
  showReactionIconOnHover: PropTypes.func,
  setHoveringMessageIndex: PropTypes.func,
  setIsShowReactionSelection: PropTypes.func,
  setShowImageModal: PropTypes.func,
  showImageModal: PropTypes.bool,
  setImageUrl: PropTypes.func
};
export default LeftMessageDisplay;
