import { Link } from "react-router-dom";
import movieService from "../services/movieService";
import Rating from "../components/Rating";

const maxGradeByCritics = (source) => {
    if (source === "Internet Movie Database") {
        return 10
    }
    return 100;
}


const getMessageFromClassification = (classification) => {
    const classificationMessages = [
        { classification: "R", message: ": Restricted - Under 17 requires accompanying parent or adult guardian." },
        { classification: "PG-13", message: ": Parents strongly cautioned - Some material may be inappropriate for children under 13." },
        { classification: "PG", message: ": Parental guidance suggested - Some material may not be suitable for children." },
        { classification: "NC-17", message: ": No One 17 and Under Admitted - The content is only appropriate for adult audiences." },
        { classification: "TV-MA", message: ": Mature Audience Only - This program is specifically designed to be viewed by adults and therefore may be unsuitable for children under 17." },
        { classification: "TV-14", message: ": Programs contain material that parents or adult guardians may find unsuitable for children under the age of 14." },
        { classification: "TV-PG", message: ": Parental Guidance Suggested - This program contains material that parents may find unsuitable for younger children." },
        { classification: "G", message: ": General - Suitable for everyone" }


    ]
    let message = classificationMessages.filter(e => e.classification === classification).map((e) => e.message)[0];
    if (!message) { message = "" };
    return message;
}



export default function RandomMovie() {
    const { selectedMovieInfo, classification, id } = movieService.useRandomMovie();
    if (!selectedMovieInfo || !id) {
        return (
            <h2>Loading...</h2>
        )
    }
    const link = `/movie?id=${id}`;
    return (
        <div className="container" style={{ padding: "2em" }}>
            <div className="row py-3">
                <div className="col-4 ">
                    <Link to={link}>
                        <img src={selectedMovieInfo.poster} alt="Film poster" width='100%' />
                    </Link>
                </div>
                <div className="col-8" align={"left"}>
                    <div className="row">
                        <div className="row" style={{ paddingBottom: '2em' }}>
                            <h2>{selectedMovieInfo.title}</h2>
                        </div>
                        <div className="flex-row">
                            {selectedMovieInfo.country} - {selectedMovieInfo.year}
                        </div>
                        <div className="flex-row text-muted d-inline-flex" >
                            {selectedMovieInfo.genres.join(", ")}
                        </div>
                        {(selectedMovieInfo.principals.filter(p => (p.category === "director")) !== []) ?
                            <div className="flex-row" style={{ paddingTop: '1em' }}>
                                Directed by <span className="flex-row" style={{ fontstyle: "bold" }}> {selectedMovieInfo.principals.filter(p => (p.category === "director")).map(d => d.name).join("and ")}</span>.
                            </div> : null}
                        <div className="flex-row" style={{ paddingTop: '1em' }}>
                            With <span className="flex-row" style={{ fontstyle: "bold" }}> {selectedMovieInfo.principals.filter(p => (p.category === "actor" || p.category === "actress")).map(a => a.name).slice(0, 3).join(", ")}</span>.
                        </div>
                    </div>
                    <div className="flex-row" style={{ paddingTop: '1em' }}>
                        <h6>Ratings</h6>
                    </div>
                    <div className="flex-row">
                        {selectedMovieInfo.ratings && selectedMovieInfo.ratings.map((rating, index) => rating.value ? (<div key={"rating" + index}><div className="text-muted d-inline-flex" > {rating.source}:&nbsp; </div> <div className="text-muted d-inline-flex">  < Rating note={rating.value} noteMaxi={maxGradeByCritics(rating.source)} /> </div> </div>) : null)}
                    </div>
                    <div style={{ fontStyle: "italic", paddingTop: '1em', paddingBottom: '1em' }}>
                        {selectedMovieInfo.plot}
                    </div>
                    {(classification !== "Not Rated" && classification !== "N/A" && classification !== "G" && classification !== "Unrated") ? <div className="text-danger">
                        <img src="/caution.jpg" alt="caution" width='3%' />
                        NOTICE - This movie is rated {classification} {getMessageFromClassification(classification)} </div> : null
                    }
                    {(classification === "G") ? <div className="text-success">
                        This movie is rated {classification} {getMessageFromClassification(classification)} </div> : null
                    }
                </div>
            </div>
            <div className="col-4 ">
                <div className="flex-row text-primary" >
                    Click on the poster to go to the movie page
                </div>
            </div>
        </div>
    )
}








