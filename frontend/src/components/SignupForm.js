import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Signup.css";
import Navbar from "./Navbar";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setType] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  const [profile, setProfile] = useState({
    email: ""
  });
  const passwordPattern = /^.{6,}$/;

  const [errors, setErrors] = useState({
    email: "",
    password:""
  });
  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== '');
    setDisableSaveBtn(hasErrors);
}, [errors]);



const handleEmailChange = (e) =>{
  setEmail(e.target.value)

  let error = "";
   
  error = e.target.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
    ? ""
    : "Please enter a valid email address, (e.g. example@gmail.com)";
    setErrors({ ...errors, ["email"]: error });
    console.log(errors)

}
const handlePasswordChange = (e) =>{
  setPassword(e.target.value)

  let error = "";
   
  error = e.target.value.match(passwordPattern)
    ? ""
    : "Password length should be atleast 6.";
    setErrors({ ...errors, ["password"]: error });
    console.log(errors)

}

  const handleChange = (e) => {
    // setEmail(e)
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
    // validate input
    let error = "";
    if (name == "email") {
      error = value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
        ? ""
        : "Please enter a valid email address.";
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disableSaveBtn) {
      alert("Please fill in all fields correctly to save profile");
    } else {
      const user = { email, password, accountType };

      const response = await fetch("/api/routes/register", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();

      console.log(response.status);

      if (response.ok) {
        setEmail("");
        setPassword("");
        setType("1");
        setError("NULL");
        alert("successfully registered");
        console.log("new user added");
      } else {
        let errorMessage = "Something went wrong. Please try again later.";
        if (response.status === 400) {
          errorMessage = "Invalid input, please check your inputs";
        } else if (response.status === 409) {
          errorMessage = "User already exists";
        }
        alert(errorMessage);
      }
    }
  };

  const navigateToLogin = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  // useEffect(() => {
  //   {document.getElementsByClassName("navbtns").style.color = "blue";}
  // }, [])

  return (
    <div>
      <Navbar logoColor={"#FCC125"} navbtnColor={"#21364B"} />
      <div className="signup_main">
        <div className="alternativeSignup">
          <div>
            <h1>Already Have an Account?</h1>
            <button className="signInBtn" onClick={navigateToLogin}>
              Sign In
            </button>
          </div>
        </div>

        <div className="form">
          <form className="create" onSubmit={handleSubmit}>
            <h3>Sign up</h3>
            <div className="individual_divisions" >

            <input
              type="text"
              onChange={handleEmailChange}
              value={email}
              placeholder="Enter your email"
              required
              />
            {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="individual_divisions" >

            <input
              type="password"
              name="password"
              onChange={handlePasswordChange}
              value={password}
              placeholder="Enter your password"
              />
            {errors.password && <span className="error">{errors.password}</span>}

            </div>
            {/* <input
            type="password"
            name="checkPassword"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            autoComplete="off"
            placeholder="Re-enter your password"
          /> */}

            <div className="radios">
              <div className="radioBtns">
                <label>Select if you are a student</label>
                <div className="customRadioContainer">
                  <input
                    type="radio"
                    name="accountType"
                    onChange={(e) => setType(1)}
                    value={1}
                    id="studentRadio"
                    checked={accountType === 1}
                  />
                  <label htmlFor="studentRadio" className="customRadioBtn">
                    <span className="customRadioBtnInner"></span>
                  </label>
                </div>
              </div>

              <div className="radioBtns">
                <label>Select if you are a recruiter</label>
                <div className="customRadioContainer">
                  <input
                    type="radio"
                    name="accountType"
                    onChange={(e) => setType(0)}
                    value={0}
                    id="recruiterRadio"
                    checked={accountType === 0}
                  />
                  <label htmlFor="recruiterRadio" className="customRadioBtn">
                    <span className="customRadioBtnInner"></span>
                  </label>
                </div>
              </div>
            </div>

            <button className="signUpBtn">Sign up</button>

            <div className="hide2">
              <h4>Already have an account?</h4>
              <button className="signInBtn" onClick={navigateToLogin}>
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
