import { useState, useEffect } from "react"

export default function SearchBar(props) {
    const [innerSearchName, setInnerSearchName] = useState("");
    const [innerSearchYear, setInnerSearchYear] = useState("");
    useEffect(() => {
        setInnerSearchName(props.searchName);
    }, [props.searchName]);

    return (
        <div>
            {props.error && props.error.message}
            <form className="w-100 me-3" role="search">
                <div className="row py-3">
                    <div className="col-6">
                        <input type="search" aria-labelledby="search-button" name="searchName" id="searchName" value={innerSearchName} placeholder="Title..." className="form-control me-2"
                            onChange={(event) => { setInnerSearchName(event.target.value) }
                            } />
                    </div>
                    <div className="col-4">
                        <input type="search" aria-labelledby="search-button" name="searchYear" id="searchYear" value={innerSearchYear} placeholder="Year..." className="form-control me-2"
                            onChange={(event) => { setInnerSearchYear(event.target.value) }
                            } />
                    </div>
                    <div className="col-2">
                        <button className="btn btn-primary" type="button" id="search-button" onClick={() => { props.onHandleSubmit({ innerSearchName, innerSearchYear }) }}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

