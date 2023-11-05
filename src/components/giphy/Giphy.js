import Input from '@root/base-components/input/Input';
import { GiphyUtils } from '@services/utils/giphy-utils.service';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Spinner from '@root/base-components/spinner/Spinner';
import './Giphy.scss';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '@redux/reducers/post/post.reducer';
import { updateModalIsGifModalOpen } from '@redux/reducers/modal/modal.reducer';

const Giphy = () => {
    const dispatch = useDispatch();

    const [gifs, setGifs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTxt, setSearchTxt] = useState('')
    const updPostGifUrl = (gifUrl) => {

        dispatch(updatePost({ gifUrl: gifUrl, image: '' }))
        dispatch(updateModalIsGifModalOpen(false))
    }
    return (
        <>
            <div className="giphy-container" id="editable" data-testid="giphy-container">
                <div className="giphy-container-picker" style={{ height: '500px' }}>
                    <div className="giphy-container-picker-form">
                        <FaSearch className="search searchgif-btn"  />
                        <Input
                            id="gif"
                            name="gif"
                            type="text"
                            labelText=""
                            placeholder="Search Gif"
                            className="giphy-container-picker-form-input"
                            handleChange={(e) => GiphyUtils.searchGifs(e.target.value, setGifs, setLoading)}

                        />
                    </div>
                    {loading && <Spinner />}
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
