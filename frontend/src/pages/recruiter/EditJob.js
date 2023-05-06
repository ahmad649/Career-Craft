import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './../../css/recruiterEditJob.css';


const EditJob = (props) => {


    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [job, setJob] = useState({
        job_title: '',
        job_type: '',
        job_location: '',
        salary_range: '',
        job_description: '',
        skills: [],
    })
    const [skillTemp, setSkillTemp] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))

    const handleClose = (event) => {
        event.preventDefault();
        props.onClose(event);
    };

    function SkillsList({ skills }) {
        if (!skills) {
            return
        }

        return (
            <div className="jobSkills">
                <div>skills: </div>
                {skills.map((skill, index) => (
                    <div className="skill" key={index}>
                        <p>{skill}</p>
                    </div>
                ))}
            </div>
        );
    }


    const handleSkillChange = (e) =>{
        setSkillTemp(e.target.value)
    }

    const handleDelete = (index) => {
        //create a new array without the selected index 
        const newSkills = [...job.skills.slice(0, index), ...job.skills.slice(index + 1)];
        setJob({ ...job, skills: newSkills });
    }

    const addSkillToJob = async (e) =>{
        e.preventDefault()
        var temp = [...job.skills, skillTemp];
        setSkillTemp('');

        var newJob = {...job};

        setJob({...job, skills:temp});

        
    }

    function SkillsList({ skills, onDelete }) {
        return (
            <div className='edit_skills'>
                {skills.map((skill, index) => (
                    <div className='individual_skill_edit_key' key={index}>
                        <p className='individual_skill_edit_job'>{skill}<button edge="end" aria-label="delete" onClick={() => onDelete(index)}>X</button></p>      
                    </div>
                ))}
            </div>
        );
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setJob({ ...job, [name]: value });
    };


    const HandleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('/api/routes/recruiter/editjob', {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'accountType': accountType,
                'id': props.thisJob._id
            },
        }).then((res) => res.json())



        if (response.status === 'ok') {
            // everythign went fine
            alert('Successfully updated job')
            
        } else {
            alert(response.error)
        }
    }

    useEffect(() => {
        console.log("props this job : ", props.thisJob )
        setJob(props.thisJob)
        console.log('job',job)
    }, [])


    return (


        <div className="EditjobDetail">
            <div className="mainEditJob">

                    <button className='closeBtnJobDetail' onClick={event => handleClose(event)}>X</button>
                    <div className="Recruiter_Edit_Job">
                        <form className="edit_setup" onSubmit={HandleSubmit}>
                            <h3>Job Information</h3>
                            <div className='Edit_jobs_divs'>
                            <div className='edit_jobs_single_div'>
                            
                            <label id='all-labels'>Job Title</label>
                            
                            <input
                                type="text"
                                name="job_title"
                                placeholder='Job Title'
                                onChange={handleChange}
                                value={job.job_title}
                                required
                                />
                            </div>
                            <div className='edit_jobs_single_div'>


                            <label id='all-labels'>Job Location</label>
                            <input
                                type="text"
                                name="job_location"
                                placeholder='Job Location (city/remote)'
                                onChange={handleChange}
                                value={job.job_location}
                                required
                                />
                            </div>
                            </div>

                            <div className='Edit_jobs_divs'>
                            <div className='edit_jobs_single_div'>



                            <label id='all-labels'>Job type</label>
                            <input
                                type="text"
                                name="job_type"
                                placeholder='Job Type'
                                onChange={handleChange}
                                value={job.job_type}
                                required
                                />
                            </div>

                            <div className='edit_jobs_single_div'>

                            <label id='all-labels'>Salary range</label>
                            <input
                                type="text"
                                name="salary_range"
                                placeholder='Salary Range (eg. 60000 - 110000)'
                                onChange={handleChange}
                                value={job.salary_range}
                                required
                                />
                            </div>
                            </div>


                        <div className='bottom-form-2'>
                            <div className='half_divs'>
                            <h3 className='left_aligned'>Job Description</h3>

                            <div className='job_description1 textarea'>
                            <textarea
                                type="text"
                                name="job_description"
                                onChange={handleChange}
                                placeholder='Job description here...'
                                value={job.job_description}
                                />
                            </div>
                            </div>
                
                            <div className='half_divs'>
                            <h3 className='left_aligned'>Add Skills</h3>
                            <input
                                type="text"
                                name="skills"
                                onChange={handleSkillChange}
                                value={skillTemp}
                                placeholder='Add a skill here...'
                                />
                            <div className='add_skill_btn'>
                            <button onClick={addSkillToJob}>Add skill</button>
                            </div>
                            

                            <h3 className='left_aligned'>Selected skills :</h3>
                            <div className='edit_job_skill_conainer'>
                                <SkillsList skills={job.skills} onDelete={handleDelete} />
                            </div>
                            <div className='edit_job_save'>

                            <button className='applyBtnJobDetail'>Save Job</button>
                            </div>
                            {error && <div className="error">{error}</div>}
                            
                            </div>                            
                        </div>
                        </form>
                    </div>


                    {/* <h2>View More Details here</h2>
                    {props.thisJob && (
                        <div>
                            <h3>{job_title}</h3>
                            <h3>{company_name}</h3>
                            <p>{job_description}</p>
                            <SkillsList skills={skills}/>

                            {/* <h3>{props.thisJob["job_title"]}</h3>
                            <h3>{props.thisJob["company_name"]}</h3>
                            <p>{props.thisJob["job_description"]}...</p>
                            <SkillsList skills={props.thisJob["skills"]}/> 
                        </div>
                    )} */}

            </div>
        </div>
    );
};

export default EditJob;
