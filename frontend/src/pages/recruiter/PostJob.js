import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../css/postjob.css'
import Navbar from './../../components/Navbar'
import backbtn from './../../icons/arrow_back_blue.svg';
import { Link } from 'react-router-dom'
import skillsData from "./../../extras/skills.json";


// see code explainations at the end of the code
const PostJob = () => {

    const navigate = useNavigate()

    const [job, setJob] = useState({
        // user: '',
        job_title: '',
        job_type: '',
        job_location: '',
        salary_range: '',
        job_description: '',
        skills: [],
    })
    const [skillTemp, setSkillTemp] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))
    const [error, setError] = useState('')

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
            // getInfo()
        } else {
            navigate('/login')
            // alert("unauthorized request, redirected")
        }

    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            verifyAccessAttempt()
        } else {
            navigate('/login')
        }
    }, [])


    const handleSkillChange = (e) => {
        const skillEntered = e.target.value
        setSkillTemp(skillEntered)
        const newFilter = skillsData.filter((value) => {
            return value.Skill.toLowerCase().includes(skillEntered.toLowerCase());
        });

        if (skillEntered === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    }

    const handleDelete = (index) => {
        //create a new array without the selected index 
        const newSkills = [...job.skills.slice(0, index), ...job.skills.slice(index + 1)];
        setJob({ ...job, skills: newSkills });
    }

    const addSkillToJob = async (e, skill) => {
        e.preventDefault()
        var temp = [...job.skills, skill];
        setSkillTemp('');

        var newJob = { ...job };

        setJob({ ...job, skills: temp });
        setFilteredData([])

    }

    function SkillsList({ skills, onDelete }) {
        return (
            <div className="skills_main" >
                <h4>Selected Skills: </h4>
                <div className='skills_container'>
                    {skills.map((skill, index) => (
                        <div className='post_job_individual_key' key={index} onClick={() => onDelete(index)}>
                            <p className='individual_skill_job_post'>{skill}<button edge="end" aria-label="delete" onClick={() => onDelete(index)}>X</button></p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }





    const handleChange = (e) => {
        const { name, value } = e.target;
        setJob({ ...job, [name]: value });
    };


    const HandleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('/api/routes/recruiter/postjob', {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'accountType': accountType,
            },
        }).then((res) => res.json())



        if (response.status === 'ok') {
            // everythign went fine
            alert('Successfully saved data')
            navigate('/recruiter');
        } else {
            alert(response.error)
        }
    }


    return (
        <div className='Post_job'>
            <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            <div className='navbarBackground'></div>

            <Link to="/recruiter">
                <img className='backbtn' src={backbtn} alt="back button" />
            </Link>

            <div className="Recruiter_Post_Job">
                {/* <h2>home for,, now</h2> */}
                <div className='jobPostHeading'>
                    <h1>Post Your Job</h1>
                    <h4>click post upon completion</h4>
                </div>


                <form className="post_job_form" onSubmit={HandleSubmit}>
                    <h3>Job Information</h3>
                    <br />
                    <br />
                    <br />

                    {/* <label>Job Information</label> */}
                    <div className='top-form'>
                        <div className='Sep_divs'>
                            <div className='all_separate_divisions' id='margin-top-bottom'>
                            
                            <label>Job Title</label>
                            <input
                                type="text"
                                name="job_title"
                                placeholder='Job Title'
                                onChange={handleChange}
                                value={job.job_title}
                                />
                            </div>
                            <div className='all_separate_divisions' id='margin-top-bottom'>
                            <label>Job Location</label>
                            <input
                                type="text"
                                name="job_location"
                                placeholder='Job Location (city/remote)'
                                onChange={handleChange}
                                value={job.job_location}
                                />
                            </div>
                        </div>

                        <div className='Sep_divs'>
                            <div className='all_separate_divisions' id='margin-top-bottom'>
                            <label>Job Type</label>
                            
                            <input
                                type="text"
                                name="job_type"
                                placeholder='Job Type'
                                onChange={handleChange}
                                value={job.job_type}
                                />

                            </div>

                            <div className='all_separate_divisions'id='margin-top-bottom'>
                            <label>Salary type</label>
                            <input
                                type="text"
                                name="salary_range"
                                placeholder='Salary Range (eg. 60000 - 110000)'
                                onChange={handleChange}
                                value={job.salary_range}
                                />
                            </div>
                        </div>

                    </div>


                    <div className='job_description'>

                        <h3>Job Description</h3>
                        <br />
                        <br />
                        <br />


                        <textarea
                            type="text"
                            name="job_description"
                            onChange={handleChange}
                            placeholder='Job description here...'
                            value={job.job_description}
                        // style="height:200px"
                        >
                        </textarea>

                    </div>

                    <h3>Skills</h3>
                    <br />
                    <br />
                    <br />
                    <div className='bottom-form'>
                        <input
                            type="text"
                            name="skills"
                            onChange={handleSkillChange}
                            value={skillTemp}
                        />
                        {/* <button className='add-skills-btn' onClick={addSkillToJob}>add skill</button> */}
                        <div>
                            {filteredData.length != 0 && (
                                <div className="dataResult" id='data-res-post-job'>
                                    {filteredData.slice(0, 15).map((value, key) => {
                                        return (
                                            <p onClick={event => addSkillToJob(event, value.Skill)}>{value.Skill} </p>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                        <br />
                        <br />
                        <br />
                        <SkillsList skills={job.skills} onDelete={handleDelete} />
                    </div>

                    <hr className='post_job_hr'></hr>

                    <button className='post_job_btn'>Post Job</button>

                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    )
}

export default PostJob
