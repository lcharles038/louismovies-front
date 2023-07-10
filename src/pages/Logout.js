import authService from "../services/authService"
import { useContext, useEffect } from "react";


export default function Logout() {
    const { setCurrentUser } = useContext(authService.UserContext);
    const { success, error } = authService.useLogout();

    useEffect(() => {
        setCurrentUser(undefined);
    }
        , [setCurrentUser]);

    if (success) {
        return (
            <div className="container">
                <h1>You have been logged out successfully</h1>
            </div>
        )
    }

    else {
        return (
            <div className="container">
                <h1>{error}</h1>
            </div>
        )
    }


}