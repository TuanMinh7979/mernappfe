import React, { useEffect, useState } from 'react'
import "./ReactionsAndCommentsDisplay.scss"
import { FaSpinner } from 'react-icons/fa';
import PropTypes from 'prop-types';
import like from "@assets/reactions/like.png"
import { Utils } from '@services/utils/utils.service';
import { useDispatch } from 'react-redux';
import { postService } from '@services/api/post/post.service';
import { reactionsMap } from '@services/utils/static.data';
import { updatePost } from '@redux/reducers/post/post.reducer';
import { useSelector } from 'react-redux';
import { feelingsList } from '@services/utils/static.data';
import { updateIsReactionsModalOpen, updateModalIsCommentsModalOpen } from '@redux/reducers/modal/modal.reducer';
const ReactionsAndCommentsDisplay = ({ post }) => {
  const { profile, token } = useSelector((state) => state.user);
  const [reactionsOfCurPost, setReactionsOfCurPost] = useState([])
  const [reactionsProp, setReactionsProp] = useState([]);
  const dispatch = useDispatch()
  const getReactionDocsOfCurPost = async () => {
    try {
      const response = await postService.getReactionDocsOfAPost(post?._id);

      setReactionsOfCurPost(response.data.reactions);
    } catch (error) {
      Utils.displayError(error ,dispatch);
    }
  };

  const sumAllReactions = (reactionsProp) => {
    if (reactionsProp?.length) {
      const result = reactionsProp.map((item) => item.value).reduce((prev, next) => prev + next);
      return Utils.shortenLargeNumbers(result);
    }
  };


  useEffect(() => {
    setReactionsProp(Utils.formattedReactions(post?.reactions))

  }, [post])


  const { isReactionsModalOpen } = useSelector(state => state.modal)
  const openReactionsCom = () => {
    dispatch(updatePost({ ...post, feelings: feelingsList.find((data) => post.feelings === data.name) }))
    dispatch(updateIsReactionsModalOpen(!isReactionsModalOpen))
  }


  // ? comment names
  const [postCommentNames, setPostCommentNames] = useState([]);
  // 1 person can comment multiple times so we need to use Set
  const getPostCommentNames = async () => {
    try {
      const response = await postService.getPostCommentsNames(post._id)
      setPostCommentNames([...new Set(response.data.comments.names)])
    } catch (e) {
     Utils.displayError(error ,dispatch);

    }
  }
  // ? end comment names


  // ? open comment details
  const { isCommentsModalOpen } = useSelector(state => state.modal)
  const openCommentsComponent = () => {
    dispatch(updatePost({ ...post, feelings: feelingsList.find((data) => post.feelings === data.name) }))
    dispatch(updateModalIsCommentsModalOpen(!isCommentsModalOpen));
  };

  // ? end comment details





  return (
    <div className="reactions-display">
      <div className="reaction">
        <div className="likes-block">
          <div className="likes-block-icons reactions-icon-display">
            {reactionsProp.length > 0 &&
              reactionsProp.map(reactRawItem => <>
                <div

                  key={Utils.generateString(10)}
                  className="tooltip-container">

                  <img
                    data-testid="reaction-img"
                    className="reaction-img"
                    src={reactionsMap[reactRawItem.type]} alt=""
                    onMouseEnter={() => getReactionDocsOfCurPost()}

                  />

                  <div className="tooltip-container-text tooltip-container-bottom" data-testid="reaction-tooltip">
                    <p className="title">
                      <img className="title-img" src={reactionsMap[reactRawItem.type]} alt="" />
                      {reactRawItem?.type}
                    </p>
                    <div className="likes-block-icons-list">
                      {reactionsOfCurPost.length === 0 &&
                        <FaSpinner className="circle-notch" />
                      }
                      {reactionsOfCurPost.length > 0 &&
                        <>

                          {reactionsOfCurPost.slice(0, 19).map((reactionDoc) => (
                            <div key={Utils.generateString(10)}>
                              {reactionDoc?.type === reactRawItem?.type && (
                                <span key={reactionDoc?._id}>{reactionDoc?.username}</span>
                              )}
                            </div>
                          ))}
                          {reactionsOfCurPost.length > 20 && <span>and {reactionsOfCurPost.length - 20} others...</span>}

                        </>
                      }

                    </div>
                  </div>
                </div>
              </>
              )}



          </div>
          {/* number of reaction */}

          <span data-testid="reactions-count"
            className="tooltip-container reactions-count"
            onMouseEnter={() => getReactionDocsOfCurPost()}
            onClick={openReactionsCom}
          >
            {sumAllReactions(reactionsProp)}
            <div className="tooltip-container-text tooltip-container-likes-bottom" data-testid="tooltip-container">
              <div className="likes-block-icons-list">


                {reactionsOfCurPost.length === 0 &&
                  <FaSpinner className="circle-notch" />
                }
                {reactionsOfCurPost.length > 0 &&
                  <>

                    {reactionsOfCurPost.slice(0, 19).map((reactionDoc) => (

                      <span key={Utils.generateString(10)}>{reactionDoc?.username}</span>

                    ))}
                    {reactionsOfCurPost.length > 20 && <span>and {reactionsOfCurPost.length - 20} others...</span>}

                  </>
                }
              </div>
            </div>
          </span>
          {/* end number of reaction */}
        </div>
      </div>
      <div className="comment tooltip-container" data-testid="comment-container"
      onClick={openCommentsComponent}
      >
        <span data-testid="comment-count">

          {post?.commentsCount > 0 && (
            <span onMouseEnter={getPostCommentNames} data-testid="comment-count">
              {Utils.shortenLargeNumbers(post?.commentsCount)} {`${post?.commentsCount === 1 ? 'Comment' : 'Comments'}`}
            </span>
          )}
        </span>
        <div className="tooltip-container-text tooltip-container-comments-bottom" data-testid="comment-tooltip">
          <div className="likes-block-icons-list">
            {postCommentNames.length === 0 && <FaSpinner className="circle-notch" />}
            {postCommentNames.length && (
              <>
                {postCommentNames.slice(0, 19).map((names) => (
                  <span key={Utils.generateString(10)}>{names}</span>
                ))}
                {postCommentNames.length > 20 && <span>and {postCommentNames.length - 20} others...</span>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ReactionsAndCommentsDisplay.propTypes = {
  post: PropTypes.object
};

export default ReactionsAndCommentsDisplay