import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useMemo } from "react";
import './App.css';

// components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Register from "./pages/Register";
import Login from "./pages/Login";
import People from "./pages/People";
import Logout from "./pages/Logout";
import InfiniteSearch from "./pages/InfiniteSearch";
import NotFound from "./pages/errors";

// services
import authService from "./services/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import bearerIntercept from "./interceptors/fetchInterceptor";




export default function App() {

    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
    const UserContext = authService.UserContext;

    bearerIntercept();

    const user = useMemo(
        () => ({ currentUser, setCurrentUser })
        , [currentUser]);

    authService.useRefreshToken(currentUser);

    return (
        <BrowserRouter>
            <div className="App">
                <UserContext.Provider value={user}>
                    <NavBar />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/infinite-search' element={<InfiniteSearch />} />
                        <Route path='/movie' element={<Movie />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/logout' element={<Logout />} />
                        <Route element={<ProtectedRoute redirectPath="/login" />}>
                            <Route path='/people' element={<People />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                </UserContext.Provider>
            </div>
        </BrowserRouter>
    );
}
