import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const FiltersGroup = ({
  employmentTypesList,
  salaryRangesList,
  selectedEmploymentTypes,
  selectedSalaryRange,
  onChangeEmploymentType,
  onChangeSalaryRange,
}) => {
  const [profileData, setProfileData] = useState(null)
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const fetchProfile = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profile = data.profile_details
      setProfileData({
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      })
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const renderProfile = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="profile-loader-container">
            <div data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
            </div>
          </div>
        )
      case apiStatusConstants.success:
        return (
          <div className="profile-container">
            <img
              src={profileData.profileImageUrl}
              alt="profile"
              className="profile-img"
            />
            <p className="profile-name">{profileData.name}</p>
            <p className="profile-bio">{profileData.shortBio}</p>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div className="profile-failure-container">
            <button
              type="button"
              className="retry-btn"
              onClick={fetchProfile}
            >
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="filters-group-container">
      {renderProfile()}
      <hr className="filter-divider" />
      <p className="filter-section-title">Type of Employment</p>
      <ul className="employment-type-list">
        {employmentTypesList.map(item => (
          <li key={item.employmentTypeId} className="employment-type-item">
            <input
              type="checkbox"
              id={item.employmentTypeId}
              className="filter-checkbox"
              checked={selectedEmploymentTypes.includes(item.employmentTypeId)}
              onChange={() => onChangeEmploymentType(item.employmentTypeId)}
            />
            <label htmlFor={item.employmentTypeId} className="filter-label">
              {item.label}
            </label>
          </li>
        ))}
      </ul>
      <hr className="filter-divider" />
      <p className="filter-section-title">Salary Range</p>
      <ul className="salary-range-list">
        {salaryRangesList.map(item => (
          <li key={item.salaryRangeId} className="salary-range-item">
            <input
              type="radio"
              id={item.salaryRangeId}
              name="salary"
              className="filter-radio"
              checked={selectedSalaryRange === item.salaryRangeId}
              onChange={() => onChangeSalaryRange(item.salaryRangeId)}
            />
            <label htmlFor={item.salaryRangeId} className="filter-label">
              {item.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FiltersGroup
