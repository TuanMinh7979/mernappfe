
import { useSelector } from 'react-redux';
import Button from '@root/base-components/button/Button';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaUserAlt, FaUserClock } from "react-icons/fa";
import './NotiDropdown.scss';
import { Utils } from '@services/utils/utils.service';
import useEffectOnce from '@hooks/useEffectOnce';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import { useNavigate } from 'react-router-dom';

const SettingDropdown = ({

  title,
  style,
  height,
  onLogout


}) => {

  const { profile } = useSelector((state) => state.user);
  const navigate = useNavigate()
  const [settingDropdownData, setSettingDropdownData] = useState([]);
  useEffectOnce(() => {
    setSettingDropdownData(
      [

        {
          topText: "Profile",
          subText: "Your Profile",
          icon: <FaUserAlt className="userIcon"></FaUserAlt>,
          onClickHdl: () => ProfileUtils.navigateToProfile(profile, navigate)

        },
        {
          topText: "Login token Info",
          subText: "View login token info",
          icon: <FaUserClock className="userIcon"></FaUserClock>,
          onClickHdl: () => {navigate("/login-info") }
        },

      ]


    )
  })
  return (
    <div className="social-dropdown" style={style} data-testid="dropdown">
      <div className="social-card">
        <div className="social-card-body">
          <div className="social-bg-primary">
            <h5>
              {title}

            </h5>
          </div>

          <div className="social-card-body-info">
            <div
              data-testid="info-container"
              className="social-card-body-info-container"
              style={{ maxHeight: `${height}px` }}
            >
              {settingDropdownData.map((item) => (
                <div className="social-sub-card" key={Utils.generateString(10)}>
                  <div className="content-avatar">
                    {item.icon}
                  </div>
                  <div
                    className="content-body"
                    onClick={item.onClickHdl}
                  >
                    <h6 className="title">{item?.topText}</h6>
                    <p className="subtext">{item?.subText}</p>
                  </div>
                </div>
              ))}
            </div>


            <div className="social-sub-button">
              <Button label="Sign out" className="button signOut" handleClick={onLogout} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

SettingDropdown.propTypes = {


  title: PropTypes.string,
  style: PropTypes.object,
  height: PropTypes.number,

  onLogout: PropTypes.func,

};

export default SettingDropdown;
