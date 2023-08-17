import React from 'react'
import ReactionList from './reaction-list/ReactionList'
import { useState } from 'react'
import { reactionsMap } from '@services/utils/static.data'
import { Utils } from '@services/utils/utils.service'
import { useSelector } from 'react-redux'
import { postService } from '@services/api/post/post.service'
import { orderBy } from "lodash"
import useEffectOnce from '@hooks/useEffectOnce'
import ReactionWrapper from '@components/posts/modal-wrappers/reaction-wrapper/ReactionWrapper'
import { useDispatch } from 'react-redux'
import "./ReactionModal.scss"
import { closeModal } from '@redux/reducers/modal/modal.reducer'
import { emptyPost } from '@redux/reducers/post/post.reducer'
const ReactionModal = () => {
    const dispatch = useDispatch()
    const { _id, reactions } = useSelector(state => state.post)
    const [activeViewAllTab, setActiveViewAllTab] = useState(true)
    const [formattedReactions, setFormattedReactions] = useState([])
    const [reactionType, setReactionType] = useState("")
    const [reactionColor, setReactionColor] = useState("")


    const [reactionsOfCurPost, setReactionsOfCurPost] = useState([])
    const [oriReactionsOfCurPost, setOriReactionsOfCurPost] = useState([])
    const getReactionDocsOfCurPost = async () => {
        try {
            const response = await postService.getReactionDocsOfAPost(_id);

            const orderedPosts = orderBy(response.data?.reactions, ['createdAt'], ['desc']);
            setReactionsOfCurPost(orderedPosts);
            setOriReactionsOfCurPost(orderedPosts);

        } catch (error) {
            Utils.updToastsNewEle(error?.response?.data?.message, 'error', dispatch);
        }
    };
    useEffectOnce(() => {
        getReactionDocsOfCurPost()
        setFormattedReactions(Utils.formattedReactions(reactions))
    })

    const closeReactionsModal = () => {
        dispatch(closeModal());
        dispatch(emptyPost());
    };

    const onViewAllClick = () => {
        setActiveViewAllTab(true);
        setReactionType('');
        reactionsOfCurPost(oriReactionsOfCurPost);
    }



    const reactionList = (type) => {
        setActiveViewAllTab(false);
        setReactionType(type);
        const exist = oriReactionsOfCurPost.some((reaction) => reaction.type === type);
        const filteredReactions = exist ? oriReactionsOfCurPost.filter((reaction) => reaction.type === type) : [];
        setReactionsOfCurPost(filteredReactions);
        setReactionColor(reactionColor[type]);
    };

    return (
        <div><ReactionWrapper closeModal={closeReactionsModal}>
            <div className='modal-reactions-headers-tabs'>

                <ul className='modal-reactions-header-tabs-list'>
                    <li className={`${activeViewAllTab}?"activeViewAllTab":"all"`}
                        onClick={onViewAllClick}
                    >
                        All
                    </li>
                    {formattedReactions.map((el, idx) => (

                        <li
                            key={idx}
                            className={`${el.type === reactionType ? 'activeTab' : ''}`}
                            style={{ color: `${el.type === reactionType ? reactionColor : ''} ` }}
                            onClick={() => reactionList(el.type)}

                        >
                            <img src={reactionsMap[el.type]} alt="" />
                            <span>{Utils.shortenLargeNumbers(el?.value)}</span>

                        </li>
                    ))}
                </ul>

            </div>
            <div className='modal-reactions-list'>
                <ReactionList postReactions={reactionsOfCurPost} />
            </div>
            <div></div>
        </ReactionWrapper></div>
    )
}

export default ReactionModal