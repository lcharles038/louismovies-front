import { Link } from "react-router-dom";
import authService from "../services/authService";
import { useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";





export default function NavBar() {
    const { currentUser } = useContext(authService.UserContext)
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchName, setSearchName] = useState(searchParams.get("searchName") ? searchParams.get("searchName") : "");
    const navigate = useNavigate();

    const handleSearch = () => {
        setSearchParams({ "searchName": searchName });
        navigate({
            pathname: "/infinite-search",
            search: "?searchName=" + searchName,
        })
    }
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" >
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Home</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/infinite-search" className="nav-link">Search</Link>
                        </li>
                        {!currentUser && <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                        }
                        {!currentUser && <li className="nav-item">
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                        }

                    </ul>
                    <form className="d-flex">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {currentUser && <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {currentUser}
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><Link to="/logout" className="dropdown-item" >Logout</Link></li>
                                </ul>
                            </li>
                            }
                        </ul>
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(event) => { setSearchName(event.target.value) }} />
                        <button className="btn btn-outline-success" type="button" onClick={handleSearch} >Search</button>
                    </form>
                </div>
            </div>
        </nav>
    )
}