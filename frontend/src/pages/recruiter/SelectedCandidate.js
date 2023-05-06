import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'

import Navbar from './../../components/Navbar'
import backbtn from './../../icons/arrow_back_blue.svg';
import download_resume from './../../icons/download_icon.svg';
import './../../css/RecruiterSelectedCandidate.css'


const SelectedCandidate = () => {
    const navigate = useNavigate()
    const { state } = useLocation();
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))
    const [resume_preview, setPreview] = useState(null)
    const {candidate,job} = state
    const job_skills = job.skills

    function SkillsList({ skills }) {
        if (!skills) {
            return null;
        }

        return (
            <div className="skills_main" >
                <div className="skills_container">
                    {job_skills.map((skill, index) => {
                        const className = skills.includes(skill)
                        ? 'blue_individual_skill'
                        : 'hollow_individual_skill';

                        return (
                            <div key={index}>
                                <p className={className}>{skill}</p>
                            </div>
                        );
                    })}
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

    const handleNavigate = ()=>{
        navigate("/recruiter/selectedjob", {state:job})
    }


    useEffect(() => {
        if (localStorage.getItem('token')) {
            // console.log("props", state)
            verifyAccessAttempt()
            setPreview(candidate.resume)
            // getCandidate()
        } else {
            navigate('/login')
        }

    }, [])
    return (
        <div className="selectedCandidate">
            <div className='navbarholder'>
                <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            </div>
            
            <img className='backbtn' src={backbtn} alt="back button" onClick={handleNavigate} />
            
            <div className='candidate_info_main'>

                <h1 className='main_heading'>Selected Candidate:</h1>
                {resume_preview && <div className='download_resume'>
                    <a href={resume_preview} download="resume.pdf">
                        <img className='resume_icon' src={download_resume} alt="download resume" />
                    </a>
                </div>}
                <div id='credentials'>

                <h3><span className='bold'>Name: </span>{candidate.fname} {candidate.lname}</h3>
                <h3><span className='bold'>City: </span>{candidate.city}</h3>
                <h3><span className='bold'>Cnic: </span>{candidate.cnic}</h3>
                <h3><span className='bold'>Email Address: </span>{candidate.prefferedEmail}</h3>
                <h3><span className='bold' an>Phone: </span>{candidate.phone}</h3>
                </div>
                <div className='Sep_divs3'>
                    <h3><span className='bold'>Highest Level of Education: </span>{candidate.highest_level_of_education}</h3>
                    <h3><span className='bold left_margin'>Grades/Cgpa: </span>{candidate.cgpa}</h3>
                </div>
                <h3><span className='bold'>Institute Name: </span>{candidate.institute_name}</h3>
                <h3><span className='bold'>Skills: </span></h3>
                <div className='skills_holder'>
                    <SkillsList  skills={candidate.skills}/>
                </div>
                <div className='holder_2'>
                    <div className='skills_legend inline_this'>
                        <h5 className='obtained_skill'><span className='blue_legend_holder'>Skill Name</span>Acquired Skill</h5>
                        <h5 className='missing_skill'><span className='hollow_legend_holder'>Skill Name</span>Required Missing Skill</h5>
                    </div>

                </div>


                <div className='all_experiences'>
                    <h3><span className='bold'>Work Experience: </span></h3>
                    {candidate.work_experience.map((experience, index) => (
                        <div key={index} className="individual_experience yellowish" id='ind-exp-selected-candidate'>
                            <div className='upper_part'>
                                <h3>{experience.job_title}</h3>
                                <h3>{experience.company_name}</h3>
                                <h3>{experience.duration}</h3>
                            </div>

                            <label className='label_description'>Job Description</label>
                            <div className='lower_part'>
                                <pre>{experience.job_description}</pre>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='all_experiences'>
                    <h3><span className='bold'>Awards and Achievement: </span></h3>
                    {candidate.achievements.map((achievement, index) => (
                        <div key={index} className="individual_experience yellowish">
                            <div className='upper_part'>
                                <h3>{achievement.achievement_name}</h3>
                                <h3>{achievement.year}</h3>
                            </div>

                            <label className='label_description'>Achievement Description</label>
                            <div className='lower_part'>
                                <pre>{achievement.achievement_description}</pre>
                            </div>
                        </div>
                    ))}
                </div>




            </div>

        </div>
    )
}


export default SelectedCandidate
