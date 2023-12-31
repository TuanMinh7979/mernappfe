import Avatar from '@components/avatar/Avatar';
import Reactions from '@components/posts/reactions/Reactions';
import { reactionsMap } from '@services/utils/static.data';
import { timeAgo } from '@services/utils/time.ago.utils';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useState } from 'react';
import { IoMdTrash } from "react-icons/io"
import { BsEmojiSmile } from "react-icons/bs"
const LeftMessageDisplay = ({
  chat,

  messageIdx,


  profile,

  isShowReactionSelection,
  setIsShowReactionSelection,


  setHoveringMessageIndex,
  isBeingHovered,
  reactionRef,

  postMessageReaction,


  showDeleteMessageDialog,


  setShowImageModal,
  setImageUrl,
  showImageModal
}) => {

  const [deletedByMe, setDeletedByMe] = useState(chat.deletedByUsers.length > 0 && chat.deletedByUsers.some(el => el == profile._id))
  useEffect(() => {
    setDeletedByMe(chat.deletedByUsers.length > 0 && chat?.deletedByUsers.some(el => el == profile._id))
  }, [chat])
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

              onMouseEnter={() => {
                if (!chat?.deleteForMe) {

                  setHoveringMessageIndex(messageIdx);
                }
              }}


              onMouseLeave={() => {
                if (!isShowReactionSelection) {
                  setHoveringMessageIndex(null);
                }
              }}
            >

              {/* delete for me */}
              {!chat?.deleteForEveryone &&
                deletedByMe
                &&
                <div className="message-bubble left-message-bubble">
                  <span className="message-deleted">message deleted</span>
                </div>
              }
              {/* returned */}
              {chat.deleteForEveryone &&
                <div className="message-bubble left-message-bubble">
                  <span className="message-deleted">message returned</span>
                </div>
              }

              {!chat.deleteForEveryone &&
                !deletedByMe
                && <>
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
                  {/* message-content-emoji-container */}
                  {isBeingHovered && !chat?.deleteForMe && (<>
                    {isBeingHovered && !chat.deleteForEveryone && !deletedByMe && (<>
                      <div
                        style={{
                          position: "absolute", right: "-10px",
                          top: `
                                ${chat.gifUrl || chat.selectedImage ? !chat.body.startsWith("Sent") ? "30px" : "-10px" : "-10px"}`
                        }}
                        className={`message-content-emoji-container`}

                      >
                        <BsEmojiSmile onClick={(e) => {
                          e.stopPropagation()
                          setIsShowReactionSelection(true);
                        }}></BsEmojiSmile>
                      </div>
                      <div
                        style={{
                          position: "absolute", right: "-10px", top:
                            `${chat.gifUrl || chat.selectedImage ? !chat.body.startsWith("Sent") ? "70px" : "30px" : "30px"}`
                        }}
                        className={`message-content-emoji-container`}
                      >
                        <IoMdTrash onClick={(e) => {
                          e.stopPropagation()
                          if (!chat.deleteForEveryone) {
                            showDeleteMessageDialog(chat, !chat.isRead ? "bold" : "deleteForMe");
                          }
                        }} />
                      </div></>

                    )}
                  </>
                  )}</>

              }







            </div>

          </div>
          {chat?.reaction && chat.reaction.length > 0 && !chat?.deleteForMe && !deletedByMe && (
            <div className="message-reaction">
              {chat?.reaction.map((data, index) => (
                <img
                  style={{ border: `${data?.senderName === profile?.username ? "1px dashed red" : "1px solid blue"}` }}
                  src={reactionsMap[data?.type]}
                  alt=""
                  key={index}
                  onClick={() => {
                    if (data?.senderName === profile?.username) {
                      const body = {
                        conversationId: chat?.conversationId,
                        messageId: chat?._id,
                        reaction: data?.type,
                        type: "remove",
                      };
                      postMessageReaction(body);
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
  showDeleteMessageDialog: PropTypes.func,
  showReactionIconOnHover: PropTypes.func,
  setHoveringMessageIndex: PropTypes.func,
  setIsShowReactionSelection: PropTypes.func,
  setShowImageModal: PropTypes.func,
  showImageModal: PropTypes.bool,
  setImageUrl: PropTypes.func
};
export default LeftMessageDisplay;
