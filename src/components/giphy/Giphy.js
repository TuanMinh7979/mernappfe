import Input from '@components/input/Input';
import { GiphyUtils } from '@services/utils/giphy-utils.service';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import '@components/giphy/Giphy.scss';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '@redux/reducers/post/post.reducer';
import { updateModalIsGifModalOpen } from '@redux/reducers/modal/modal.reducer';

const Giphy = () => {
    const dispatch = useDispatch();
    const reduxModal = useSelector(state => state.post)
    const [gifs, setGifs] = useState([]);
    const [loading, setLoading] = useState(false);
    const updPostGifUrl = (gifUrl) => {
        dispatch(updatePost({ gifUrl: gifUrl, image: '' }))
        dispatch(updateModalIsGifModalOpen(!reduxModal.isGifModalOpen))
    }
    return (
        <>
            <div className="giphy-container" id="editable" data-testid="giphy-container">
                <div className="giphy-container-picker" style={{ height: '500px' }}>
                    <div className="giphy-container-picker-form">
                        <FaSearch className="search" />
                        <Input
                            id="gif"
                            name="gif"
                            type="text"
                            labelText=""
                            placeholder="Search Gif"
                            className="giphy-container-picker-form-input"
                            handleChange={(e) => GiphyUtils.searchGif(e.target.value, setGifs, setLoading)}
                        />
                    </div>

                    <ul className="giphy-container-picker-list" data-testid="unorderedList">
                        {gifs.map((gif, index) => (
                            <li
                                className="giphy-container-picker-list-item"
                                data-testid="list-item"
                                key={index}
                                onClick={() => updPostGifUrl(gif.images.original.url)}
                            >
                                <img style={{ width: '470px' }} src={`${gif.images.original.url}`} alt="" />
                            </li>
                        ))}
                    </ul>

                    {!gifs && !loading && (
                        <ul className="giphy-container-picker-list">
                            <li className="giphy-container-picker-list-no-item">No GIF found</li>
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};
export default Giphy;
