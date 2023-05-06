import { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import ViewMoreDetail from './../ViewMoreDetail';
import { Link } from 'react-router-dom'
import backbtn from './../../icons/arrow_back_blue.svg';
import './../../css/studentSelectedPaths.css'
import Navbar from './../../components/Navbar'
// see code explainations at the end of the code
const SelectedPath = () => {

    const navigate = useNavigate()
    const { state } = useLocation();
    const [users, setUsers] = useState(null) // in the beginning 'users' state (that we created) will be null. but if response.ok is true, then we will update state using setUser
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))
    // const careerPaths = [{'path':'Python developer','info':'a python developer is someone who develops programs using the python language'},{'path':'Devops Engineer','info':'A DevOps engineer introduces processes, tools, and methodologies to balance needs throughout the software development life cycle, from coding and deployment, to maintenance and updates.'},{'path':'Full stack developer','info':'a full stack developers is responsible for development of both frontend and backend of an application'},{'path':'java developer','info':'a java developer is someone who develops programs using the java language'},{'path':'.Net Developer','info':'NET developer is a software engineer who builds the software using Microsoft\'s . NET technologies'}]
    const {career_path,studentSkills} = state
    const [relevantskills, setRelevantSkills] = useState([])
    const [keyword, setPathName] = useState(career_path.path)

    const [location, setLocation] = useState('')
    const [path_info, setPathInfo] = useState(null)
    const [jobs, setJobs] = useState([])
    const [showPopup, setShowPopup] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null)

    const handlePopupClose = (event) => {
        event.preventDefault();
        setShowPopup(false);
    };

    const handlePopupOpen = (event, job) => {
        console.log(job)
        event.preventDefault();
        setSelectedJob(job);
        setShowPopup(true);
    };

    const handleApply = (event, url) => {
        event.preventDefault();
        window.open(url, '_blank', 'noreferrer')
        // window.location.href = url;
    };



    const getRelevantJobs = async () => {
        // e.preventDefault()
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
            setJobs(response.data.jobs);
        } else {
            alert(response.error)

        }
    }

    const getPathInfo = async () => {
        // e.preventDefault()
        const response = await fetch('/api/routes/student/getpathinfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token,
                accountType,
            },
            body: JSON.stringify({
                keyword,
            })
        })

        const data = await response.json();
        if(data){
            setPathInfo(data.data)
        }
        // if (response.status === 'ok') {
        //     setPathInfo(response.data);
        // } else {
        //     alert(response.error)
        // }
        // alert(path_info)
    }



    function SkillsList({ skills }) {
        if (!skills) {
            return null;
        }

        return (
            <div className="skills_main" id="stud-skills_main" >
                <div className="skills_container2">
                    {skills.map((skill, index) => {
                        const className = studentSkills.includes(skill)
                        ? 'blue_individual_skill ind_skill'
                        : 'hollow_individual_skill ind_skill';

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

    function SkillsList2({ skills }) {
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
        console.log("json :", json)


        if (json.accountType === "false") {
            navigate('/login')
        }

        if (json.accountType === "true") {
            // getPotentialPaths()
        } else {
            navigate('/login')
            // alert("unauthorized request, redirected")
        }
    }

    const getNeededSkills= async () =>{
        // setPathName(career_path.path)
        const response = await fetch('/api/routes/student/getrelevantskills', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token,
                accountType,
                keyword,
            }
            // body: JSON.stringify({
            // })
        }).then((res) => res.json())

        setRelevantSkills(response.relevantskills)
        getPathInfo()
        // console.log(response.relevantskills)

    }

    const handleClickScroll = () => {
        const element = document.getElementById('alljobs');
        if (element) {
          // 👇 Will scroll smoothly to the top of the next section
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setPathName(career_path.path)
            verifyAccessAttempt()
            setPathInfo(career_path.info)
            getNeededSkills()
            getRelevantJobs()
        } else {
            navigate('/login')
        }
    }, [])


    return (
        <div>
            <div className='stud_nav'>
                <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            </div>
            <Link to="/student">
                <img className='backbtn' id='stud_backbtn' src={backbtn} alt="back button"/>
            </Link>
            <div className= 'SelectedPathMain' >
                <h1 id='stud-head_main'>{keyword}</h1>
                <h4 id='stud-path_info'>{path_info}</h4>
                <h3>Skills You Need To Excel In This Career Path <br/><sub className='subscript_text'>these are commonly found skills found in majority of job descriptions of this role</sub></h3>
                <div className='skills_holder'>
                    <SkillsList skills={relevantskills}/>
                    <div className='skills_legend'>
                        <h5 className='obtained_skill'><span className='blue_legend_holder'>Skill Name</span>Obtained Skill</h5>
                        <h5 className='missing_skill'><span className='hollow_legend_holder'>Skill Name</span>Missing Skill</h5>
                    </div>
                </div>
                {/* <div>{relevantskills}</div> */}
                <div className='navigateToJobsBtn' onClick={handleClickScroll}>
                    <h3>See Relevant Jobs</h3>
                </div>


            </div>
                {showPopup && <ViewMoreDetail onClose={handlePopupClose} thisJob={selectedJob} />}
                <div className='all_searchJobs selected_path_jobs' id='alljobs'>
                    {jobs.map((job, index) => (
                        <div key={index} className='individual_job_serachJob individual_job_selected_path'>
                            <a href={job["anchor_link"]}><h3>Title: {job["job_title"]}</h3></a>
                            <h3><span>Company Name: </span>{job["company_name"]}</h3>
                            <p>{job["job_description"]}...</p>
                            <SkillsList2 skills={job["skills"]} />
                            <div className='searchJob_btnHolder'>
                                <button onClick={event => handlePopupOpen(event, job)}>View Details</button>
                                <button onClick={event => handleApply(event, job["anchor_link"])}>Apply</button>
                            </div>

                            {/* <button onClick={event => handleApply(event,job["anchor_link"])}>view more</button> */}
                        </div>
                    ))}
                </div>
            
        </div>

    )
}

export default SelectedPath
