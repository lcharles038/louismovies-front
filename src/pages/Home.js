import RandomMovie from "../components/RandomMovie";


export default function Home() {
    return (
        <div className="container" style={{ padding: "3em" }}>
            <div className="row py-2">
                <div className="col-12">
                    <h1> Welcome to Louis' movies website  <img src={"/clap.webp"} alt="clap" width='5%' align='left' /> <img src={"/clap.webp"} alt="clap" width='5%' align='right' /> </h1>
                </div>
            </div>
            <h3>What about watching this movie today?</h3>
            <RandomMovie />

        </div>
    )
}