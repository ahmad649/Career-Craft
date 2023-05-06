import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import TermsAndConditions from './pages/TermsAndConditions';
import SearchJobs from './pages/SearchJobs';
import PasswordChange from './pages/PasswordChange';
import StudentHome from './pages/student/Home';
import SelectedPath from './pages/student/SelectedPath';
import RecruiterHome from './pages/recruiter/Home';
import StudentProfileSetup from './pages/student/ProfileSetup';
import RecruiterProfileSetup from './pages/recruiter/ProfileSetup';
import RecruiterPostJob from './pages/recruiter/PostJob';
import RecruiterPostedJobs from './pages/recruiter/PostedJobs';
import RecruiterSelectedJob from './pages/recruiter/SelectedJob';
import RecruiterSelectedCandidate from './pages/recruiter/SelectedCandidate';
import Navbar from './components/Navbar';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';


function App() {

  const [showLogout,setLogoutVisibility] = useState(false)

  return (
    <div className="App">
      <BrowserRouter>
      {/* <Navbar/> will be rendered for all pages */}
      <div className='pages'>

        <Routes>
          <Route  
            path='/' 
            element={<Home />} 
          />
          <Route  
            path='/terms-and-Conditions' 
            element={<TermsAndConditions />} 
          />
          <Route  
            path='/searchjobs' 
            element={<SearchJobs />} 
          />
          <Route  
            path='/register' 
            element={<SignupForm />} 
          />
          <Route  
            path='/login' 
            element={<LoginForm/>} 
          />
          <Route  
            path='/changepassword' 
            element={<PasswordChange/>} 
          />
          <Route  
            path='/student' 
            element={<StudentHome />} 
          />
          <Route  
            path='/student/selectedpath' 
            element={<SelectedPath />} 
          />
          <Route  
            path='/recruiter' 
            element={<RecruiterHome />} 
          />
          <Route  
            path='/student/setprofile' 
            element={<StudentProfileSetup />} 
          />
          <Route  
            path='/recruiter/postjob' 
            element={<RecruiterPostJob />} 
          />
          <Route  
            path='/recruiter/postedjobs' 
            element={<RecruiterPostedJobs />} 
          />
          <Route  
            path='/recruiter/setprofile' 
            element={<RecruiterProfileSetup />} 
          />
          <Route  
            path='/recruiter/selectedjob' 
            element={<RecruiterSelectedJob />} 
          />
          <Route  
            path='/recruiter/selectedcandidate' 
            element={<RecruiterSelectedCandidate />} 
          />
          
      </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
