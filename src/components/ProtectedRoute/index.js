import { Route, Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const token = Cookies.get('jwt_token')

      if (!token) {
        return <Redirect to="/login" />
      }

      return <Component {...props} />
    }}
  />
)

export default ProtectedRoute