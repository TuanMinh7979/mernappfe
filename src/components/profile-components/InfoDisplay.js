import Button from '@root/base-components/button/Button';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { FaBriefcase, FaGraduationCap, FaInstagram, FaTwitter } from 'react-icons/fa';
import BasicInfoSkeleton from './BasicInfoSkeleton';
import { FaMapMarkerAlt, FaFacebook , FaYoutube } from 'react-icons/fa';
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

        <>
            {loading ? <BasicInfoSkeleton /> :
                <div className='side-container'>

                    <div className="side-container-header">

                        <p>{title}</p>
                        {isCurrentUser && (

                            <p className="editBtn" onClick={() => setEditIntroBtn(!editIntroBtn)}>Edit</p>

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

                    {/* instagram and work */}
                    <div className="side-container-body">

                        <div className="side-container-body-icon">

                            {type == "basic" ?
                                <FaBriefcase className='icon' />
                                : <FaInstagram className='icon instagram' />}
                        </div>
                        <div className="side-container-body-content">

                            {type == 'basic' && editIntroBtn && work && <>Works at</>}
                            {type == 'basic' && editIntroBtn && !work && <div className='no-infomation'>{workMsg}</div>}
                            {type != 'basic' && editIntroBtn && instagram &&

                                <a href={instagram} className='link'>

                                    {instagram}
                                </a>

                            }
                            {type != 'basic' && editIntroBtn && !instagram &&

                                <div className='no-infomation'>{instagramMsg}</div>

                            }
                            {editIntroBtn && !quote &&
                                <div className='no-infomation'>{quoteMsg}</div>
                            }

                            <ContentEditable

                                data-placeholder={type === 'basic' ? workPlacehoder : instagramPlacehoder}
                                tagName={!editIntroBtn ? 'div' : 'span'}
                                className='about'
                                disabled={editIntroBtn}
                                html={work || (instagram && !editIntroBtn ? instagram : '')}

                                style={{ maxHeight: '70px', overflowY: 'auto', width: '250px' }}
                                onChange={(event) => {
                                    if (type === 'basic') {
                                        setEditableInputs({ ...editableInputs, work: event.target.value });
                                    } else {
                                        setEditableSocialInputs({ ...editableSocialInputs, instagram: event.target.value });
                                    }
                                }}

                            >
                            </ContentEditable>
                        </div>
                    </div>

                    {/* school and twitter */}
                    <div className="side-container-body">

                        <div className="side-container-body-icon">

                            {type == "basic" ?
                                <FaGraduationCap className='icon' />
                                : <FaTwitter className='icon twitter' />}
                        </div>
                        <div className="side-container-body-content">

                            {type == 'basic' && editIntroBtn && school && <>Went to</>}
                            {type == 'basic' && editIntroBtn && !school && <div className='no-infomation'>{schoolMsg}</div>}
                            {type != 'basic' && editIntroBtn && twitter &&

                                <a href={twitter} className='link'>

                                    {twitter}
                                </a>

                            }
                            {type != 'basic' && editIntroBtn && !twitter &&

                                <div className='no-infomation'>{twitterMsg}</div>

                            }
                            {editIntroBtn && !quote &&
                                <div className='no-infomation'>{quoteMsg}</div>
                            }

                            <ContentEditable

                                data-placeholder={type === 'basic' ? schoolPlacehoder : twitterPlacehoder}
                                tagName={!editIntroBtn ? 'div' : 'span'}
                                className='about'
                                disabled={editIntroBtn}
                                html={school || (twitter && !editIntroBtn ? twitter : '')}

                                style={{ maxHeight: '70px', overflowY: 'auto', width: '250px' }}
                                onChange={(event) => {
                                    if (type === 'basic') {
                                        setEditableInputs({ ...editableInputs, school: event.target.value });
                                    } else {
                                        setEditableSocialInputs({ ...editableSocialInputs, twitter: event.target.value });
                                    }
                                }}

                            >
                            </ContentEditable>
                        </div>
                    </div>

                    {/* facebook */}
                    <div className="side-container-body">
                        <div className="side-container-body-icon">
                            {type === 'basic' ? <FaMapMarkerAlt className="icon" /> : <FaFacebook className="icon facebook" />}
                        </div>
                        <div className="side-container-body-content" data-testid="content-3">
                            {type === 'basic' && editIntroBtn && location && <>Lives in </>}
                            {type === 'basic' && editIntroBtn && !location && <div className="no-information">{locationMsg}</div>}
                            {type !== 'basic' && editIntroBtn && facebook && (
                                <a className="link" href={facebook} target="_blank" rel="noreferrer noopener">
                                    {facebook}
                                </a>
                            )}
                            {type !== 'basic' && editIntroBtn && !facebook && <div className="no-information">{facebookMsg}</div>}
                            <ContentEditable
                                data-testid="content-3-editable"
                                data-placeholder={type === 'basic' ? locationPlacehoder : facebookPlacehoder}
                                tagName={!editIntroBtn ? 'div' : 'span'}
                                disabled={editIntroBtn}
                                html={location || (facebook && !editIntroBtn ? facebook : '')}
                                style={{ maxHeight: '70px', overflowY: 'auto' }}
                                onChange={(e) => {
                                    if (type === 'basic') {
                                        setEditableInputs({ ...editableInputs, location: e.target.value });
                                    } else {
                                        setEditableSocialInputs({ ...editableSocialInputs, facebook: e.target.value });
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* youtube*/}
                    {type !== 'basic' && (
                        <div className="side-container-body">
                            <div className="side-container-body-icon">
                                <FaYoutube className="icon youtube" />
                            </div>
                            <div className="side-container-body-content" data-testid="content-4">
                                {editIntroBtn && youtube && (
                                    <a className="link" href={youtube} target="_blank" rel="noreferrer noopener">
                                        {youtube}
                                    </a>
                                )}
                                {editIntroBtn && !youtube && <div className="no-information">{youtubeMsg}</div>}
                                {!editIntroBtn && (
                                    <ContentEditable
                                        data-testid="content-4-editable"
                                        data-placeholder={youtubePlacehoder}
                                        tagName={!editIntroBtn ? 'div' : 'span'}
                                        disabled={editIntroBtn}
                                        html={youtube || ''}
                                        style={{ maxHeight: '70px', overflowY: 'auto' }}
                                        onChange={(e) => {
                                            setEditableSocialInputs({ ...editableSocialInputs, youtube: e.target.value });
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* save update button */}
                    {isCurrentUser && (
                        <div className="intro-submit-button">
                            <Button
                                label="Update"
                                className="button updateBtn"
                                disabled={editIntroBtn}
                                handleClick={() => {
                                    setEditIntroBtn(true);
                                    updateInfo();
                                }}
                            />
                        </div>
                    )}


                </div>
            }
        </>

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