import { useState } from "react";
import authService from "../services/authService";
import RegisterBar from "../components/RegisterBar";
import { Navigate } from "react-router-dom";


export default function Register() {
    const [registerMail, setRegisterMail] = useState("");
    const [registerPwd, setRegisterPwd] = useState("");
    const [registerSubmitted, setRegisterSubmitted] = useState(false);
    const { successfullMessage, error } = authService.useRegister(registerMail, registerPwd)
    const [redirect, setRedirect] = useState(false);

    if (!successfullMessage) {
        return (
            <div className="container">
                <RegisterBar onSubmitMail={setRegisterMail} onSubmitPwd={setRegisterPwd} onSubmitRegisterSubmitted={setRegisterSubmitted} error={error} registerSubmitted={registerSubmitted} />
            </div>
        )
    }

    else {
        setTimeout(() => setRedirect(true), 2000);
        if (!redirect) {
            return (
                <div className="alert alert-primary" role="alert">
                    <h3>{successfullMessage}, you will be redirected to the login page</h3>
                </div>
            )
        }
        else {
            return (
                <Navigate to="/login" />
            )
        }
    }
}
