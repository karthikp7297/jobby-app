import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const JobItemDetails = ({match}) => {
  const {id} = match.params
  const [jobDetails, setJobDetails] = useState(null)
  const [similarJobs, setSimilarJobs] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

  const fetchJobDetails = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const job = data.job_details
      setJobDetails({
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
        skills: job.skills.map(s => ({name: s.name, imageUrl: s.image_url})),
        lifeAtCompany: {
          description: job.life_at_company.description,
          imageUrl: job.life_at_company.image_url,
        },
      })
      setSimilarJobs(
        data.similar_jobs.map(sj => ({
          id: sj.id,
          companyLogoUrl: sj.company_logo_url,
          employmentType: sj.employment_type,
          jobDescription: sj.job_description,
          location: sj.location,
          rating: sj.rating,
          title: sj.title,
        })),
      )
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    fetchJobDetails()
  }, [id])

  const renderSuccess = () => (
    <div className="job-details-content">
      <div className="job-details-card">
        <div className="job-details-top">
          <img
            src={jobDetails.companyLogoUrl}
            alt="job details company logo"
            className="job-details-logo"
          />
          <div className="job-details-title-rating">
            <h2 className="job-details-title">{jobDetails.title}</h2>
            <div className="rating-container">
              <AiFillStar className="star-icon" />
              <span className="rating-text">{jobDetails.rating}</span>
            </div>
          </div>
        </div>
        <div className="job-details-meta">
          <div className="meta-left">
            <div className="meta-item">
              <MdLocationOn className="meta-icon" />
              <span>{jobDetails.location}</span>
            </div>
            <div className="meta-item">
              <BsBriefcaseFill className="meta-icon" />
              <span>{jobDetails.employmentType}</span>
            </div>
          </div>
          <span className="package-text">{jobDetails.packagePerAnnum}</span>
        </div>
        <hr className="job-details-divider" />
        <div className="description-header">
          <h3 className="section-heading">Description</h3>
          <a
            href={jobDetails.companyWebsiteUrl}
            target="_blank"
            rel="noreferrer"
            className="visit-link"
          >
            Visit <BsBoxArrowUpRight />
          </a>
        </div>
        <p className="job-details-description">{jobDetails.jobDescription}</p>
        <h3 className="section-heading">Skills</h3>
        <ul className="skills-list">
          {jobDetails.skills.map(skill => (
            <li key={skill.name} className="skill-item">
              <img
                src={skill.imageUrl}
                alt={skill.name}
                className="skill-img"
              />
              <span className="skill-name">{skill.name}</span>
            </li>
          ))}
        </ul>
        <div className="life-at-company">
          <h3 className="section-heading">Life at Company</h3>
          <div className="life-content">
            <p className="life-description">
              {jobDetails.lifeAtCompany.description}
            </p>
            <img
              src={jobDetails.lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-img"
            />
          </div>
        </div>
      </div>
      <div className="similar-jobs-section">
        <h2 className="similar-jobs-heading">Similar Jobs</h2>
        <ul className="similar-jobs-list">
          {similarJobs.map(sj => (
            <li key={sj.id} className="similar-job-card">
              <div className="similar-job-top">
                <img
                  src={sj.companyLogoUrl}
                  alt="similar job company logo"
                  className="similar-logo"
                />
                <div>
                  <p className="similar-title">{sj.title}</p>
                  <div className="rating-container">
                    <AiFillStar className="star-icon" />
                    <span className="rating-text">{sj.rating}</span>
                  </div>
                </div>
              </div>
              <p className="similar-description-title">Description</p>
              <p className="similar-description-text">{sj.jobDescription}</p>
              <div className="similar-meta">
                <div className="meta-item">
                  <MdLocationOn className="meta-icon" />
                  <span>{sj.location}</span>
                </div>
                <div className="meta-item">
                  <BsBriefcaseFill className="meta-icon" />
                  <span>{sj.employmentType}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
          </div>
        )
      case apiStatusConstants.success:
        return renderSuccess()
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
              onClick={fetchJobDetails}
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
    <div className="job-details-page">
      <Header />
      {renderContent()}
    </div>
  )
}

export default JobItemDetails
