import Input from '@root/base-components/input/Input';
import { GiphyUtils } from '@services/utils/giphy-utils.service';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Spinner from '@root/base-components/spinner/Spinner';
import './Giphy.scss';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '@redux/reducers/post/post.reducer';
import { updateModalIsGifModalOpen } from '@redux/reducers/modal/modal.reducer';
import { useEffect } from 'react';
import GiphyImage from './GiphyImage';
const Giphy = () => {
    const dispatch = useDispatch();

    const [gifs, setGifs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTxt, setSearchTxt] = useState('')
    const updPostGifUrl = (gifUrl) => {

        dispatch(updatePost({ gifUrl: gifUrl, image: '' }))
        dispatch(updateModalIsGifModalOpen(false))
    }

    useEffect(() => {

        GiphyUtils.getTrendingGifs(setGifs, setLoading);
    }, []);

    useEffect(() => {
        if (searchTxt) {
            const timer = setTimeout(() => GiphyUtils.searchGifs(searchTxt, setGifs, setLoading), 500);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [searchTxt]);
    return (
        <>
            <div className="giphy-container" id="editable" data-testid="giphy-container">
                <div className="giphy-container-picker" style={{ height: '500px' }}>
                    <div className="giphy-container-picker-form">
                        <FaSearch className="search searchgif-btn" />
                        <Input
                            id="gif"
                            name="gif"
                            type="text"
                            labelText=""
                            placeholder="Search Gif"
                            className="giphy-container-picker-form-input"
                            handleChange={(e) => setSearchTxt(e.target.value)}

                        />
                    </div>
                    {loading && <Spinner />}
                    <ul className="giphy-container-picker-list" data-testid="unorderedList">
                        {gifs.length > 0 && gifs.map((gif, index) => (
                            <li
                               
                                className="giphy-container-picker-list-item"
                                data-testid="list-item"
                                key={index}
                                onClick={() => updPostGifUrl(gif.images.original.url)}
                            >
                                {/* <img style={{ width: '470px', border: "1px solid black"}} src={`${gif.images.original.url}`} alt="" /> */}
                                <GiphyImage  url={gif.images.original.url}></GiphyImage>
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
