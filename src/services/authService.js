import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { decodeToken } from "react-jwt";


const UserContext = createContext(
    {
        currentUser: undefined,
        setCurrentUser: () => { },
    }
)


const storeCredentials = (credentials) => {
    if (credentials) {
        const usermail = decodeToken(credentials.bearerToken.token).email;
        localStorage.setItem("principals", JSON.stringify({ usermail: usermail, ...credentials }));
    }
}

const getBearerToken = () => {
    if (localStorage.getItem("principals")) {
        return (
            JSON.parse(localStorage.getItem("principals")).bearerToken
        )
    }
    return null;

}

const getRefreshToken = () => {
    if (localStorage.getItem("principals")) {
        return (
            JSON.parse(localStorage.getItem("principals")).refreshToken
        )
    }
    return null;

}



function postRegister(mail, pwd) {
    const url = "http://sefdb02.qut.edu.au:3000/user/register"
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: mail, password: pwd })
    }
    )

}

export function useRegister(registerMail, registerPwd) {
    const [successfullMessage, setSuccessfullMessage] = useState(undefined);
    const [error, setError] = useState(null);
    useEffect(
        () => {
            if (registerMail && registerPwd) {
                postRegister(registerMail, registerPwd)
                    .then(res => res.json())
                    .then(json => {
                        if (json.error) {
                            throw new Error(json.message)
                        }
                        else {
                            return (
                                json.message
                            )
                        }
                    })
                    .then(message => setSuccessfullMessage(message))
                    .catch(e => {
                        setError(e);
                        setSuccessfullMessage(undefined)
                    })
            }
            else {
                setSuccessfullMessage(undefined);
                setError({ error: true, message: "Please enter mail and password to register" })
            }
        },
        [registerMail, registerPwd]
    )
    return ({ successfullMessage, error });
}








function postLogin(mail, pwd) {
    const url = "http://sefdb02.qut.edu.au:3000/user/login"
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: mail, password: pwd, longExpiry: false })

    })
        .then((res) => res.json())
        .then((json) => {
            if (json.error) {
                throw new Error(json.message);
            }
            else {
                storeCredentials(json)
            }
        })
        .catch((error) => {
            localStorage.removeItem("principals");
            throw (error)
        }
        );
}

const getCurrentUser = () => {
    const credentials = JSON.parse(localStorage.getItem("principals"));
    if (credentials) {
        // Check rt is not expired
        const refreshToken = decodeToken(credentials.refreshToken.token);
        if (refreshToken.exp > new Date().getTime() / 1000) return credentials.usermail;
    }
    // no valid redentials, remove principals
    localStorage.removeItem("principals")
    return undefined;
};


const postLogout = () => {
    const url = "http://sefdb02.qut.edu.au:3000/user/logout"
    const refreshToken = getRefreshToken()?.token;
    if (refreshToken) {
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        })
            .then(() => { localStorage.removeItem("principals") })
            .catch(error => { throw (error) })
    }
    else {
        return Promise.reject(new Error("You are already logged out"))
    }
}

const useLogout = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        () => {
            postLogout()
                .then(() => setSuccess(true))
                .catch((e) => {
                    setSuccess(false);
                    setError(e.message)
                })
        }, []
    )

    return ({ success, error });
}

const useLogin = (mail, pwd) => {
    const [error, setError] = useState(null);
    const [loggedUser, setLoggedUser] = useState(mail);

    useEffect(() => {
        if (mail && pwd) {
            postLogin(mail, pwd)
                .then(() => setLoggedUser(mail))
                .catch(e => {
                    setError(e);
                    setLoggedUser(undefined)
                })
        }
        else {
            setLoggedUser(undefined);
            setError({ error: true, message: "Please enter mail and password to login" })
        }
    },
        [mail, pwd]);

    return ({ loggedUser, error })

}

const postRefresh = () => {
    const url = "http://sefdb02.qut.edu.au:3000/user/refresh"
    const refreshToken = getRefreshToken();
    if (refreshToken) {
        return (fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: refreshToken.token })

        }))
            .then((res) => res.json())
            .then((json) => {
                if (!json.error) {
                    storeCredentials(json)
                }
                else {
                    console.log("refresh failed with error " + json.message)
                }
            })
            .catch((error) => console.log(error));
    }

    else {
        return Promise.reject(new Error("No refresh token found"))
    }
};


const useRefreshToken = (currentUser) => {
    const [loopId, setLoopId] = useState(-1);
    useEffect(
        () => {
            if (currentUser) {
                postRefresh()
                    .then(() => {
                        if (loopId === -1) {
                            const period = getBearerToken().expires_in * 900;
                            console.log("token will be refreshed every " + period / 1000 + " sec")
                            setLoopId(setInterval(() => {
                                postRefresh().then(() => console.log("bearer token successfully refreshed"))
                                    .catch(() => console.log("error while refreshing bearer token"))
                            }
                                , period))
                        }

                    }
                    )
                    .catch(() => console.log("error in refreshing bearer token before launching loop"))
            }
            else {
                if (loopId !== -1) {
                    clearInterval(loopId);
                    setLoopId(-1);
                    console.log("stop refresh token because nobody logged in")
                }
            };

            return () => {
                if (loopId !== -1) {
                    console.log("Unmounting App, clearing loopId");
                    clearInterval(loopId);
                }
            }

        },
        [currentUser, loopId]
    )
}


const authService = { useRegister, useLogin, getCurrentUser, useLogout, UserContext, useRefreshToken, getBearerToken };

export default authService;





