import {useState} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Login = ({history}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showError, setShowError] = useState(false)

  if (Cookies.get('jwt_token') !== undefined) {
    return <Redirect to="/" />
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  const onSubmitFailure = errMsg => {
    setShowError(true)
    setErrorMsg(errMsg)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo-img"
          />
          <span className="login-logo-text">Jobby</span>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username" className="input-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="input-field"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {showError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
