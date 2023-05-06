import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../../css/recruiterProfileSetup.css"
import Navbar from './../../components/Navbar'
import backbtn from './../../icons/arrow_back_blue.svg';
import {Link} from 'react-router-dom'
// see code explainations at the end of the code
const ProfileSetup = () => {
    const [error, setError] = useState('')
    const navigate = useNavigate()
    
    const [profile, setProfile] = useState({
        // user: '',
        fname: '',
        lname: '',
        cnic: '',
        prefferedEmail: '',
        currentPosition: '',
        companyLogo: '',
        companyName: '',
        companyLocation: '',
        dateEstablished: '',
        domainOfWork: '',
        numberOfWorkers: '',
    })
    const [disableSaveBtn, setDisableSaveBtn] = useState(true);
    
    const [errors, setErrors] = useState({
        fname: '',
        lname: '',
        cnic: '',
        prefferedEmail: '',
    });

    useEffect(() => {
        const hasErrors = Object.values(errors).some(error => error !== '');
        setDisableSaveBtn(hasErrors);
    }, [errors]);

    const [logoPreview, setPreview] = useState(null)

    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))

    const getInfo = async () => {
        const response = await fetch('/api/routes/recruiter/getprofile', {
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
        // console.log("profile response company logo", profileResponse.companyLogo)
        setPreview(profileResponse.companyLogo)

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
            getInfo()
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
            case 'prefferedEmail':
                error = value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
                    ? ''
                    : "Please enter a valid email address, (e.g. example@gmail.com)";
                break;
            default:
                break;
        }
        setErrors({ ...errors, [name]: error });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // setProfile(Object.assign({}, profile, { companyLogo: reader.result }));
            setProfile({...profile, companyLogo: reader.result });
            setPreview(reader.result);
            alert(reader.result);
        };
        reader.onerror = (error) => {
            console.log("reader Error: ", error);
        };
    };

    const navigateToChangePass = (e) =>{
        e.preventDefault()
        navigate('/changepassword')
    }
    useEffect(() => {
        console.log("here is the companyLogo : ", profile.companyLogo)
    }, [profile])

    const HandleSubmit = async (e) => {
        e.preventDefault()
        if (disableSaveBtn) {
            alert('Please fill in all fields correctly to save profile');
        }
        else
        {
            // console.log("here is the cosadasdampanyLogo : ", profile.companyLogo)
            const response = await fetch('/api/routes/recruiter/setprofile', {
                method: 'POST',
                body: JSON.stringify(profile),
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'accountType': accountType,
                },
            }).then((res) => res.json())



            if (response.status === 'ok') {
                // everythign went fine
                alert('Success fully saved data')
                navigate(localStorage.getItem('accountType') === 'true' ? '/student' : '/recruiter');
            } else {
                alert(response.error)
            }
        }
    }


    return (
        <div>
            <div className='recnavBarHolder'>
                <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            </div>

            <Link to="/recruiter">
                <img className='backbtn' src={backbtn} alt="back button"/>
            </Link>
            <div className='savebtnholder changePasswordBtn'>
                <button className='save_btn chnage_pass_btn' onClick={navigateToChangePass}>Change Password</button>
            </div>

            <div className="Recruiter_Profile_Setup">

                <div className='heading_recruiter_profile_setup'>
                    <h1>Setup/Manage Your Profile</h1>
                    <h3>Click save upon completion</h3>
                </div>
                <form className="rec_setup_form" onSubmit={HandleSubmit}>
                    <h3 className='rec_setup_labels'>General Information</h3>

                    <div className='rec_sep_divs'>
                        <div className='rec_separate_divisions'>
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
                        <div className='rec_separate_divisions'>
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


                    <div className='rec_sep_divs'>
                        <div className='rec_separate_divisions'>
                        <label>CNIC No.</label>
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
                        <div className='rec_separate_divisions'>
                        <label>Email Address</label>
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

                    </div>
                    <div>
                        
                    <h3 className='rec_setup_labels rec_extra_padding'>Company Information</h3>
                    {logoPreview && <div className='logo_preview'>
                        <img src={logoPreview} alt="" className="company-logo-preview" />
                    </div>}
                    </div>
                    <div className='rec_sep_divs rec_extra_padding'>
                        
                        <div className='rec_separate_divisions'>    
                        <label>Current Position</label>
                        <input
                            type="text"
                            name="currentPosition"
                            onChange={handleChange}
                            value={profile.currentPosition}
                            placeholder="Current position"
                            required
                            />
                        </div>
                        <div className='rec_separate_divisions'>
                            
                        <label>Company logo</label>    
                        <input
                            type='file'
                            name='companyLogo'
                            onChange={handleFileChange}
                            
                            />
                        </div>
                    </div>


                    <div className='rec_sep_divs'>
                        <div className='rec_separate_divisions'>
                            
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            onChange={handleChange}
                            value={profile.companyName}
                            placeholder="Company Name"
                            required
                            />
                        </div>
                        
                        <div className='rec_separate_divisions'>
                        <label>Head office location</label>
                        <input
                            type="text"
                            name="companyLocation"
                            onChange={handleChange}
                            value={profile.companyLocation}
                            placeholder="Location of head office"
                            required
                            />
                        </div>

                    </div>

                    <div className='rec_sep_divs'>
                        <div className='rec_separate_divisions'>
                            
                        <label>Date of Establishment</label>
                        <input
                            type="date"
                            name="dateEstablished"
                            onChange={handleChange}
                            value={profile.dateEstablished}
                            required
                            />
                        </div>

                        <div className='rec_separate_divisions'>
                        <label>Domain of work</label>
                        <input
                            type="text"
                            name="domainOfWork"
                            onChange={handleChange}
                            value={profile.domainOfWork}
                            placeholder="Company's domain of work"
                            required
                            />
                        </div>
                    </div>

                    <div className='rec_sep_divs slider_setting'>

                        <h3 className='slider'>number Of Workers less than or equal to: {profile.numberOfWorkers}</h3>
                        <input
                            type="range"
                            min="50"
                            max="1000"
                            step="50"
                            name="numberOfWorkers"
                            value={profile.numberOfWorkers}
                            onChange={handleChange}
                            required
                        />
                        
                        <button className='save_btn'>Save Profile</button>
                        

                    </div>
                    {error && <div className="error">{error}</div>}

                </form>
            </div>
        </div>
    )
}

export default ProfileSetup
