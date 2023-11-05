import Input from '@root/base-components/input/Input';
import Spinner from '@root/base-components/spinner/Spinner';
import { GiphyUtils } from '@services/utils/giphy-utils.service';
import { Utils } from '@services/utils/utils.service';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './GiphyContainer.scss';
import GiphyImage from '@components/giphy/GiphyImage';
const GiphyContainer = ({ handleGiphyClick }) => {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {

  //   GiphyUtils.getTrendingGifs(setGifs, setLoading);
  // }, []);


  const [searchTxt, setSearchTxt] = useState("")

  useEffect(() => {
    if (searchTxt) {
      const timer = setTimeout(() => GiphyUtils.searchGifs(searchTxt, setGifs, setLoading), 500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [searchTxt]);


  return (
    <div className="giphy-search-container" data-testid="giphy-container">
      <div className="giphy-search-input">
        <FaSearch className="search" />
        <Input
          id="gif"
          name="gif"
          type="text"
          labelText=""
          placeholder="Search Gif"
          className="search-input"
          handleChange={(e) => setSearchTxt(e.target.value)}
        />
      </div>
      {loading && <Spinner />}

      <ul className="search-results">
        {gifs.length >0 && gifs.map((gif) => (
          <li
            style={{ width: '500px' }}
            className="gif-result"
            data-testid="list-item"
            key={Utils.generateString(10)}
            onClick={() => handleGiphyClick(gif.images.original.url)}
          >
            <GiphyImage url={gif.images.original.url}></GiphyImage>

          </li>
        ))}
      </ul>
    </div>
  );
};

GiphyContainer.propTypes = {
  handleGiphyClick: PropTypes.func
};

export default GiphyContainer;
