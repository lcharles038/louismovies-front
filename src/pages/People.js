import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import peopleService from "../services/peopleService";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';


function getName(name) {
    return (name.replace(/ /g, "_"));
}


function getDataForGradeGraph(props) {
    let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    props.gradesArray.forEach((value) => {
        const range = Math.floor(value);
        data[range] = data[range] + 1;
    });

    return data;
}



// function getDataForYearGraph(props) {
//     const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//     props.yearsArray.forEach((value) => {
//         const range = value - 1990;
//         data[range] = data[range] + 1;
//     })

//     return data;

// }


function BarGraphGrades(gradesArray) {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: false,
                text: 'Grades',
            },
        },
    };
    const labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'];
    const data = {
        labels,
        datasets: [
            {
                label: 'Grades',
                data: getDataForGradeGraph(gradesArray),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    return <Bar options={options} data={data} />;
}



export default function People() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const idPeople = searchParams.get("id");
    const peopleInfo = peopleService.usePeople(idPeople);
    const columns = [
        { headerName: "Role", field: "category" },
        { headerName: "Movie", field: "movieName" },
        { headerName: "Characters", field: "characters" },
        { headerName: "Rating", field: "imdbRating" }];

    if (peopleInfo) {
        if (peopleInfo.name) {
            const name = peopleInfo.name;
            const wikiLink = `https://en.wikipedia.org/wiki/${getName(name)}`
            return (
                <div className="container" style={{ padding: "3em" }}>
                    <div className="row py-3">
                        <div className="col-12">
                            <h1>{peopleInfo.name}</h1>
                            <h4>{peopleInfo.birthYear} - {peopleInfo.deathYear}</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-sm-12">
                            <div
                                className="ag-theme-balham"
                                style={{ height: "280px", width: "100%" }}
                            >
                                <AgGridReact
                                    columnDefs={columns}
                                    rowData={peopleInfo.roles}
                                    pagination={false}
                                    onGridReady={(params) => {
                                        params.api.sizeColumnsToFit();
                                        window.addEventListener('resize', function () {
                                            setTimeout(function () {
                                                params.api.sizeColumnsToFit();
                                            });
                                        });
                                    }
                                    }
                                    getRowClass={params => {
                                        if (params.node.rowIndex % 2 === 0) {
                                            return 'blue-effect';
                                        }
                                    }}
                                    onRowClicked={(row) => navigate(`/movie?id=${row.data.movieId}`)} />
                            </div>
                        </div>
                        {peopleInfo.roles &&
                            <div className="col-lg-6 col-sm-12">
                                <BarGraphGrades gradesArray={peopleInfo.roles.map((role) => role.imdbRating)} />
                            </div>
                        }
                    </div>



                    <a href={wikiLink}> More information about {peopleInfo.name} </a>

                </div >


            )
        }
    }

    else {
        return (
            <h2>Loading...</h2>
        )
    }
}