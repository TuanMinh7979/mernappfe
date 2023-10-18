import React, { useEffect } from 'react'
import Button from '@components/button/Button'
import "./NotificationSetting.scss"
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Toggle from '@components/toggle/Toggle'
import { notificationItems } from '@services/utils/static.data'
import { userService } from '@services/api/user/user.service'
import { Utils } from '@services/utils/utils.service'
import {  updateLoggedUserProfile } from '@redux/reducers/user/user.reducer'
const NotificationSetting = () => {
  let { profile, token } = useSelector((state) => state.user);
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

  useEffect(() => {
    mapNotificationTypesToggle()
  }, [])




  const updateNotificationTypesToggle = (itemIndex) => {



    let newToggles = [...toggles]
    newToggles[itemIndex].toggle = !newToggles[itemIndex].toggle

    setToggles(newToggles)
  };


  const sendNotificationSettings = async () => {
    try {

      let settingsFromToggles = {}
      for (let el of toggles) {
        settingsFromToggles[el.type] = el.toggle
      }
      const response = await userService.updateNotificationSettings(settingsFromToggles);
      let newProfile = { ...profile, notifications: settingsFromToggles };

      dispatch(updateLoggedUserProfile(newProfile));
      Utils.updToastsNewEle(response.data.message, 'success', dispatch);
    } catch (error) {
   
      Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);
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
                  // let newNotificationSettings = { ...notificationSettings }
                  // newNotificationSettings[data.type] = !notificationSettings[data.type]
                  // setNotificationSettings({ ...newNotificationSettings })
                }}
              ></Toggle>
            </div>
          </div>
        </div>
      ))}
      <div className="btn-group">
        <Button label="Update" className="update" disabled={false} handleClick={sendNotificationSettings} />
      </div>
    </div>
      <div style={{ height: '1px' }}></div>
    </>

  )
}

export default NotificationSetting

// [
//   {
//       "index": 0,
//       "title": "Direct Messages",
//       "description": "New direct messages notifications.",
//       "toggle": true,
//       "type": "messages"
//   },
//   {
//       "index": 1,
//       "title": "Follows",
//       "description": "New followers notifications.",
//       "toggle": true,
//       "type": "follows"
//   },
//   {
//       "index": 2,
//       "title": "Post Reactions",
//       "description": "New reactions for your posts notifications.",
//       "toggle": true,
//       "type": "reactions"
//   },
//   {
//       "index": 3,
//       "title": "Comments",
//       "description": "New comments for your posts notifications.",
//       "toggle": true,
//       "type": "comments"
//   }
// ]