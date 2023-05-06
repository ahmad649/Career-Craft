import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import './../../css/studentHome.css'
import Navbar from './../../components/Navbar'
import profileSetupIcon from './../../icons/setup_profile.svg';
import scrollIcon from './../../icons/scroll_new.svg';
// see code explainations at the end of the code
const Home = () => {

    
    const navigate = useNavigate()
    const [users, setUsers] = useState(null) // in the beginning 'users' state (that we created) will be null. but if response.ok is true, then we will update state using setUser
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))
    const [careerPaths, setCareerPaths] = useState([])
    const [displayTandC, setDisplayTandC] = useState(true)
    const [studentSkills, setStudentSkills] = useState("")
    const [jobs, setJobs] = useState([])


    function CareerPathsList({ career_paths }) {
        if (!career_paths) {
            return
        }

        return (
            <div className="career_paths_main">
                <div className='career_paths_container'>
                    {career_paths.map((career_path, index) => (
                        <div className='individual_career_path' key={index} onClick={event => handleIndividualPathClick(event, career_path)}>
                            <p className='individual_path'>{career_path.path}</p>
                            {/* <p className='individual_info'>{career_path.info}</p> */}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    function SkillsList({ skills }) {
        if (!skills) {
            return
        }

        return (
            <div className="skills_main" id='stud_home_width'>
                <h3>skills: </h3>
                <div className='skills_container' id='stud_home_skills'>
                    {skills.map((skill, index) => (
                        <div key={index}>
                            {/* {index % 5 == 0 && index != 0 && <br />} */}
                            <p className='individual_skill' id='stud_home_skill'>{skill}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const handleClickScroll = () => {
        const element = document.getElementById('alljobshome');
        if (element) {
            // 👇 Will scroll smoothly to the top of the next section
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleIndividualPathClick = (event, career_path) => {
        console.log("studentSkills here : ", studentSkills)
        event.preventDefault()
        navigate('/student/selectedpath', { state: { career_path, studentSkills } })
    }


    const getPotentialPaths = async () => {
        const response = await fetch('/api/routes/student/getpotentialpaths', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token,
                accountType,
            }
        })

        const pathResponse = await response.json()
        // console.log("json :", pathResponse)
        if (pathResponse.data) {
            setCareerPaths(pathResponse.data)
        }

        if (pathResponse.skills) {
            setStudentSkills(pathResponse.skills)
        }
        // console.log(pathResponse.data)
    }



    const getRankedJobs = async () => {
        console.log("studentSkills in frontend: ", studentSkills)
        const response = await fetch('/api/routes/student/getrankedjobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'accountType': accountType,
            },
            body: JSON.stringify({
                studentSkills: studentSkills
            })
        })
        const jobResponse = await response.json()
        if (jobResponse.data) {
            setJobs(jobResponse.data)
        }
    }


    useEffect(() => {
        // alert("skillss updated", studentSkills.length)
        
        getRankedJobs()
    }, [studentSkills])




    const tAndC = async () => {

        console.log(accountType)
        const response = await fetch('/api/routes/gettandc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token,
                accountType,
            }
        })

        const tandCResponse = await response.json()
        console.log("hellllllooo", tandCResponse.data)
        setDisplayTandC(tandCResponse.data)

    }

    const handleDecline = (event) => {
        event.preventDefault()
        localStorage.removeItem('token');
        localStorage.removeItem('accountType');
        navigate('/login');
    }

    const handleAccept = async (event) => {
        event.preventDefault()
        const response = await fetch('/api/routes/settandc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token,
                accountType,
            }
        })
        const setTandCResponse = await response.json()
        console.log("oooOOOO : ", setTandCResponse.status)
        setDisplayTandC(false)

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
        console.log("json :", json)


        if (json.accountType === "false") {
            navigate('/login')
        }

        if (json.accountType === "true") {
            getPotentialPaths()
            // getRankedJobs()
        } else {
            navigate('/login')
            // alert("unauthorized request, redirected")
        }

    }

    const handleClickSetupProfile = (e)=>{
        e.preventDefault()
        navigate("/student/setprofile")
    }

    useEffect(() => {

        if (localStorage.getItem('token')) {
            verifyAccessAttempt()
            tAndC()
        } else {
            navigate('/login')
        }
    }, [])


    return (
        <div>
            <div className='stud_nav'>
                <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            </div>
            <Link to="/student/setprofile">
                <img className='profileSetupIcon' src={profileSetupIcon} alt="profile Setup" />
            </Link>
            {!studentSkills.length && <div className="student_home stud_extra_padding">
                <div className='stud_home_headings'>
                    <h3 className='stud_home_sub_heading small_text'>Ready to start your journey towards endless opportunities?</h3>
                    <h4 className='small_text'>Sign up and create your profile now</h4>
                    <p className='small_text'>add atleast 3 skills for better results</p>
                    <button onClick={handleClickSetupProfile}>Setup Profile</button>
                </div>
            </div>}
            {studentSkills.length>0 && (<div className="student_home">
                <div className='stud_home_headings'>
                    <h1>Suitable Career Paths</h1>
                    <h3 className='stud_home_sub_heading'>based on your data</h3>
                    <p className='small_text'>click on one to find out more about it</p>
                </div>
                <div className='careerPathsHolder'>
                    <CareerPathsList career_paths={careerPaths} />
                </div>
                <img className='scoll_Icon' src={scrollIcon} onClick={handleClickScroll} />

                <div className='jobs_container' id='alljobshome'>
                    <h3 className='stud_home_sub_heading'>Here are a bunch of jobs posted on our website that you are an ideal fit for</h3>
                    <p className='small_text'>You dont have to apply to these jobs. Our website does that for you <br />Just keep your profile updated</p>
                </div>
                <div className='all_posted_jobs'>

                    {jobs.map((job, index) => (
                        <div key={index} className='stud_home_individual_job'>

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

            </div>)}

            <div>
                {
                    displayTandC
                    &&
                    <div className='tandc'>
                        <div className='tandcTop'></div>
                        <div className='tandcBottom'>
                            <h3>By accessing or using this website, you agree to be bound by these <a href='/terms-and-conditions'>Terms and Conditions</a>.<br /> If you do not agree to these Terms, please do not use this website</h3>
                            <div className='tandcBtns'>
                                <button onClick={handleDecline}>decline</button>
                                <button onClick={handleAccept}>accept</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Home
