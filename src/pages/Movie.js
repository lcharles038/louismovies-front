import React, { useContext } from "react";
import { Button } from "reactstrap";
import { Badge } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import movieService from "../services/movieService";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import Rating from "../components/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faLock } from "@fortawesome/free-solid-svg-icons";
import authService from "../services/authService";


const lookup = require('country-code-lookup')
const maxGradeByCritics = (source) => {
    if (source === "Internet Movie Database") {
        return 10
    }
    return 100;
}

export default function Movie() {

    const { currentUser } = useContext(authService.UserContext)

    const getColorForGenre = (genre) => {
        const genreColors = [
            { genre: "Comedy", color: "primary" },
            { genre: "Biography", color: "primary" },
            { genre: "Sci-Fi", color: "info" },
            { genre: "Thriller", color: "info" },
            { genre: "Crime", color: "danger" },
            { genre: "Romance", color: "danger" },
            { genre: "Horror", color: "dark" },
            { genre: "Drama", color: "dark" },
            { genre: "Family", color: "warning" },
            { genre: "Action", color: "warning" },
            { genre: "Fantasy", color: "success" },
            { genre: "Adventure", color: "success" },
        ]
        let color = genreColors.filter(e => e.genre === genre).map((e) => e.color)[0];
        if (!color) { color = "secondary" };
        return color;
    }


    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idMovie = searchParams.get("id");
    const movieInfo = movieService.useIndividualMovieInfo(idMovie);

    const columns = [
        { headerName: "Name", field: "name" },
        { headerName: "Role", field: "category" },
        { headerName: "Characters", field: "characters" },
        { headerName: "Detail", field: "id", cellRenderer: SeePeopleRenderer, cellRendererParams: { currentUser: currentUser } }
    ]

    if (movieInfo) {
        const boxoffice = movieInfo.boxoffice;
        return (
            <div className="container" style={{ padding: "3em" }}>
                <div className="row py-3">
                    <div className="col-12">
                        <h1>{movieInfo.title} </h1>
                    </div>
                </div>
                <div className="row py-3">
                    <div className="col-4 ">
                        <img src={movieInfo.poster} alt="Film poster" width='100%' />
                    </div>
                    <div className="col-8" align={"left"}>
                        <div className="row">
                            <div className="col-6">
                                <div className="flex-row text-success">{movieInfo.year} - {movieInfo.country} <div className="d-flex">
                                    {movieInfo.country && movieInfo.country.replace(/, /g, ',').split(",").map((c, index) =>
                                        lookup.byCountry(c) && <img key={"flag" + index} src={"https://flagsapi.com/" + lookup.byCountry(c).iso2 + "/flat/64.png"} alt="flag" width='7%' />)}
                                </div>
                                </div>
                                <div className="flex-row">
                                    <div className="text-dark d-inline-flex">Runtime:&nbsp;</div>
                                    <div className="text-muted d-inline-flex">{movieInfo.runtime} minutes</div>
                                </div>
                                {(movieInfo.boxoffice !== 0) &&
                                    <div className="flex-row">
                                        <div className="text-dark d-inline-flex">Boxoffice:&nbsp;</div>
                                        <div className="text-muted d-inline-flex">
                                            {new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(boxoffice)}
                                        </div>
                                    </div>}
                            </div>
                            <div className="col-6 d-flex">
                                {movieInfo.genres && movieInfo.genres.map((specificGenre, index) =>
                                    <div className="px-1" key={"badge" + index}> <Badge bg={getColorForGenre(specificGenre)}>{specificGenre} </Badge></div>)}
                            </div>
                        </div>
                        <div className="flex-row" style={{ paddingTop: '1em' }}>
                            <h6>Ratings</h6>
                        </div>
                        <div className="flex-row">
                            {movieInfo.ratings && movieInfo.ratings.map((rating, index) => rating.value ? (<div key={"rating" + index}><div className="text-muted d-inline-flex" > {rating.source}:&nbsp; </div> <div className="text-muted d-inline-flex">  < Rating note={rating.value} noteMaxi={maxGradeByCritics(rating.source)} /> </div> </div>) : null)}
                        </div>
                        <div className="flex-row overflow-hidden py-3">
                            <h6>People involved in the movie</h6>
                            <div className="ag-theme-balham" style={{ height: "270px", width: "90%" }}>
                                <AgGridReact
                                    columnDefs={columns}
                                    rowData={movieInfo.principals}
                                    pagination={false}
                                    onGridReady={(params) => {
                                        params.api.sizeColumnsToFit();
                                        window.addEventListener('resize', function () {
                                            setTimeout(function () {
                                                params.api.sizeColumnsToFit();
                                            });
                                        });
                                    }}
                                    getRowClass={params => {
                                        if (params.node.rowIndex % 2 === 0) {
                                            return 'blue-effect';
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12" style={{ textAlign: "left", fontStyle: "italic" }}>
                        {movieInfo.plot}
                    </div>
                </div>



                <Button
                    color="info"
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate("/infinite-search")}>
                    Back
                </Button>
            </div>
        )
    }

    else {
        return (
            <h1>Loading...</h1>
        )
    }
}


const SeePeopleRenderer = (params) => {

    const navigate = useNavigate();
    const link = "/people/?id=" + params.value;

    const buttonClicked = () => {
        navigate(link);
    }

    if ((params.currentUser)) {
        return (
            <span>
                <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faMagnifyingGlass} onClick={() => {
                    buttonClicked()
                }} />
            </span>
        )
    }
    else {
        return (
            <span>
                <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faLock} onClick={() => {
                    buttonClicked()
                }} />
            </span>
        )
    }
}

