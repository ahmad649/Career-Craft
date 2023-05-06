// see code explainations at the end of the code
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from './../components/Navbar'
import icon1 from '../icons/home_icon1.svg'
import icon2 from '../icons/home_icon2.svg'
import scrollIcon2 from './../icons/yellow_scroll.svg';
import "./Home.css";
const Home = () => {

  const [users, setUsers] = useState(null) // in the beginning 'users' state (that we created) will be null. but if response.ok is true, then we will update state using setUser
  const navigate = useNavigate()

  const navigateToLogin = (event) => {
    event.preventDefault()
    navigate('/login')
  }

  const handleClickScroll = () => {
    const element = document.getElementById('allobjectiveshome');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const navigateToSignup = (event) => {
    event.preventDefault()
    navigate('/register')
  }
  useEffect(() => {
    
  }, [])
  
  return (
    
    <div className="home">
      <div className="landingPageNav">
        <Navbar logoColor ={'#FCC125'} navbtnColor={'#FCC125'}/>
      </div>
      {/* <h2>home for,, now</h2> */}
      
      <div className="up_back">
      <div className="Top">
        <div className="content">
          <h1>
            <span>Career</span> Craft
          </h1>
          <h3>An AI-powered web application for career counselling and progression!</h3>
          <p> We're not just a job board, we're a community of career-focused individuals <br/> who are passionate about helping students and recruiters achieve their goals</p>
          <div className="Topbtns">

            <button className="TopLbtn" onClick={navigateToLogin}>Sign in</button>

            <button className="TopRbtn" onClick={navigateToSignup}>Sign up</button>

          </div>
          {/* <img className='top_icon' src={icon2} alt="logo"/> */}
        </div>
        <div className="Right">
          <img className='right_icon' src={icon1} alt="logo"/>         
        </div>
      </div>
        <img className='scroll_Icon_2' src={scrollIcon2} onClick={handleClickScroll}/>  
      </div> 
      <div className="Bottom" id="allobjectiveshome">
        <h1>Our objectives</h1>
      </div>
      <div className="cards">
        <div className="card">
          <div>
            <h1>Help job seekers find their dream job</h1>
            <p>
              The primary objective of career craft should be to help job seekers find their dream job. This can be achieved by providing a user-friendly platform that integrates job postings from multiple job sites at a single platform
            </p>
          </div>
        </div>

        <div className="card">
          <div>
            <h1>Connect employers with qualified candidates</h1>
            <p>
              Another important objective of career craft is to connect employers with qualified candidates. Career Craft provides a platform where employers can post their job openings and reach out to a large pool of talented candidates
            </p>
          </div>
        </div>

        <div className="card">
          <div>
            <h1>Provide Career Guidance To Students and Job Seekers</h1>
            <p>
              Our object is to provide tailored career path suggestions and identify missing skills, so that job seekers can make informed decisions about their career goals and take actionable steps to achieve them
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


