import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ChangePassword.css";
import backbtn from "./../icons/arrow_back_blue.svg";
import Navbar from "./../components/Navbar";

const PasswordChange = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [accountType, setAccountType] = useState(
        localStorage.getItem("accountType")
    );
    const [displayPage, setDisplayPage] = useState(false);
    const [disableSaveBtn, setDisableSaveBtn] = useState(true);
    const passwordPattern = /^.{6,}$/;
    const [passMatched, setPassMatched] = useState(false);

    const [errors, setErrors] = useState({
        newPassword: "",
    });
    useEffect(() => {
        const hasErrors = Object.values(errors).some((error) => error !== "");
        setDisableSaveBtn(hasErrors);
    }, [errors]);

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);

        let error = "";

        error = e.target.value.match(passwordPattern)
            ? ""
            : "Password length should be atleast 6.";
        setErrors({ ...errors, ["newPassword"]: error });
        console.log(errors);
    };


    const handleConfirmPassword = (e) => {
        setConfirmNewPassword(e.target.value);

        let error = "";

        if (e.target.value === newPassword) {
            if (e.target.value.length === newPassword.length) {
                error = "";
                setPassMatched(true)

            } else {
                error = "New password and confirm password length does not match!";
            }
        } else {
            error = "New password and confirm password does not match!";
        }

        setErrors({ ...errors, confirmNewPassword: error });
        console.log(errors);
    };

    const verifyAccessAttempt = async () => {
        const response = await fetch("/api/routes/verifyuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                accountType,
            }),
        });

        if (!response.ok) {
            console.error("error");
            navigate("/login");
            alert("unauthorized request, redirected");
        } else {
            setDisplayPage(true);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            verifyAccessAttempt();
        } else {
            navigate("/login");
            // alert("unauthorized request, redirected")
        }
    }, []);

    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (disableSaveBtn) {
            alert("Please fill in all fields correctly to save profile");
        } else {

            const response = await fetch("/api/routes/changepassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    oldPassword,
                    newPassword,
                    confirmNewPassword,
                }),
            }).then((res) => res.json());

            if (response.status === "ok") {
                console.log("Got the token: ", response.data);
                alert("Password Successfully Changed");
                navigate(-1);
            } else {
                alert(response.message);
            }
        }
    };

    const navigateBack = (event) => {
        event.preventDefault();
        navigate(-1);
    };

    return (
        displayPage && (
            <div>
                <div className="stud_nav">
                    <Navbar logoColor={"#FCC125"} navbtnColor={"#FCC125"} />
                </div>
                <img
                    className="backbtn" 
                    src={backbtn}
                    onClick={navigateBack}
                    alt="back button"
                />
                <div className="change_password_main">
                    <div className="form1 changePassForm">
                        <form className="create1" id='change-pass' onSubmit={HandleSubmit}>
                            <h3>Change Your Password</h3>

                            <label>Current Password</label>
                            <input
                                type="password"
                                onChange={(e) => setOldPassword(e.target.value)}
                                value={oldPassword}
                                placeholder="Enter your current password"
                                required
                            />
                            <label>New Password</label>
                            <input
                                type="password"
                                onChange={handlePasswordChange}
                                value={newPassword}
                                placeholder="Enter new password"
                                required
                            />
                            {errors.newPassword && <span className="error">{errors.newPassword}</span>}
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                onChange={handleConfirmPassword}
                                value={confirmNewPassword}
                                placeholder="Enter new password again"
                                required
                            />
                            {errors.confirmNewPassword && <span className="error">{errors.confirmNewPassword}</span>}
                            {!errors.confirmNewPassword && passMatched && <span className="error">password matched</span>}
                            <div id='change-pass-btn'>
                            <button >Change Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
};

export default PasswordChange;
