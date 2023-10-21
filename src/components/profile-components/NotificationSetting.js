import React, { useEffect } from 'react'
import Button from '@root/base-components/button/Button'
import "./styles/NotificationSetting.scss"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Toggle from '@root/base-components/toggle/Toggle'
import { notificationItems } from '@services/utils/static.data'
import { userService } from '@services/api/user/user.service'
import { Utils } from '@services/utils/utils.service'
import { updateLoggedUserProfile } from '@redux/reducers/user/user.reducer'
import useEffectOnce from '@hooks/useEffectOnce'
const NotificationSetting = () => {
  const { profile } = useSelector((state) => state.user);
  const [toggles, setToggles] = useState([]);
  let [notificationSettings, setNotificationSettings] = useState(profile?.notifications);
  const dispatch = useDispatch();

  const mapNotificationTypesToggle = () => {
    let notificationItemsCp = [...notificationItems]
    for (const el of notificationItemsCp) {
      el.toggle = notificationSettings[el.type];
    }
    setToggles(notificationItemsCp);
  }

  useEffectOnce(() => {
    mapNotificationTypesToggle()
  })


  const updateNotificationTypesToggle = (itemIndex) => {
    let newToggles = [...toggles]
    newToggles[itemIndex].toggle = !newToggles[itemIndex].toggle
    setToggles(newToggles)
  };


  const updateNotificationSettings = async () => {
    try {
      let settingsFromToggles = {}
      for (let el of toggles) {
        settingsFromToggles[el.type] = el.toggle
      }
      const response = await userService.updateNotificationSettings(settingsFromToggles);
      let newProfile = { ...profile, notifications: settingsFromToggles };
      dispatch(updateLoggedUserProfile(newProfile));
      Utils.displaySuccess(response.data.message, dispatch)
    } catch (error) {
      Utils.displayError(error, dispatch);
    }
  };


  return (
    <>    <div className="notification-settings">
      {toggles.map((data, idx) => (
        <div className="notification-settings-container" key={data.index} data-testid="notification-settings-item">
          <div className="notification-settings-container-sub-card">
            <div className="notification-settings-container-sub-card-body">
              <h6 className="title">{`${data.title}`}</h6>
              <div className="subtitle-body">
                <p className="subtext">{data.description}</p>
              </div>
            </div>
            <div className="toggle" data-testid="toggle-container">
              <Toggle

                toggle={data.toggle}
                onClick={() => {
                  updateNotificationTypesToggle(idx)

                }}
              ></Toggle>
            </div>
          </div>
        </div>
      ))}
      <div className="btn-group">
        <Button label="Update" className="update" disabled={false} handleClick={updateNotificationSettings} />
      </div>
    </div>
      <div style={{ height: '1px' }}></div>
    </>

  )
}

export default NotificationSetting

