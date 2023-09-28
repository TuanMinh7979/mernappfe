import PropTypes from "prop-types";
import "./MessageDisplay.scss";
import { timeAgo } from "@services/utils/time.ago.utils";
import { Utils } from "@services/utils/utils.service";
import RightMessageDisplay from "./right-message-display/RightMessageDisplay";
import { useState } from "react";
import { useRef } from "react";

import useChatScrollToBottom from "@hooks/useChatScrollToBottom";

import LeftMessageDisplay from "./left-message-display/LeftMessageDisplay";
import { chatService } from "@services/api/chat/chat.service";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import ImageModal from "@components/image-modal/ImageModal";
import Dialog from "@components/dialog/Dialog";
import ThreeButtonDialog from "@components/dialog/ThreeButtonDialog";
const MessageDisplay = ({ chatMessages, profile }) => {
  const [imageUrl, setImageUrl] = useState("");

  const [showImageModal, setShowImageModal] = useState(false);

  const dispatch = useDispatch();
  const postMessageReaction = async (body) => {
    try {
      await chatService.updateMessageReaction(body);
    } catch (error) {
      console.log(error);
      Utils.updToastsNewEle(error.response.data.message, "error", dispatch);
    }
  };



  const [hoveringMessageIndex, setHoveringMessageIndex] = useState(null);

  const scrollRef = useChatScrollToBottom(chatMessages);



  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    message: null,
    type: "",
  });
  const showDeleteMessageDialog = (message, type) => {
    setDeleteDialog({
      open: true,
      message,
      type,
    });
  };

  const deleteChatMessageService = async (senderId, receiverId, messageId, type) => {
    try {
      await chatService.markMessageAsDelete(
        messageId,
        senderId,
        receiverId,
        type
      );
    } catch (error) {
      Utils.updToastsNewEle(error.response.data.message, "error", dispatch);
    }
  };


  const reactionRef = useRef(null);

  const [isShowReactionSelection, setIsShowReactionSelection] = useState(false);

  // isActive changing will trigger this function:
  useEffect(() => {
    // * click everywhere trigger this func:
    const onClick = (event) => {
      if (
        reactionRef.current !== null &&
        !reactionRef.current.contains(event.target)
      ) {
        setIsShowReactionSelection(false);
        setHoveringMessageIndex(null)
      }
    };
    if (isShowReactionSelection) {
      window.addEventListener("mousedown", onClick);
    }

    return () => {
      window.removeEventListener("mousedown", onClick);
    };
  }, [isShowReactionSelection, reactionRef]);

  return (
    <>
      {showImageModal && (
        <ImageModal
          image={`${imageUrl}`}
          onCancel={() => setShowImageModal(!showImageModal)}
          showArrow={false}
        />
      )}

      {deleteDialog.open && (<> {
        deleteDialog.type === "deleteForMe" ?
          <Dialog
            title="Delete message?"
            showButtons={true}
            firstButtonText='DELETE FOR ME'
            secondButtonText="CANCEL"
            firstBtnHandler={() => {
              const { message, type } = deleteDialog;
              deleteChatMessageService(message.senderId, message.receiverId, message._id, "deleteForMe");
              setDeleteDialog({
                open: false,
                message: null,
                type: ''
              });
            }}
            secondBtnHandler={() => {
              setDeleteDialog({
                open: false,
                message: null,
                type: ''
              });
            }}
          /> :
          <ThreeButtonDialog
            title="Delete message?"
            showButtons={true}
            firstButtonText='DELETE FOR ME'
            secondButtonText="DELETE FOR EVERYONE"

            thirdButtonText="CANCEL"
            firstBtnHandler={() => {
              const { message, type } = deleteDialog;
              deleteChatMessageService(message.senderId, message.receiverId, message._id, "deleteForMe");
              setDeleteDialog({
                open: false,
                message: null,
                type: ''
              });
            }}
            secondBtnHandler={() => {
              const { message, type } = deleteDialog;
              deleteChatMessageService(message.senderId, message.receiverId, message._id, "deleteForEveryone");
              setDeleteDialog({
                open: false,
                message: null,
                type: ''
              });
            }
            }
            thirdBtnHandler={() => {
              setDeleteDialog({
                open: false,
                message: null,
                type: ''
              });
            }} />
      }</>


      )}
      <div className="message-page" ref={scrollRef} data-testid="message-page">
        {chatMessages.map((chat, index) => (
          <div
            key={Utils.generateString(10)}
            style={{ border: "1px dashed black" }}
            className="message-chat"
            data-testid="message-chat"
          >
            {/* time by day */}

            {(index === 0 ||
              timeAgo.dayMonthYear(chat.createdAt) !==
              timeAgo.dayMonthYear(chatMessages[index - 1].createdAt)) && (
                <div className="message-date-group">
                  <div
                    className="message-chat-date"
                    data-testid="message-chat-date"
                  >
                    {timeAgo.chatMessageTransform(chat.createdAt)}
                  </div>
                </div>
              )}

            {/* data */}
            {(chat.receiverUsername === profile?.username ||
              chat.senderUsername === profile?.username) && (
                <>
                  {chat.senderUsername === profile?.username && (
                    <RightMessageDisplay
                      side="right"
                      chat={chat}
                      isLastChatMessage={
                        chatMessages[chatMessages.length - 1]._id == chat._id
                      }
                      profile={profile}
                      reactionRef={reactionRef}
                      messageIdx={index}
                      isShowReactionSelection={isShowReactionSelection}
                      setIsShowReactionSelection={setIsShowReactionSelection}
                      isBeingHovered={index == hoveringMessageIndex}
                      setHoveringMessageIndex={setHoveringMessageIndex}
                      postMessageReaction={postMessageReaction}
                      showDeleteMessageDialog={showDeleteMessageDialog}
                      showImageModal={showImageModal}
                      setShowImageModal={setShowImageModal}
                      setImageUrl={setImageUrl}
                    />
                  )}

                  {chat.receiverUsername === profile?.username && (

                    <LeftMessageDisplay
                      chat={chat}
                      isLastChatMessage={
                        chatMessages[chatMessages.length - 1]._id == chat._id
                      }
                      profile={profile}
                      reactionRef={reactionRef}
                      messageIdx={index}
                      isShowReactionSelection={isShowReactionSelection}
                      setIsShowReactionSelection={setIsShowReactionSelection}
                      isBeingHovered={index == hoveringMessageIndex}
                      setHoveringMessageIndex={setHoveringMessageIndex}
                      postMessageReaction={postMessageReaction}
                      showDeleteMessageDialog={showDeleteMessageDialog}
                      showImageModal={showImageModal}
                      setShowImageModal={setShowImageModal}
                      setImageUrl={setImageUrl}
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
  postMessageReaction: PropTypes.func,
  deleteChatMessageService: PropTypes.func,
};

export default MessageDisplay;
