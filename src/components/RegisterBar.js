import { useState } from "react"

export default function RegisterBar(props) {
    const [innerRegisterMail, setInnerRegisterMail] = useState("");
    const [innerRegisterPwd, setInnerRegisterPwd] = useState("");
    const [innerRegisterConfirmPwd, setInnerRegisterConfirmPwd] = useState("");
    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                {props.error && props.registerSubmitted && <div className="alert alert-danger mt-1" role="alert" style={{ marginLeft: '30px', marginRight: '30px' }}>
                    {props.error.message}
                </div>}
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Register</h3>
                    <div className="form-group mt-3">
                        <label>Mail</label>
                        <input
                            className="form-control mt-1"
                            placeholder="Enter mail"
                            value={innerRegisterMail}
                            onChange={(e) => setInnerRegisterMail(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            value={innerRegisterPwd}
                            onChange={(e) => setInnerRegisterPwd(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter same password"
                            value={innerRegisterConfirmPwd}
                            onChange={(e) => setInnerRegisterConfirmPwd(e.target.value)}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="button" className="btn btn-primary" disabled={innerRegisterPwd !== innerRegisterConfirmPwd}
                            onClick={() => { props.onSubmitMail(innerRegisterMail); props.onSubmitPwd(innerRegisterPwd); props.onSubmitRegisterSubmitted(true) }}>
                            Register
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}