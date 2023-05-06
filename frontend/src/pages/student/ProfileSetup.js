import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../../css/studentProfileSetup.css"
import Navbar from './../../components/Navbar'
import backbtn from './../../icons/arrow_back_blue.svg';
import download_resume from './../../icons/download_icon.svg';
import skillsData from "./../../extras/skills.json";
import { Link } from 'react-router-dom'

const ProfileSetup = () => {

    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        // user: '',
        fname: '',
        lname: '',
        cnic: '',
        city: '',
        prefferedEmail: '',
        phone: '',
        resume: '',
        highest_level_of_education: '',
        institute_name: '',
        cgpa: '',
        skills: [],
        work_experience: [{
            job_title: '',
            company_name: '',
            duration: '',
            job_description: '',
        }],
        achievements: [{
            achievement_name: '',
            year: '',
            achievement_description: '',
        }],
        profileStatus: '',
    })

    const [isChecked, setisChecked] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [users, setUsers] = useState(null) // in the beginning 'users' state (that we created) will be null. but if response.ok is true, then we will update state using setUser
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))
    const [skillTemp, setSkillTemp] = useState('');
    const [error, setError] = useState('')
    const [resume_preview, setPreview] = useState(null)
    const [filteredData, setFilteredData] = useState([]);

    const [errors, setErrors] = useState({
        fname: '',
        lname: '',
        cnic: '',
        city: '',
        prefferedEmail: '',
        phone: '',
    });
    const [disableSaveBtn, setDisableSaveBtn] = useState(true);


    useEffect(() => {
        const hasErrors = Object.values(errors).some(error => error !== '');
        setDisableSaveBtn(hasErrors);
    }, [errors]);

    const handleAddExperience = () => {
        setProfile({
            ...profile,
            work_experience: [
                ...profile.work_experience,
                {
                    job_title: '',
                    company_name: '',
                    duration: '',
                    job_description: '',
                },
            ],
        });
    };

    const handleRemoveExperience = (index) => {
        const updatedExperiences = [...profile.work_experience];
        updatedExperiences.splice(index, 1);
        setProfile({ ...profile, work_experience: updatedExperiences });
    };


    const handleExperienceChange = (event, index) => {
        const { name, value } = event.target;
        const updatedExperiences = [...profile.work_experience];
        updatedExperiences[index][name] = value;
        setProfile({ ...profile, work_experience: updatedExperiences });
    };

    const handleAddAchievement = () => {
        setProfile({
            ...profile,
            achievements: [
                ...profile.achievements,
                {
                    achievement_name: '',
                    year: '',
                    achievement_description: '',
                },
            ],
        });
    };

    const handleRemoveAchievement = (index) => {
        const updatedAchievements = [...profile.achievements];
        updatedAchievements.splice(index, 1);
        setProfile({ ...profile, achievements: updatedAchievements });
    };


    const handleAchievementChange = (event, index) => {
        const { name, value } = event.target;
        const updatedAchievements = [...profile.achievements];
        updatedAchievements[index][name] = value;
        setProfile({ ...profile, achievements: updatedAchievements });
    };



    const getInfo = async () => {
        const response = await fetch('/api/routes/student/getprofile', {
            method: 'GET',
            headers: {
                token,
                accountType,
            },

        })

        if (!response.ok) {
            console.error("error");
            alert("some sort of error was encountered while fetching your profile data")
        }

        const profileResponse = await response.json()
        setProfile(profileResponse)
        setPreview(profileResponse.resume)
        setisChecked(profileResponse.profileStatus)
        setIsHidden(!profileResponse.profileStatus)
    }

    const navigateToChangePass = (e) => {
        e.preventDefault()
        navigate('/changepassword')
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

        if (json.accountType === "true") {
            getInfo()
        } else {

            navigate('/login')
            // alert("unauthorized request, redirected")
        }


    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            verifyAccessAttempt()
            console.log(skillsData)
        } else {
            navigate('/login')
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });

        // validate input
        let error = '';
        switch (name) {
            case 'fname':
                error = value.match(/^[a-zA-Z\s]*$/)
                    ? ''
                    : 'First name can only contain letters and spaces.';
                break;
            case 'lname':
                error = value.match(/^[a-zA-Z\s]*$/)
                    ? ''
                    : 'Last name can only contain letters and spaces.';
                break;
            case 'cnic':
                error = value.match(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/)
                    ? ''
                    : 'Please enter a valid CNIC number (e.g. 12345-1234567-1).';
                break;
            case 'city':
                error = value.match(/^[a-zA-Z\s]*$/)
                    ? ''
                    : 'City name can only contain letters and spaces.';
                break;
            case 'prefferedEmail':
                error = value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
                    ? ''
                    : 'Please enter a valid email address.';
                break;
            case 'phone':
                error = value.match(/^[0-9]{11}$/)
                    ? ''
                    : 'Please enter a valid phone number (11 digits).';
                break;
            default:
                break;
        }

        setErrors({ ...errors, [name]: error });
    };

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

    const addSkillToProfile = async (e, skill) => {
        e.preventDefault()
        var temp = [...profile.skills, skill];
        console.log("temp", temp);
        setSkillTemp('');
        // create a new object with all the properties of the profile state

        var newProfile = { ...profile };
        // // update the skills property with the new array
        // newProfile.skills = temp;
        // //update the profile state with the new object
        setProfile({ ...profile, skills: temp });
        // setProfile(...profile.skills,temp)
        setFilteredData([])

    }

    const handleProfileStatusChange = async (e) => {

        setProfile({ ...profile, profileStatus: e.target.checked });
        // setProfile(...profile.skills,temp)

    }


    const HandleSubmit = async (e) => {
        e.preventDefault()
        if (disableSaveBtn) {
            alert('Please fill in all fields correctly to save profile');
        }
        else {
            const response = await fetch('/api/routes/student/setprofile', {
                method: 'POST',
                body: JSON.stringify(profile),
                headers: {
                    'Content-Type': 'application/json',
                    token,
                    accountType,
                },
            }).then((res) => res.json())

            if (response.status === 'ok') {
                // everythign went fine
                alert('Successfully saved data')
                navigate(localStorage.getItem('accountType') === 'true' ? '/student' : '/recruiter');
            } else {
                alert(response.error)
            }
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // setProfile(Object.assign({}, profile, { resume: reader.result }));
            setProfile({ ...profile, resume: reader.result });
            setPreview(reader.result);

            // alert(reader.result)

        };
        reader.onerror = (error) => {
            console.log("reader Error: ", error);
        };
    };

    function SkillsList({ skills, onDelete }) {
        return (
            <div className="skills_main">
                <h4>Selected Skills: </h4>
                <div className='skills_container'>
                    {skills.map((skill, index) => (
                        <div className='stud_prof_individual_key' onClick={() => onDelete(index)} key={index}>
                            <p className='individual_skill_stud_prof'>{skill}<button edge="end" aria-label="delete" onClick={() => onDelete(index)}>X</button></p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    const handleDelete = (index) => {
        //create a new array without the selected index 
        const newSkills = [...profile.skills.slice(0, index), ...profile.skills.slice(index + 1)];
        setProfile({ ...profile, skills: newSkills });
    }



    return (
        <div>
            <div className='stud_nav'>
                <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            </div>
            <Link to="/student">
                <img className='backbtn' src={backbtn} alt="back button" />
            </Link>

            <div className='savebtnholder changePasswordBtn'>
                <button className='save_btn chnage_pass_btn' onClick={navigateToChangePass}>Change Password</button>
            </div>

            <div className="student_Profile_Setup">
                <div className='users2'>
                    <h1>Setup/Manage Your Profile</h1>
                </div>
                <form className="setup" onSubmit={HandleSubmit}>
                    <h3>General Profile Information</h3>
                    <div className='Sep_divs'>
                        <div className='all_separate_divisions'>

                            <label>First Name</label>
                            <input
                                type="text"
                                name="fname"
                                onChange={handleChange}
                                value={profile.fname}
                                placeholder="first name"
                                required
                            />
                            {errors.fname && <span className="error">{errors.fname}</span>}
                        </div>
                        <div className='all_separate_divisions'>

                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lname"
                                onChange={handleChange}
                                value={profile.lname}
                                placeholder="last name"
                                required
                            />
                            {errors.lname && <span className="error">{errors.lname}</span>}
                        </div>
                    </div>
                    <div className='Sep_divs'>

                        <div className='all_separate_divisions'>

                            <label>CNIC</label>
                            <input
                                type="text"
                                name="cnic"
                                onChange={handleChange}
                                value={profile.cnic}
                                placeholder="CNIC No."
                                required
                            />
                            {errors.cnic && <span className="error">{errors.cnic}</span>}
                        </div>

                        <div className='all_separate_divisions'>

                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                onChange={handleChange}
                                value={profile.city}
                                placeholder="City"
                                required
                            />
                            {errors.city && <span className="error">{errors.city}</span>}
                        </div>

                    </div>
                    <div className='Sep_divs'>

                        <div className='all_separate_divisions'>

                            <label>Email</label>
                            <input
                                type="text"
                                name="prefferedEmail"
                                onChange={handleChange}
                                value={profile.prefferedEmail}
                                placeholder="Primary email"
                                required
                            />
                            {errors.prefferedEmail && <span className="error">{errors.prefferedEmail}</span>}
                        </div>


                        <div className='all_separate_divisions'>

                            <label>Phone No.</label>
                            <input
                                type="text"
                                name="phone"
                                onChange={handleChange}
                                value={profile.phone}
                                placeholder="Phone No."
                                required
                            />
                            {errors.phone && <span className="error">{errors.phone}</span>}
                        </div>

                    </div>
                    <div>
                        <h3>Resume</h3>
                        <div className='Sep_divs2'>

                            {resume_preview && <div className='download_resume'>
                                <a href={resume_preview} download="resume.pdf">
                                    <img className='resume_icon' src={download_resume} alt="download resume" />

                                </a>
                            </div>
                            }
                            {/* <a href={`data:application/pdf;base64,${resume_preview}`} download="resume.pdf">Download PDF</a> */}

                            {/* <h4 className="resume_preview">current uploaded resume: {resume_preview.slice(14)}</h4> */}

                            <input
                                className='file_upload'
                                type='file'
                                name='resume'
                                // style="display:none"
                                onChange={handleFileChange}
                            // value = {profile.resume}
                            />
                        </div>
                    </div>
                    <div class="all_separate_divisions checkbox_holder">
                        <h3>Profile visibility for Recruiters</h3>
                        <div class="all_separate_divisions_checkbox">
                            <label class="checkbox-container">
                                <input
                                    type="checkbox"
                                    name="profileStatus"
                                    checked={profile.profileStatus}
                                    onChange={handleProfileStatusChange}
                                />
                                <span class="checkmark"></span>
                            </label>
                        </div>
                    </div>





                    <div>
                        <h3>Education Information</h3>
                        <div className='Sep_divs'>
                            <div className='all_separate_divisions'>

                                <label>Highest level of Education</label>
                                <input
                                    type="text"
                                    name="highest_level_of_education"
                                    onChange={handleChange}
                                    value={profile.highest_level_of_education}
                                    placeholder="Highest Level of Education"
                                    required
                                />
                            </div>
                            <div className='all_separate_divisions'>

                                <label>Institute Name</label>
                                <input
                                    type="text"
                                    name="institute_name"
                                    onChange={handleChange}
                                    value={profile.institute_name}
                                    placeholder="Institute Name"
                                    required
                                />
                            </div>
                        </div>
                        <div className='Sep_divs'>

                            <div className='all_separate_divisions'>
                                <label>CGPA</label>
                                <input
                                    type="text"
                                    name="cgpa"
                                    onChange={handleChange}
                                    value={profile.cgpa}
                                    placeholder="CGPA"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className='all_separate_divisions'>
                        <h3>Add your skills</h3>
                        <input id='skills-input'
                            type="text"
                            name="skills"
                            onChange={handleSkillChange}
                            value={skillTemp}
                            placeholder="click on the dropdown to add the skill"
                        />


                        {/* <button onClick={addSkillToProfile}>add skill</button> */}
                    </div>
                    <div>
                        {filteredData.length != 0 && (
                            <div className="dataResult">
                                {filteredData.slice(0, 15).map((value, key) => {
                                    return (
                                        <p onClick={event => addSkillToProfile(event, value.Skill)}>{value.Skill} </p>
                                    );
                                })}
                            </div>
                        )}

                    </div>

                    <h4><SkillsList skills={profile.skills} onDelete={handleDelete} /></h4>

                    <div className='all_experiences'>
                        <h3>Work Experience</h3>
                        {profile.work_experience.map((experience, index) => (
                            <div key={index} className="individual_experience">
                                <button className='remove_btn' type="button" onClick={() => handleRemoveExperience(index)}>
                                    x
                                </button>
                                <div className='upper_part' id='upper-part-stud'>
                                    <input
                                        type="text"
                                        name="job_title"
                                        value={experience.job_title}
                                        onChange={(e) => handleExperienceChange(e, index)}
                                        placeholder="job title"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={experience.company_name}
                                        onChange={(e) => handleExperienceChange(e, index)}
                                        placeholder="company name"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="duration"
                                        value={experience.duration}
                                        onChange={(e) => handleExperienceChange(e, index)}
                                        placeholder="duration"
                                        required
                                    />
                                </div>

                                <label className='label_description'>Job Description</label>
                                <div className='lower_part' >
                                    <textarea

                                        name="job_description"
                                        value={experience.job_description}
                                        onChange={(e) => handleExperienceChange(e, index)}
                                        placeholder="enter job description here"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <div className='btnholder'>
                            <button type="button" className='add_btn' onClick={handleAddExperience}>
                                Add Experience
                            </button>
                        </div>
                    </div>


                    <div className='all_experiences'>
                        <h3>Awards and Achievements</h3>
                        {profile.achievements.map((achievement, index) => (
                            <div key={index} className="individual_experience">
                                <button className='remove_btn' type="button" onClick={() => handleRemoveAchievement(index)}>
                                    x
                                </button>
                                <div className='upper_part' id='upper-part-stud'>
                                    <input
                                        type="text"
                                        name="achievement_name"
                                        value={achievement.achievement_name}
                                        onChange={(e) => handleAchievementChange(e, index)}
                                        placeholder="achievement name"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="year"
                                        value={achievement.year}
                                        onChange={(e) => handleAchievementChange(e, index)}
                                        placeholder="year"
                                        required
                                    />
                                </div>

                                <label className='label_description'>Achievement Description</label>
                                <div className='lower_part'>
                                    <textarea

                                        name="achievement_description"
                                        value={achievement.achievement_description}
                                        onChange={(e) => handleAchievementChange(e, index)}
                                        placeholder="enter description of achievement here"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <div className='btnholder'>
                            <button type="button" className='add_btn' onClick={handleAddAchievement}>
                                Add Achievement
                            </button>
                        </div>
                    </div>





                    <div className='savebtnholder'>
                        <button className='save_btn'>Save Profile</button>
                    </div>

                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    )
}

export default ProfileSetup
