import { useState } from "react"

export default function LoginBar(props) {
    const [innerLogMail, setInnerLogMail] = useState("");
    const [innerLogPwd, setInnerLogPwd] = useState("");
    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                {props.error && props.userSubmitted && <div className="alert alert-danger mt-1" role="alert" style={{ marginLeft: '30px', marginRight: '30px' }}>
                    {props.error.message}
                </div>}
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Mail</label>
                        <input
                            className="form-control mt-1"
                            placeholder="Enter mail"
                            value={innerLogMail}
                            onChange={(e) => setInnerLogMail(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            value={innerLogPwd}
                            onChange={(e) => setInnerLogPwd(e.target.value)}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="button" className="btn btn-primary"
                            onClick={() => { props.onSubmitMail(innerLogMail); props.onSubmitPwd(innerLogPwd); props.onSubmitUserSubmitted(true) }}>
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}