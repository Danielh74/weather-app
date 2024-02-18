import { useState } from "react";
import { api } from "./services/apiService";
import "./MainPage.css"

export function MainPage() {
    const [city, setCity] = useState("");
    const [currentTemp, setCurrentTemp] = useState("");
    const [minTemp, setMinTemp] = useState("");
    const [maxTemp, setMaxTemp] = useState("");
    const [feelsLike, setFeelsLike] = useState("");
    const [hourTemp, setHourTemp] = useState([]);
    const [dayTemp, setDayTemp] = useState([]);
    const [humid, setHumid] = useState("");
    const [desc, setDesc] = useState("");
    const [UVdesc, setUVDesc] = useState(["Low", "Medium", "High", "Vey high", "Extreme"]);
    const [location, setLocation] = useState({ country: "", city: "" });
    const [hasInfo, setHasInfo] = useState(false);
    const [icon, setIcon] = useState("");
    const [wndSpd, setWndSpd] = useState("");
    const [sun, setSun] = useState({ rise: "", set: "" });
    const [localTime, setLocalTime] = useState("");
    let uvLvl;

    const handleSubmit = (e) => {
        e.preventDefault();
        api.get(city + "&days=7")
            .then((response) => {
                console.log(response);
                setHasInfo(true);
                setCurrentTemp(response.data.current.temp_c);
                setFeelsLike(response.data.current.feelslike_c);
                setMinTemp(response.data.forecast.forecastday[0].day.mintemp_c);
                setMaxTemp(response.data.forecast.forecastday[0].day.maxtemp_c);
                setHourTemp(response.data.forecast.forecastday[0].hour);
                setDayTemp(response.data.forecast.forecastday);
                setHumid(response.data.current.humidity);
                setDesc(response.data.current.condition.text);
                setLocation({ country: response.data.location.country, city: response.data.location.name });
                setIcon(response.data.current.condition.icon);
                setWndSpd(response.data.current.wind_kph);
                setSun({ rise: response.data.forecast.forecastday[0].astro.sunrise, set: response.data.forecast.forecastday[0].astro.sunset })
                uvLvl = response.data.current.uv;
                setLocalTime(parseInt(response.data.location.localtime.slice(-5)));
                console.log(localTime)

            })
            .catch((error) => {
                console.error(error);
                setHasInfo(false);
            })
    }

    return (
        <div className={`container-fluid vh-100 ${localTime > 7 && localTime < 18 ? `day` : `night`}`}>
            <div className="card blur h-75 w-75 offset-1">
                <div className=" card-body">
                    <div className="row mb-3">
                        <form className="col-6 input-group justify-content-center" onSubmit={handleSubmit}>
                            <input
                                className="rounded-start"
                                type="text"
                                placeholder="Enter city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                            <button className="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                        </form>
                    </div>
                    {hasInfo ?
                        <div>
                            <div className="row">
                                <div className="col-6 ">
                                    <h4><i className="bi bi-geo-alt-fill"></i>{location.city}, {location.country}</h4>
                                    <div className="row pb-2">
                                        <div className="col-8">
                                            <h1 >{currentTemp}°</h1>
                                            {maxTemp}° / {minTemp}° feels like: {feelsLike}°
                                        </div>
                                        <div className="col-4 justify-content-center">
                                            {desc}
                                            <img src={icon} alt={desc} height={50} />
                                        </div></div>

                                    <div className="row py-2 border-top border-bottom">
                                        <p className="col align-self-center my-1"><i class="bi bi-moisture text-primary"></i> Humidity: <br /> {humid}%</p>
                                        <p className="col align-self-center my-1"><i class="bi bi-radioactive text-warning"></i> UV Level: <br /> {uvLvl > 11 ? UVdesc[4] : uvLvl >= 8 ? UVdesc[3] : uvLvl >= 6 ? UVdesc[2] : uvLvl >= 3 ? UVdesc[1] : UVdesc[0]}</p>
                                        <p className="col align-self-center my-1"><i class="bi bi-wind"></i> Wind: <br /> {wndSpd}kph</p>
                                    </div>
                                    <div className="row pt-2 align-self-center">
                                        <p className="col align-self-center my-1"><i class="bi bi-sunrise-fill text-warning h2"></i> <br /> {sun.rise}</p>
                                        <p className="col align-self-center my-1"><i class="bi bi-sunset-fill text-danger h2"></i> <br /> {sun.set}</p>
                                    </div>

                                </div>
                                <div className="col-6 border-start">
                                    <div className="row hourly">
                                        {hourTemp.map((item) => (
                                            <div className="col align-self-center">
                                                {item.time.slice(-5)}<br /> <img src={item.condition.icon} alt={item.condition.text} height={20} /> <br />{item.temp_c}°
                                            </div>))}
                                    </div>
                                    <div className="row border-top mt-2 pt-2">
                                        {dayTemp.map((item) => (
                                            <div className="row align-self-center">
                                                <div className="col">{item.date.slice(-5)} </div>
                                                <div className="col">{item.day.maxtemp_c}°</div>
                                                <div className="col"><img height={35} src={item.day.condition.icon} alt={item.day.condition.text} /> </div>
                                                <div className="col"> {item.day.mintemp_c}° / {item.day.maxtemp_c}°</div>

                                            </div>))}
                                    </div>
                                </div>
                            </div>
                        </div> :
                        <></>}
                </div>
            </div>
        </div >
    )
}