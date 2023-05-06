import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../../css/recruiterHome.css'
import icon1 from './../../icons/rec_icon1.svg'
import icon2 from './../../icons/rec_icon2.svg'
import icon3 from './../../icons/rec_icon3.svg'
import Navbar from './../../components/Navbar'
// see code explainations at the end of the code
const Home = () => {
    const navigate = useNavigate()

    const [users, setUsers] = useState(null) // in the beginning 'users' state (that we created) will be null. but if response.ok is true, then we will update state using setUser
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [accountType, setAccountType] = useState(localStorage.getItem('accountType'))
    const [displayTandC, setDisplayTandC] = useState(true)



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

        if (json.accountType === "true") {

            navigate('/login')
            // alert("unauthorized request, redirected")
        }



        // if(!localStorage.getItem('profileExists')){
        //     console.log("profile doesnt exist")
        //     navigate('./setprofile')
        // }
    }

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





    const handle_option_1 = (event) => {
        event.preventDefault()
        console.log("1")
        navigate('./postjob');
    }
    const handle_option_2 = (event) => {
        event.preventDefault()
        console.log("2")
        navigate('./postedjobs');
    }
    const handle_option_3 = (event) => {
        event.preventDefault()
        console.log("3")
        navigate('./setprofile');
    }


    useEffect(() => {

        if (localStorage.getItem('token')) {
            verifyAccessAttempt()
            tAndC()
        } else {
            navigate('/login')
        }
    }, [])

    // useEffect(() => {
    // // check if session exist or not
    //     if (!localStorage.getItem('token') || localStorage.getItem('accountType') !== 'false') {
    //         alert("unauthorized request, redirecting...")
    //         navigate('/login')
    //     }
    // }, [navigate]);

    // const setupProfile = (event) => {
    //     event.preventDefault()
    //     console.log("set profile")
    //     navigate('./setprofile');
    // }


    return (
        <div className='rec_home_body'>
            <Navbar logoColor={'#FCC125'} navbtnColor={'#FCC125'} />
            <div className="recruiter_home">
                {/* <button onClick={event => setupProfile(event)}>profile settings</button>  */}
                <div className='rec_home_label'>
                    <h1>Recruiter's Homepage</h1>
                </div>
                <div className='recruiter_menu'>
                    <div className='select_option' onClick={event => handle_option_1(event)}>
                        <div className='rec_home_icon'><img className='rec_icons' src={icon1} alt="logo" /></div>
                        <div className='rec_home_option'>Post Jobs</div>
                        <div className='rec_home_desc'>Post jobs to discover the best candidates for you immediately from our candidate pool</div>
                    </div>
                    <div className='select_option' onClick={event => handle_option_2(event)}>
                        <div className='rec_home_icon'><img className='rec_icons' src={icon2} alt="logo" /></div>
                        <div className='rec_home_option'>Your Jobs</div>
                        <div className='rec_home_desc'>Here you can see all of your previously posted jobs and can get ranked candidate profiles based on each job. Also manage the status of job</div>
                    </div>
                    <div className='select_option' onClick={event => handle_option_3(event)}>
                        <div className='rec_home_icon'><img className='rec_icons' src={icon3} alt="logo" /></div>
                        <div className='rec_home_option'>Manage profile</div>
                        <div className='rec_home_desc'>Made a mistake, or simply want to make some changes? no need to worry! you can update profile info here</div>
                    </div>
                </div>

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
        </div>
    )
}

export default Home
