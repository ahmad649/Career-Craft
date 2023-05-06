import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import EditJob from './EditJob';
import Navbar from './../../components/Navbar'
import backbtn from './../../icons/arrow_back_blue.svg';
import './../../css/RecruiterSelectedJob.css'


const SelectedJob = () => {
    const navigate = useNavigate()
    const { state } = useLocation();
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))
    const [candidates,setCandidates] = useState([])
    const job = state

    function SkillsList({ skills }) {
        if (!skills) {
            return
        }

        return (
            <div className="skills_main" id='skills-scroll'>
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
            // getPostedJobs()
        } else {
            navigate('/login')
            // alert("unauthorized request, redirected")
        }

    }

    const handleIndividualCandidateClick = (event,candidate) => {
        event.preventDefault();
        navigate('/recruiter/selectedcandidate', {state:{candidate,job}})
    };



    const getCandidate = async()=>{
        

        const response = await fetch('/api/routes/recruiter/getsuitablecandidates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token,
                accountType,
            },
            body: JSON.stringify(job)
        })

        const candidatesResponse = await response.json()
        if (candidatesResponse.status === 'ok') {
            setCandidates(candidatesResponse.profiles)

            console.log("profile response", candidatesResponse)

        } else {
            alert(candidatesResponse.error)

        }
    }



    useEffect(() => {
        if (localStorage.getItem('token')) {
            // console.log("props", state)
            verifyAccessAttempt()
            getCandidate()
        } else {
            navigate('/login')
        }
        
    }, [])
    return (
        <div className="selectedJob">
            <div className='navbarholder'>
                <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            </div>
            <Link to="/recruiter/postedjobs">
                <img className='backbtn' src={backbtn} alt="back button" />
            </Link>

            <div className='selected_job_main_body'>

                <div className='heading_selected_job'>
                    <h2>Selected Job:</h2>
                </div>

                <div className='selected_job_body'>

                    {/* <div className='btnHolder'>
                        <button className='individual_job_btn' onClick={event => handleEditPopup(event, job)}>edit</button>
                        <button className='individual_job_btn' onClick={event => onDelete(event, job._id)}>delete</button>
                    </div> */}

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

                    <div className='Selected_job_description'>
                        <pre>Job Description : </pre>
                        <pre>{job.job_description}</pre>
                    </div>

                    <SkillsList skills={job.skills} />

                </div>

                <div className='heading_selected_job'>
                    <h2>Here is a list of candidates that best match your job post:</h2>
                </div>

                <div className='all_candidates'>

                    {candidates && candidates.map((candidate, index) => (
                        <div key={index} className='individual_candidate' onClick={event => handleIndividualCandidateClick(event,candidate)}>

                            <div className='candidate_details'>
                                <div className='top_row_details'>
                                    <h3><span className='label'>Name:</span> {candidate.fname} {candidate.lname}</h3>
                                    <h3><span className='label'>City:</span> {candidate.city}</h3>
                                    <h3><span className='label'>Phone:</span> {candidate.phone}</h3>
                                </div>

                            </div>

                            <SkillsList skills={candidate.skills} />

                        </div>
                    ))}
                </div>


            </div>

        </div>
    )
}


export default SelectedJob
