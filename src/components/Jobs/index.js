import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Jobs = ({employmentTypesList, salaryRangesList}) => {
  const [jobsList, setJobsList] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [searchInput, setSearchInput] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState([])
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('')

  const fetchJobs = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const employmentType = selectedEmploymentTypes.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${selectedSalaryRange}&search=${activeSearch}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobs = data.jobs.map(job => ({
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      setJobsList(updatedJobs)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [activeSearch, selectedEmploymentTypes, selectedSalaryRange])

  const onChangeEmploymentType = typeId => {
    setSelectedEmploymentTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId],
    )
  }

  const onChangeSalaryRange = rangeId => {
    setSelectedSalaryRange(rangeId)
  }

  const onClickSearch = () => {
    setActiveSearch(searchInput)
  }

  const onKeyDownSearch = e => {
    if (e.key === 'Enter') {
      setActiveSearch(searchInput)
    }
  }

  const renderJobsList = () => {
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h2 className="no-jobs-heading">No Jobs Found</h2>
          <p className="no-jobs-description">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }
    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <li key={job.id}>
            <JobCard jobData={job} />
          </li>
        ))}
      </ul>
    )
  }

  const renderContent = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
          </div>
        )
      case apiStatusConstants.success:
        return renderJobsList()
      case apiStatusConstants.failure:
        return (
          <div className="failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
              className="failure-img"
            />
            <h2 className="failure-heading">Oops! Something Went Wrong</h2>
            <p className="failure-description">
              We cannot seem to find the page you are looking for.
            </p>
            <button
              type="button"
              className="retry-btn"
              onClick={fetchJobs}
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
    <div className="jobs-page">
      <Header />
      <div className="jobs-content">
        <FiltersGroup
          employmentTypesList={employmentTypesList}
          salaryRangesList={salaryRangesList}
          selectedEmploymentTypes={selectedEmploymentTypes}
          selectedSalaryRange={selectedSalaryRange}
          onChangeEmploymentType={onChangeEmploymentType}
          onChangeSalaryRange={onChangeSalaryRange}
        />
        <div className="jobs-main">
          <div className="search-container">
            <input
              type="search"
              className="search-input"
              placeholder="Search"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={onKeyDownSearch}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={onClickSearch}
            >
              <BsSearch />
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default Jobs
