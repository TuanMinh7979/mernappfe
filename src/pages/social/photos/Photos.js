import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Utils } from '@services/utils/utils.service'
import { PostUtils } from '@services/utils/post-utils.service'
import { postService } from '@services/api/post/post.service'
import { followerService } from '@services/api/follow/follow.service'
import useEffectOnce from '@hooks/useEffectOnce'
import GalleryImage from '@components/gallery-image/GalleryImage'
import "./Photos.scss"
import ImageModal from '@components/image-modal/ImageModal'
import { useRef } from 'react'
import useInfiniteScroll from '@hooks/useInfiniteScroll'
import { uniqBy } from 'lodash';
const Photos = () => {
  const { profile } = useSelector(state => state.user)
  const [posts, setPosts] = useState([])
  const [postsCnt, setPostCnt] = useState(1)
  const [loggedUserIdols, setLoggedUserIdols] = useState([])
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const validatePosts = (posts, loggedUserIdolsArr) => {

    let validPosts = posts.filter((el, idx) => {

      return (!Utils.checkIfUserIsBlocked(profile.blockedBy, el.userId) ||
        el?.userId === profile._id) && PostUtils.checkPrivacy(el, profile, loggedUserIdolsArr)
    })
    return [...validPosts]
  }
  useEffectOnce(() => {
    async function initFetch() {
      try {
        const res1 = await postService.getsWithImage(1)

        const res2 = await followerService.getLoggedUserFollowee()
        setLoggedUserIdols(res2.data.following)
        setPosts(validatePosts(res1.data.posts, res2.data.following))
        setPostCnt(res1.data.cnt)


        setLoading(false)
      } catch (error) {
        setLoading(false)
        Utils.displayError(error, dispatch);
      }
    }
    initFetch()
  }

  )



  const [galleryImageToShow, setGalleryImageToShow] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const getShowingImageUrlFromPost = (post) => {
    return post?.gifUrl ? post?.gifUrl : Utils.getImage(post?.imgId, post?.imgVersion)

  }

  const onClickRight = () => {
    console.log("..........", posts.length);
    setCurrentShowImageIdx(prev => prev + 1)
    setGalleryImageToShow(getShowingImageUrlFromPost(posts[currentImageIdx + 1]))
  }
  const onClickLeft = () => {
    console.log("..........", posts.length);
    setCurrentShowImageIdx(prev => prev - 1)
    setGalleryImageToShow(getShowingImageUrlFromPost(posts[currentImageIdx - 1]))
  }

  const [currentImageIdx, setCurrentShowImageIdx] = useState(0)
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);


  const [currentPage, setCurrentPage] = useState(1);


  const fetchPhotos = async () => {

    let pageNum = currentPage
    if (currentPage <= Math.ceil(postsCnt / Utils.POST_PAGE_SIZE)) {
      pageNum += 1
      try {
        const res1 = await postService.getsWithImage(pageNum)


        let abc = uniqBy([...posts, ...res1.data.posts], '_id');


        setPosts(validatePosts([...abc], loggedUserIdols));
        setCurrentPage(pageNum)
      } catch (error) {

        Utils.displayError(error, dispatch);
      }
    }
  }
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPhotos)


  console.log([...posts].length);
  return (
    <>
      <div className="photos-container" ref={bodyRef}>

        {showImageModal && <ImageModal
          image={galleryImageToShow}
          showArrow={true}
          onClickRight={onClickRight}
          onClickLeft={onClickLeft}
          isLastItemRight={currentImageIdx == posts.length - 1}
          isLastItemLeft={currentImageIdx == 0}
          onCancel={() => {
            setShowImageModal(false)
          }}

        />}
        <div className="photos">  Photos   </div>
        {posts.length > 0 &&
          <div className="gallery-images scroll-3" >
            {posts.map((el, idx) =>
              <GalleryImage
                post={el}
                showCaption={true}
                showDelete={false}
                imgSrc={getShowingImageUrlFromPost(el)}
                onClick={() => {
                  setCurrentShowImageIdx(idx)
                  setShowImageModal(!showImageModal)
                  setGalleryImageToShow(getShowingImageUrlFromPost(el))
                }}

              />
            )}

            <div
              ref={bottomLineRef}
              style={{ marginBottom: "150px", height: "150px" }}
            ></div>
          </div>
        }


        {loading && !posts.length && <div className="card-element" style={{ height: '350px' }}></div>}

        {!loading && !posts.length && (
          <div className="empty-page" data-testid="empty-page">
            No photos to display
          </div>
        )}



      </div>
    </>

  )
}

export default Photos