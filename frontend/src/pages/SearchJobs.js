import { useState, useEffect } from 'react'
import ViewMoreDetail from './ViewMoreDetail';
import './../css/searchJobs.css';
import backbtn from './../icons/arrow_back_yellow.svg';
import next_btn from './../icons/page_next.svg';
import prev_btn from './../icons/page_prev.svg';
import first_btn from './../icons/page_first.svg';
import { useNavigate } from 'react-router-dom';
import Navbar from './../components/Navbar'
const SearchJobs = () => {

    const [keyword, setKeyword] = useState('')
    const [location, setLocation] = useState('')
    const [jobs, setJobs] = useState([])
    const [error, setError] = useState('')
    const [selectedJob, setSelectedJob] = useState(null)
    const [showPopup, setShowPopup] = useState(false);
    const [showLoading, setShowLoading] = useState(false)
    const navigate = useNavigate()
    

    const handleScroll = () =>{
        const element = document.getElementById('scroll_here');
        if (element) {
            // 👇 Will scroll smoothly to the top of the next section
            element.scrollIntoView({ behavior: 'smooth' });
        }

    }
    

    //////////////////// pagination /////////////////////////
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Calculate the range of jobs to display based on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const jobsToShow = jobs.slice(startIndex, endIndex);

    // Define handlers for changing pages
    const goToPreviousPage = () => {

        if (currentPage - 1 > 0){
            setCurrentPage(currentPage - 1);
            handleScroll()
        }
    };
    const goToFirstPage = () => {
        setCurrentPage(1)
        handleScroll()
    }

    const goToNextPage = () => {
        if (endIndex < jobs.length){
            setCurrentPage(currentPage + 1);
            handleScroll()

        }
    };

    // Disable the previous button on the first page, and the next button on the last page
    const isPreviousDisabled = currentPage === 1;
    const isNextDisabled = endIndex >= jobs.length;

    ///////////////////////////////////////


    const handlePopupOpen = (event, job) => {
        console.log(job)
        event.preventDefault();
        setSelectedJob(job);
        setShowPopup(true);
    };

    const handlePopupClose = (event) => {
        event.preventDefault();
        setShowPopup(false);
    };

    const navBack = (event) =>{
        event.preventDefault()
        navigate(-1)
    }

    const HandleSubmit = async (e) => {
        setShowLoading(true)
        e.preventDefault()
        const response = await fetch('/api/routes/searchjobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyword,
                location,
            })
        }).then((res) => res.json())

        if (response.status === 'ok') {
            setShowLoading(false)
            // everythign went fine
            // alert('Success')
            // const json = await response.json()
            console.log("verify json :", response.data)
            setJobs(response.data.jobs);
            //
            // setType(response.accountType)

        } else {
            alert(response.error)

        }
    }

    function SkillsList({ skills }) {
        if (!skills) {
            return
        }

        return (
            <div className="skills_main">
                <h3>skills: </h3>
                <div className='skills_container' id="search-jobs">
                    {skills.map((skill, index) => (
                        <div key={index}>
                            {/* {index % 5 == 0 && index != 0 && <br />} */}
                            <p className='individual_skill'>{skill}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const handleApply = (event, url) => {
        event.preventDefault();
        window.open(url, '_blank', 'noreferrer')
        // window.location.href = url;
    };



    useEffect(() => {
        // here we can prefetch some of the jobs stored in our database and load them to our page
    }, [])

    return (
        <div>
            <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            <img className='backbtn' src={backbtn} onClick={navBack} alt="back button" />

            {/* insert loading gif code here */}
            {showLoading && <span class="loader"></span>}
            {/*  */}

            <div className="searchJobsMain">

                <h2>Find Your Dream Job!!!</h2>
                <form className="searchJobForm" onSubmit={HandleSubmit}>

                    <input
                        className='keywordField'
                        type="text"
                        name='keyword'
                        onChange={(e) => setKeyword(e.target.value)}
                        value={keyword}
                        placeholder='enter job title'
                    />

                    <input
                        className='locationField'
                        type="text"
                        name='location'
                        onChange={(e) => setLocation(e.target.value)}
                        value={location}
                        placeholder='enter location'
                    />

                    <button className='searchBtn' id='scroll_here'>search</button>


                    {error && <div className="error">{error}</div>}

                </form>

                {showPopup && <ViewMoreDetail onClose={handlePopupClose} thisJob={selectedJob} />}
                <div className='all_searchJobs'>
                    {jobsToShow.map((job, index) => (
                        <div key={index} className='individual_job_serachJob'>
                            <a href={job["anchor_link"]}><h3>Title: {job["job_title"]}</h3></a>
                            <h3><span>Company Name: </span>{job["company_name"]}</h3>
                            <p>{job["job_description"]}...</p>
                            <SkillsList skills={job["skills"]} />
                            <div className='searchJob_btnHolder'>
                                <button onClick={event => handlePopupOpen(event, job)}>View Details</button>
                                <button onClick={event => handleApply(event, job["anchor_link"])}>Apply</button>
                            </div>

                            {/* <button onClick={event => handleApply(event,job["anchor_link"])}>view more</button> */}
                        </div>
                    ))}
                {jobs.length > 0 &&
                    <div className="pagination">
                        <div class="tooltip">
                            <img className='pagination_first_btn pagination_btn' src={first_btn} onClick={goToFirstPage} disabled={isPreviousDisabled} alt="previous button" />
                            <span class="tooltiptext">Start of jobs</span>
                        </div>
                        <div class="tooltip">
                            <img className='pagination_prev_btn pagination_btn' src={prev_btn} onClick={goToPreviousPage} disabled={isPreviousDisabled} alt="previous button" />
                            <span class="tooltiptext">previous set of jobs</span>
                        </div>
                        <div class="tooltip">
                            <img className='pagination_next_btn pagination_btn' src={next_btn} onClick={goToNextPage} disabled={isNextDisabled} alt="next button" />
                            <span class="tooltiptext">next set of jobs</span>
                        </div>
                        
                        {/* <button onClick={goToFirstPage} disabled={isPreviousDisabled}>Go to start</button>
                        <button onClick={goToPreviousPage} disabled={isPreviousDisabled}>previous jobs</button>
                        <button onClick={goToNextPage} disabled={isNextDisabled}>next jobs</button> */}

                    </div>
                }
                </div>
    </div> 

            </div>

    )
}

export default SearchJobs
