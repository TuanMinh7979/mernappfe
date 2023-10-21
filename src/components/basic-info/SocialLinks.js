import BasicInfoSkeleton from '@components/basic-info/BasicInfoSkeleton';
import InfoDisplay from '@components/basic-info/InfoDisplay';
import { userService } from '@services/api/user/user.service';
import { Utils } from '@services/utils/utils.service';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
const SocialLinks = ({ editableSocialInputs, username, profile, loading, setEditableSocialInputs }) => {
  const dispatch = useDispatch();
  const noBasicInfo = {
    quoteMsg: '',
    workMsg: '',
    schoolMsg: '',
    locationMsg: ''
  };
  const noSocialInfo = {
    instagramMsg: 'No link available',
    twitterMsg: 'No link available',
    facebookMsg: 'No link available',
    youtubeMsg: 'No link available'
  };
  const editableInputs = {
    quote: '',
    work: '',
    school: '',
    location: ''
  };
  const editableSocialLinks = editableSocialInputs ?? {
    instagram: '',
    twitter: '',
    facebook: '',
    youtube: ''
  };
  const basicInfoPlaceholder = {
    quotePlacehoder: '',
    workPlacehoder: '',
    schoolPlacehoder: '',
    locationPlacehoder: ''
  };
  const socialLinksPlaceholder = {
    instagramPlacehoder: 'Instagram account link',
    twitterPlacehoder: 'Twitter account link',
    facebookPlacehoder: 'Facebook account link',
    youtubePlacehoder: 'YouTube account link'
  };
  
  const updateSocialLinks = async () => {
    try {
      const response = await userService.updateSocialLinks(editableSocialInputs);
      Utils.displaySuccess(response.data.message, dispatch)
    } catch (error) {
      Utils.displayError(error ,dispatch);
    }
  };

  return (
    <>
      {loading ? (
        <BasicInfoSkeleton />
      ) : (
        <InfoDisplay
          title="Social Links"
          type="social"
          isCurrentUser={username === profile?.username}
          noBasicInfo={noBasicInfo}
          noSocialInfo={noSocialInfo}
          basicInfoPlaceholder={basicInfoPlaceholder}
          socialLinksPlaceholder={socialLinksPlaceholder}
          editableInputs={editableInputs}
          editableSocialInputs={editableSocialLinks}
          loading={loading}
          setEditableSocialInputs={setEditableSocialInputs}
          updateInfo={updateSocialLinks}
        />
      )}
    </>
  );
};

SocialLinks.propTypes = {
  username: PropTypes.string,
  profile: PropTypes.object,
  loading: PropTypes.bool,
  editableSocialInputs: PropTypes.object,
  setEditableSocialInputs: PropTypes.func
};

export default SocialLinks;
