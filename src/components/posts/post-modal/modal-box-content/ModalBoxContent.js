import Avatar from '@components/avatar/Avatar';
import SelectDropdown from '@components/select-dropdown/SelectDropdown';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { privacyList } from '@services/utils/static.data';
import { useCallback, useEffect, useRef } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useState } from 'react';
import { useSelector } from 'react-redux';


const ModalBoxContent = () => {
    const { profile } = useSelector((state) => state.user);
    const { privacy } = useSelector((state) => state.post);
    const { feeling } = useSelector((state) => state.modal);
    const privacyRef = useRef(null)
    const [selectedItem, setSelectedItem] = useState({
        topText: 'Public',
        subText: 'Any',
        icon: <FaGlobe className="globe-icon globe"></FaGlobe>
    })
    const [togglePrivary, setTogglePrivacy] = useDetectOutsideClick(privacyRef, false)
    const displayPostPrivary = useCallback(() => {
        if (privacy) {
            const postPrivacy = privacyList.filter(data => data.topText === privacy)[0]
            setSelectedItem(postPrivacy)
        }
    }, [privacy])

    useEffect(() => {
        displayPostPrivary();

    }, [displayPostPrivary])


    return (
        <div className="modal-box-content" data-testid="modal-box-content">
            <div className="user-post-image" data-testid="box-avatar">
                <Avatar name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff" size={40}
                    avatarSrc={profile?.profilePicture} />
            </div>
            <div className="modal-box-info">
                <h5 className="inline-title-display" data-testid="box-username">
                    {profile.usename}
                </h5>

                {feeling?.name
                    && <p className="inline-display" data-testid="box-feeling">
                        is feeling <img
                            className="feeling-icon"
                            src={`${feeling?.image}`}
                            alt="" />
                        <span>{feeling.name}</span>
                    </p>}
                <div data-testid="box-text-display" className="time-text-display"

                    onClick={() => setTogglePrivacy(!togglePrivary)}>
                    <div className="selected-item-text" data-testid="box-item-text">
                        {selectedItem.topText}
                    </div>
                    <div>
                        <SelectDropdown
                            ref={privacyRef}
                            isActive={togglePrivary}
                            items={privacyList}
                            setSelectedItem={setSelectedItem}
                        ></SelectDropdown>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ModalBoxContent;
