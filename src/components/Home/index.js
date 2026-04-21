import Header from '../Header'
import './index.css'

const Home = ({history}) => {
  const onClickFindJobs = () => {
    history.push('/jobs')
  }

  return (
    <div className="home-page">
      <Header />
      <div className="home-content">
        <div className="home-text-container">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
          <p className="home-description">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <button
            type="button"
            className="find-jobs-btn"
            onClick={onClickFindJobs}
          >
            Find Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
