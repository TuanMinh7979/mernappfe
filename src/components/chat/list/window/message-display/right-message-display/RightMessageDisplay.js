import Reactions from "@components/posts/reactions/Reactions";
import PropTypes from "prop-types";
import { timeAgo } from "@services/utils/time.ago.utils";
import doubleCheckmark from "@assets/images/double-checkmark.png";
import { reactionsMap } from "@services/utils/static.data";
import RightMessageBubble from "./RightMessageBubble";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
const RightMessageDisplay = ({
  side,
  chat,
  messageIdx,
  isLastChatMessage,
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
  showImageModal,
}) => {

  console.log(chat);
  const [deletedByMe, setDeletedByMe] = useState(chat.deletedByUsers.length>0 && chat?.deletedByUsers.some(el => el == profile._id))
  useEffect(() => {
    setDeletedByMe(chat.deletedByUsers.length >0 && chat?.deletedByUsers.some(el => el == profile._id))
  }, [chat])
  return (

    <div className={`message ${side}-message`} data-testid="right-message">
      <div
        className={`message-${side}-reactions-container`}
        style={{ border: "1px dashed red" }}
      >
        {isShowReactionSelection &&
          isBeingHovered &&
          !chat?.deleteForEveryone && (
            <div ref={reactionRef}>
              <Reactions
                showLabel={false}
                handleClick={(reactionObject) => {
                  const body = {
                    conversationId: chat?.conversationId,
                    messageId: chat?._id,
                    reaction: reactionObject,
                    type: "add",
                  };
                  postMessageReaction(body);
                  setIsShowReactionSelection(false);
                }}
              />
            </div>
          )}
      </div>
      <div
        className={`message-${side}-content-container-wrapper`}
        style={{ border: "1px dashed yellow", position: "relative" }}
      >
        <div
          style={{ border: "1px solid yellow" }}
          data-testid="message-content"
          className="message-content message-content-right"
          onClick={() => {
            if (!chat.deleteForEveryone) {
              showDeleteMessageDialog(chat, !chat.isRead ? "bold" : "deleteForMe");
            }
          }}
          onMouseEnter={() => {
            if (!chat.deleteForEveryone) {
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
            && (
              <div className={`message-bubble ${side}-message-bubble`}>
                <span className="message-deleted">message deleted for me</span>
              </div>
            )}

          {/* returned */}
          {chat?.deleteForEveryone && (
            <div className={`message-bubble ${side}-message-bubble`}>
              <span className="message-deleted">message is returend</span>
            </div>
          )}
          {/* */}
          {!chat?.deleteForEveryone && !deletedByMe
            && (
              <RightMessageBubble
                side={side}
                chat={chat}
                showImageModal={showImageModal}
                setImageUrl={setImageUrl}
                setShowImageModal={setShowImageModal}
              />
            )}


          {isBeingHovered && !chat.deleteForEveryone && !deletedByMe && (
            <div
              style={{ position: "absolute", left: 0, top: 0 }}
              className={`message-content-emoji-${side}-container`}
              onClick={() => {
                setIsShowReactionSelection(true);
              }}
            >
              &#9786;
            </div>
          )}
        </div>
        {/* reaction icon */}
      </div>
      {/* time */}
      <div
        className="message-content-bottom"
        style={{ border: "1px dashed green" }}
      >
        {chat?.reaction &&
          chat?.reaction.length > 0 &&
          !chat.deleteForEveryone && (
            <div className="message-reaction">
              {chat?.reaction.map((data, index) => (
                <img
                  key={index}
                  data-testid="reaction-img"
                  src={reactionsMap[data?.type]}
                  alt=""
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
          {chat?.senderUsername === profile?.username &&
            !chat?.deleteForEveryone && (
              <>
                {isLastChatMessage && (
                  // <img src={doubleCheckmark} alt="" className="message-read-icon" />
                  <span>received</span>
                )}
              </>
            )}
          <span data-testid="chat-time">
            {timeAgo.timeFormat(chat?.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

RightMessageDisplay.propTypes = {
  chat: PropTypes.object,
  lastChatMessage: PropTypes.object,
  profile: PropTypes.object,
  reactionRef: PropTypes.any,
  isShowReactionSelection: PropTypes.bool,
  isShowReactionIcon: PropTypes.bool,
  index: PropTypes.number,
  hoveringMessageIndex: PropTypes.number,
  setIsShowReactionSelection: PropTypes.func,
  postMessageReaction: PropTypes.func,
  showDeleteMessageDialog: PropTypes.func,
  showReactionIconOnHover: PropTypes.func,
  setActiveElementIndex: PropTypes.func,

  setShowImageModal: PropTypes.func,
  showImageModal: PropTypes.bool,
  setImageUrl: PropTypes.func,
};
export default RightMessageDisplay;
