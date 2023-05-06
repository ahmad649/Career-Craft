import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'
import EditJob from './EditJob';
import Navbar from './../../components/Navbar'
import backbtn from './../../icons/arrow_back_yellow.svg';
import './../../css/recruiterGetJobs.css'


const GetJobs = () => {

    const navigate = useNavigate()
    const [keyword, setKeyword] = useState('')
    const [location, setLocation] = useState('')
    const [jobs, setJobs] = useState([])
    const [error, setError] = useState('')
    const [selectedJob, setSelectedJob] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))
    const [showPopup, setShowPopup] = useState(false);



    function SkillsList({ skills }) {
        if (!skills) {
            return
        }

        return (
            <div className="skills_main">
                <h3>skills: </h3>
                <div className='skills_container'>
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


    const verifyAccessAttempt = async () => {

        const response = await fetch('/api/routes/verifyuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                accountType,
            })
        })

        if (!response.ok) {
            console.error("error");
            navigate('/login')
            alert("unauthorized request, redirected")
        }

        const json = await response.json()
        console.log("verify json :", json)

        if (json.accountType === "false") {
            getPostedJobs()
        } else {
            navigate('/login')
            // alert("unauthorized request, redirected")
        }

    }

    const getPostedJobs = async () => {

        const response = await fetch('/api/routes/recruiter/getpostedjobs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token,
                accountType,
            },
        }).then((res) => res.json())

        if (response.status === 'ok') {
            // everythign went fine
            // alert('Success')
            // const json = await response.json()
            console.log("these jobs :", response.data)
            setJobs(response.data);
            //
            // setType(response.accountType)

        } else {
            alert(response.error)

        }

    }


    const handleEditPopup = (event, job) => {
        console.log(job)
        event.preventDefault();
        setSelectedJob(job);
        setShowPopup(true);
    };

    const handlePopupClose = (event) => {
        event.preventDefault();
        getPostedJobs()
        setShowPopup(false);

    };

    const handleIndividualJobClick = (event,job) => {
        event.preventDefault();
        navigate('/recruiter/selectedjob', {state:job})

    };


    const onDelete = async (event, id) => {
        event.preventDefault()
        console.log("id delete : ", id)

        const response = await fetch('/api/routes/recruiter/deleteJob', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                token,
                accountType,
                id,
            },
        }).then((res) => res.json())


        if (response.status === 'ok') {

            console.log("these jobs :", response.data)
            setJobs(response.data);
            alert("job deleted")

        } else {
            alert(response.error)

        }

    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            verifyAccessAttempt()
        } else {
            navigate('/login')
        }

        // here we can prefetch some of the jobs stored in our database and load them to our page
    }, [])


    return (
        <div className="postedJobs">
            <div className='navbarholder'>
                <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            </div>
            <Link to="/recruiter">
                <img className='backbtn' src={backbtn} alt="back button"/>
            </Link>

            <div className='get_jobs_body'>

                <div className='heading_posted_jobs'>
                    <h2>Here are all your posted jobs</h2>
                    <h4>Select a job to see suitable candidate profiles for it</h4>
                    <h5>Also edit or delete posts you no longer need</h5>
                </div>

                {showPopup && <EditJob onClose={handlePopupClose} thisJob={selectedJob} />}
                <div className='all_posted_jobs'>

                    {jobs.map((job, index) => (
                        <div key={index} className='individual_job' onClick={event => handleIndividualJobClick(event,job)}>
 
                            <div className='btnHolder'>
                                <button className='individual_job_btn' onClick={event => handleEditPopup(event, job)}>edit</button>
                                <button className='individual_job_btn' onClick={event => onDelete(event, job._id)}>delete</button>
                            </div>

                            <div className='job_details'>

                                <div className='row_jd'>
                                    <div className='job_label'>
                                        <h4>Job Title : </h4>
                                        <h4>{job.job_title}</h4>
                                    </div>

                                    <div className='job_label'>
                                        <h4>Job Type : </h4>
                                        <h4>{job.job_type}</h4>
                                    </div>
                                </div>

                                <div className='row_jd'>
                                    <div className='job_label'>
                                        <h4>Job Location : </h4>
                                        <h4>{job.job_location}</h4>
                                    </div>

                                    <div className='job_label'>
                                        <h4>Salary Range : </h4>
                                        <h4>{job.salary_range}</h4>
                                    </div>
                                </div>

                            </div>

                            <div className='job_description'>
                                <h4>Job Description : </h4>
                                <h4>{job.job_description}</h4>
                            </div>

                            <SkillsList skills={job.skills} />

                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}


export default GetJobs
