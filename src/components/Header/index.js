import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = ({history}) => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header">
      <Link to="/" className="header-logo-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo-img"
        />
        <span className="header-logo-text">Jobby</span>
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>
      </ul>
      <button type="button" className="logout-btn" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
