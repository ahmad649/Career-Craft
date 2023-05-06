import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Navbar.css"
import logo1 from '../icons/logo1.svg';
import logo2 from '../icons/logo2.svg';
import hamburger from '../icons/hamburger.svg'

const Navbar = (props) => {

    
    const navigate = useNavigate()
    
    const [logocolor,setlogocolor] = useState(props.logoColor)
    const logo = logocolor === '#FCC125' ? logo1 : logo2;

    const [navbtnscolor,setnavbtnscolor] = useState(props.navbtnColor)
    const [showLogout,setLogoutVisibility] = useState(false)

    const [showNavLinks,setShowNavLinks] = useState(false)


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('accountType');
        setLogoutVisibility(false)
        navigate('/login');
    }

    const navigateToSearchJobs = (event) => {
        event.preventDefault()
        navigate('/searchjobs')
    }
    
    const navigateToAboutPage = (event) => {
        event.preventDefault()
        navigate('/searchjobs')
    }

    const toggleNavLinks = (event) =>{
        event.preventDefault()
        setShowNavLinks(!showNavLinks)
    }

    useEffect(() => {
        if(localStorage.getItem('token')){
            console.log("we got em" ,localStorage.getItem('token') )
            setLogoutVisibility(true)
        }else{
            setLogoutVisibility(false)
        }
    }, [localStorage.getItem('token')])




    const containerStyles = {

        '@media screen and (min-width: 48em)': {
            backgroundColor: '#FCC125',
        }
    };

    

// the logout button should be hidden if localStorage.removeItem('token') is null
    return (
        <header>
            <div className="container" >
                <div className="left_bar">
                    <img className='logo' src={logo} alt="logo"/>
                </div>
                    




                <div className="right_bar2">
                    <a className='navbtns' id='navbtns-hover' onClick={navigateToSearchJobs} style={{color: navbtnscolor}}>Search Jobs</a>
                    {<a className='navbtns' id='navbtns-hover' onClick={navigateToAboutPage} style={{color: navbtnscolor}}>About</a>}
                    { showLogout &&  <a className='navbtns' id='navbtns-hover' onClick={logout}  style={{color: navbtnscolor}}>Logout</a> }
                </div>



                {/* <div className="right_bar2">
                <img className='menu_controller' src={logo} onClick={toggleNavLinks} alt="logo"/>
                    {showNavLinks && <ul>
                        <li>
                            <a className='navbtns' onClick={navigateToSearchJobs} style={{color: navbtnscolor}}>Search Jobs</a>
                        </li>
                        <li>
                            <a className='navbtns' onClick={navigateToAboutPage} style={{color: navbtnscolor}}>About</a>
                        </li>
                        <li>
                            { showLogout &&  <a className='navbtns' onClick={logout}  style={{color: navbtnscolor}}>Logout</a> }
                        </li>
                    </ul>}
                </div> */}

                <div className="right_bar">
                <img className='menu_controller' src={hamburger} onClick={toggleNavLinks} alt="logo"/>
                    {showNavLinks && <ul>
                        <li>
                            <a className='navbtns' onClick={navigateToSearchJobs} style={{color: navbtnscolor}}>Search Jobs</a>
                        </li>
                        <li>
                            <a className='navbtns' onClick={navigateToAboutPage} style={{color: navbtnscolor}}>About</a>
                        </li>
                        <li>
                            { showLogout &&  <a className='navbtns' onClick={logout}  style={{color: navbtnscolor}}>Logout</a> }
                        </li>
                    </ul>}
                    
                </div>





            </div>
        </header> 
    )

}

export default Navbar