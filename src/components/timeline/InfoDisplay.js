import Button from '@components/button/Button';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ContentEditable from 'react-contenteditable';

const InfoDisplay = ({
    title,
    type,
    isCurrentUser,
    noBasicInfo,
    noSocialInfo,
    basicInfoPlaceholder,
    socialLinksPlaceholder,
    editableInputs,
    editableSocialInputs,
    loading,
    setEditableInputs,
    setEditableSocialInputs,
    updateInfo
}) => {

    const [editIntroBtn, setEditIntroBtn] = useState(true);
    const { quote, work, school, location } = editableInputs;
    const { quoteMsg, workMsg, schoolMsg, locationMsg } = noBasicInfo;
    const { instagramMsg, twitterMsg, facebookMsg, youtubeMsg } = noSocialInfo;
    const { instagram, twitter, facebook, youtube } = editableSocialInputs;
    const { quotePlacehoder, workPlacehoder, schoolPlacehoder, locationPlacehoder } = basicInfoPlaceholder;
    const { instagramPlacehoder, twitterPlacehoder, facebookPlacehoder, youtubePlacehoder } = socialLinksPlaceholder;


    return (
        <div className='side-container'>

            <div className="side-container-header">

                <p>{title}</p>
                {isCurrentUser && (

                    <p className="editBtn" onClick={() => setEditInfoBtn(!editIntroBtn)}>Edit</p>

                )}

            </div>

            {type == 'basic' &&
                <div className="side-container-body">
                    <div className="side-container-body-about">

                        {editIntroBtn && !quote &&
                            <div className='no-infomation'>{quoteMsg}</div>
                        }

                        <ContentEditable

                            data-placeholder={quotePlacehoder}
                            tagName="div"
                            className='about'
                            disabled={editIntroBtn}
                            html={quote || ''}
                            style={{ maxHeight: '70px', overflowY: 'auto', width: '250px' }}
                            onChange={(event) => {
                                setEditableInputs({
                                    ...editableInputs,
                                    quote: event.target.value
                                })
                            }}

                        >
                        </ContentEditable>
                    </div>
                </div>
            }



        </div>
    )
}
InfoDisplay.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    isCurrentUser: PropTypes.bool,
    noBasicInfo: PropTypes.object,
    noSocialInfo: PropTypes.object,
    basicInfoPlaceholder: PropTypes.object,
    socialLinksPlaceholder: PropTypes.object,
    editableInputs: PropTypes.object,
    editableSocialInputs: PropTypes.object,
    loading: PropTypes.bool,
    setEditableInputs: PropTypes.func,
    setEditableSocialInputs: PropTypes.func,
    updateInfo: PropTypes.func
};

export default InfoDisplay