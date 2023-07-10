import { useState, useEffect } from "react";
import authService from "../services/authService";
import LoginBar from "../components/LoginBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";

export default function Login({ onLoggedUser }) {
    const { setCurrentUser } = useContext(authService.UserContext);
    const [logMail, setLogMail] = useState("");
    const [logPwd, setLogPwd] = useState("");
    const [userSubmitted, setUserSubmitted] = useState(false);
    const { loggedUser, error } = authService.useLogin(logMail, logPwd);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const search = location.state?.from?.search || "";
    const from = location.state?.from?.pathname || "/";


    useEffect(() => {
        return () => {
            if (loggedUser) {
                setCurrentUser(loggedUser);
                navigate(from + search, { replace: true })
            }
        }
    }, [loggedUser, redirect, setCurrentUser, navigate, from, search]);



    if (!loggedUser) {
        return (
            <div className="container">
                <LoginBar onSubmitMail={setLogMail} onSubmitPwd={setLogPwd} onSubmitUserSubmitted={setUserSubmitted} error={error} userSubmitted={userSubmitted} />
            </div>
        )
    }
    else {
        setTimeout(() => setRedirect(true), 2000);
        return (
            <div className="alert alert-primary" role="alert">
                <h3>Welcome {loggedUser}, login successfull</h3>
            </div>
        )


    }

}