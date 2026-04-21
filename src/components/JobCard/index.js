import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobCard = ({jobData}) => {
  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobData

  return (
    <Link to={`/jobs/${id}`} className="job-card">
      <div className="job-card-top">
        <img
          src={companyLogoUrl}
          alt="company logo"
          className="company-logo"
        />
        <div className="job-title-rating">
          <h3 className="job-title">{title}</h3>
          <div className="rating-container">
            <AiFillStar className="star-icon" />
            <span className="rating-text">{rating}</span>
          </div>
        </div>
      </div>
      <div className="job-meta">
        <div className="job-meta-left">
          <div className="meta-item">
            <MdLocationOn className="meta-icon" />
            <span>{location}</span>
          </div>
          <div className="meta-item">
            <BsBriefcaseFill className="meta-icon" />
            <span>{employmentType}</span>
          </div>
        </div>
        <span className="package-text">{packagePerAnnum}</span>
      </div>
      <hr className="job-card-divider" />
      <p className="job-description-title">Description</p>
      <p className="job-description-text">{jobDescription}</p>
    </Link>
  )
}

export default JobCard
