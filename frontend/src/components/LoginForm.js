import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "../css/LoginForm.css"
import Navbar from './Navbar'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [accountType, setType] = useState(null) // this account type
    const [error, setError] = useState('')
    const navigate = useNavigate()


    const HandleSubmit = async (e) => {
        e.preventDefault()
        const user = { email, password, accountType }

        const response = await fetch('/api/routes/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                accountType
            })
        }).then((res) => res.json())

        if (response.status === 'ok') {
            // everythign went fine
            console.log('Got the token: ', response.data)
            localStorage.setItem('token', response.data)
            localStorage.setItem('accountType', response.accountType)
            alert('Success')
            //
            setType(response.accountType)

            navigate(localStorage.getItem('accountType') === 'true' ? '/student' : '/recruiter');

        } else {
            alert(response.error)

        }

        // const json= await response.json();
        // if(!response.ok){
        //     setError(json.error)
        // }
        // if(response.ok){
        //     setEmail('')
        //     setPassword('')
        //     setType('1')
        //     setError('NULL')
        //     console.log("new user added")
        // }

    }


    const navigateToSignup = (event) => {
        event.preventDefault()
        navigate('/register')
      }

    return (
        <div>
            <Navbar logoColor={'#21364B'} navbtnColor={'#FCC125'} />
            <div className='login_main'>
                <div className='form1'>
                    <form className="create1" onSubmit={HandleSubmit}>

                        <h3>Login to your account</h3>
                        <input
                            type="text"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Enter your email"
                        />
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Enter your password"
                        />
                        <button>Login</button>

                        {error && <div className="error">{error}</div>}
                        
                    <div className="hide">
                    <h4>Sign up and discover a great amount of new opportunities?</h4>
                    <button className="btnSignUp" onClick={navigateToSignup}>Sign Up</button>
                    </div>

                    </form>
                </div>
                <div className="alternativeSignIn">
                    <div>
                        <h1>New Here?</h1>
                        <h4>Sign up and discover a great amount <br/> of new opportunities?</h4>
                        <button className="btnSignUp" onClick={navigateToSignup}>Sign Up</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LoginForm 