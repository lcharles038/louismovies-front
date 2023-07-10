import { useState } from "react";
import { useEffect } from "react";



const getMovieByQuery = (n, y) => {
    const url = `http://sefdb02.qut.edu.au:3000/movies/search?title=${n}&year=${y}`;
    return fetch(url)
        .then(res => res.json())
        .then(json => json.data)
        .then((datas) => datas.map(
            (data) => {
                return { title: data.title, year: data.year, id: data.imdbID, rating: data.imdbRating + "/10", rottentomatoes: data.rottenTomatoesRating + "%", metacritic: data.metacriticRating + "%", rated: data.classification }
            }
        ))
}

const getMovieByPage = (page) => {
    const url = `http://sefdb02.qut.edu.au:3000/movies/search?page=${page}`;
    return fetch(url)
        .then(res => res.json())
        .then(json => json.data)
        .then((datas) => datas.map(
            (data) => {
                return { title: data.title, year: data.year, id: data.imdbID, rating: data.imdbRating + "/10", rottentomatoes: data.rottenTomatoesRating + "%", metacritic: data.metacriticRating + "%", rated: data.classification }
            }
        ))
}


const useRandomMovie = () => {
    const [selectedMovieInfo, setSelectedMovieInfo] = useState(null);
    const [classification, setClassification] = useState(null);
    const [id, setId] = useState(null);
    useEffect(
        // the effect
        () => {
            const page = Math.floor(Math.random() * 123);
            getMovieByPage(page).then(movies => {
                const len = movies.length;
                const selectedRange = Math.floor(Math.random() * len);
                setClassification(movies[selectedRange].rated);
                setId(movies[selectedRange].id)
                return movies[selectedRange]
            })
                .then(movie => {
                    const url = `http://sefdb02.qut.edu.au:3000/movies/data/${movie.id}`
                    return fetch(url)
                })
                .then(res => res.json())
                .then(data => setSelectedMovieInfo(data))
                .catch(e => console.log(e))
        },
        // the dependencies
        [],
    );
    return { selectedMovieInfo, classification, id }
}

const useMovie = (searchName, searchYear) => {
    const [loading, setLoading] = useState(true);
    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(
        // the effect
        () => {
            getMovieByQuery(searchName, searchYear)
                .then(movies => setRowData(movies))
                .catch(e => { setError(e); })
                .finally(() => { setLoading(false); });

        },
        // the dependencies
        [searchName, searchYear],
    );

    return {
        loading,
        rowData,
        error
    }
}

const paginationPageSize = 100;
const useCreateDataSourceMovie = (searchName, searchYear) => {
    const [dataSource, setDataSource] = useState()
    useEffect(() => {
        setDataSource({
            getRows: (params) => {
                let pageNo = params.endRow / paginationPageSize;
                const url = `http://sefdb02.qut.edu.au:3000/movies/search?title=${searchName}&year=${searchYear}&page=${pageNo}`;

                fetch(url)
                    .then((response) => response.json())
                    .then((response) => {
                        const totalResults = response.pagination.total;
                        params.successCallback(response.data, totalResults);
                    });
            }
        });


    }, [searchYear, searchName])

    return dataSource;
};






function getInfoFromMovie(id) {
    const url = `http://sefdb02.qut.edu.au:3000/movies/data/${id}`
    return fetch(url)
        .then(res => res.json())

}



const useIndividualMovieInfo = (id) => {
    const [info, setInfo] = useState({});

    useEffect(
        () => {
            getInfoFromMovie(id)
                .then(data => setInfo(data))
        }, [id]
    )

    return info;
}

const movieService = { useIndividualMovieInfo, useCreateDataSourceMovie, useRandomMovie, useMovie }

export default movieService;