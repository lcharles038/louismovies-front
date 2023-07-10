import { useState } from "react";
import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css"
import SearchBar from "../components/SearchBar";
import movieService from "../services/movieService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const paginationPageSize = 100;


export default function InfiniteSearch() {
    const [gridApi, setGridApi] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const navigate = useNavigate();
    const dataSource = movieService.useCreateDataSourceMovie(searchName, searchYear);
    const [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        setSearchName(searchParams.get("searchName") ? searchParams.get("searchName") : "");
        setSearchYear(searchParams.get("searchYear") ? searchParams.get("searchYear") : "");
    }
        ,
        [searchParams, navigate]
    );


    useEffect(
        () => {
            gridApi && gridApi.setDatasource(dataSource)
        },
        [gridApi, dataSource, navigate]
    )

    const onGridReady = async (params) => {
        setGridApi(params.api);
    }

    const defaultColDef = useMemo(() => {
        return {
            editable: false,
            enableRowGroup: false,
            enablePivot: false,
            enableValue: true,
            sortable: false,
            resizable: true,
            filter: false,
            flex: 1,
            minWidth: 100
        };
    }, []);

    const columnDefs = useMemo(() => {
        return [
            { headerName: "Title", field: "title" },
            { headerName: "Year", field: "year" },
            { headerName: "IMDB rating", field: "imdbRating" },
            { headerName: "Rottentomatoes", field: "rottenTomatoesRating" },
            { headerName: "Metacritic", field: "metacriticRating" },
            { headerName: "Rated", field: "classification" },
            { headerName: "Details", field: "imdbID", cellRenderer: SeeMovieRenderer }
        ];
    }, []);

    const gridOptions = {
        columnDefs: columnDefs,
        defaultColDef: defaultColDef,
        rowModelType: "infinite",
        paginationPageSize: paginationPageSize,
        pagination: true,
        onGridReady: onGridReady,
        cacheBlockSize: paginationPageSize,
        getRowClass: (params) => {
            if (params.node.rowIndex % 2 === 0) {
                return 'blue-effect';
            }
        }
    };



    const modifySearchParams = (params) => {
        setSearchParams({ searchYear: params.innerSearchYear, searchName: params.innerSearchName })
    }

    return (
        <div className="container">
            <div className="row-py3">
                <h1>Search your movie</h1>

                <SearchBar onHandleSubmit={modifySearchParams} searchName={searchName} />
                <div
                    className="ag-theme-balham"
                    style={{
                        height: "70vh",
                        width: "100%"
                    }}
                >
                    <AgGridReact gridOptions={gridOptions}   ></AgGridReact>
                </div>
            </div>
        </div>
    );
}


const SeeMovieRenderer = (params) => {

    const navigate = useNavigate();
    const link = "/movie/?id=" + params.value;

    const buttonClicked = () => {
        navigate(link);
    }


    return (
        <span>
            <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faMagnifyingGlass} onClick={() => {
                buttonClicked()
            }} />
        </span>
    )
}
