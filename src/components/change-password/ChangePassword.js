import React, { useState } from 'react'
import "./ChangePassword.scss"
import Input from '@components/input/Input'
import Button from '@components/button/Button'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { Utils } from '@services/utils/utils.service'
import { userService } from '@services/api/user/user.service'
import useLocalStorage from '@hooks/useLocalStorage'
import useSessionStorage from '@hooks/useSessionStorage'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
const ChangePassword = () => {

  const { profile, token } = useSelector((state) => state.user);

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)





  const changePassword = async (event) => {
    event.preventDefault()
    try {

      const res = await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,

      },
       

      )
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      if (res) {
        Utils.updToastsNewEle(res.data.message, 'success', dispatch);
        setTimeout(async () => {
          Utils.clearStore(
            dispatch

          );
          await userService.logoutUser();
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      Utils.updToastsNewEle(error.response.data.message, 'error', dispatch);

    }

  }
  return (
    <div className="password-change-container">

      <form onSubmit={changePassword}>

        {/* current password */}
        <div className="form-group">
          <Input

            id="currentPassword"
            name="currentPassword"
            type={showPassword ? "text" : "password"}
            labelText="Current Password"
            placehoder=""
            value={currentPassword}
            handleChange={e => setCurrentPassword(e.target.value)}
          >
          </Input>
        </div>

        {/* new password */}

        <div className="form-group">
          <Input

            id="newPassword"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            labelText="New Password"
            placehoder=""
            value={newPassword}
            handleChange={e => setNewPassword(e.target.value)}
          >
          </Input>
        </div>


        {/* confirm password */}

        <div className="form-group">
          <Input

            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            labelText="Confirm Password"
            placehoder=""
            value={confirmPassword}
            handleChange={e => setConfirmPassword(e.target.value)}
          >
          </Input>
        </div>
        <div className="form-group form-btn-group">
          <div className="btn-group">
            <Button label="Update"
              className="update"
              disabled={!currentPassword || !newPassword || !confirmPassword}
            ></Button>

            <span className='eye-icon' onClick={() => setShowPassword(!showPassword)}>
              {!showPassword ? <FaRegEyeSlash /> : <FaRegEye />}

            </span>
          </div>
        </div>
      </form>




    </div>
    // <></>
  )
}

export default ChangePassword