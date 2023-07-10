import { useState, useEffect } from "react";

function getPersonDetails(id) {
    const url = `http://sefdb02.qut.edu.au:3000/people/${id}`;

    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
}


const usePeople = (id) => {
    const [peopleInfo, setPeopleInfo] = useState({});

    useEffect(
        () => {
            getPersonDetails(id)
                .then(data => setPeopleInfo(data))
        }, [id]
    )

    return peopleInfo;
}

const peopleService = { usePeople };

export default peopleService;


