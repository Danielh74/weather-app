import { useState } from "react";
import { api } from "./services/apiService";

export function MainPage() {
    const [city, setCity] = useState("");
    const [currentTemp, setCurrentTemp] = useState("");
    const [minTemp, setMinTemp] = useState("");
    const [maxTemp, setMaxTemp] = useState("");
    const [feelsLike, setFeelsLike] = useState("");
    const [desc, setDesc] = useState("");
    const [location, setLocation] = useState({ country: "", city: "" });
    const [hasInfo, setHasInfo] = useState(false);
    const [icon, setIcon] = useState("");

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
                setDesc(response.data.current.condition.text);
                setLocation({ country: response.data.location.country, city: response.data.location.name });
                setIcon(response.data.current.condition.icon);
            })
            .catch((error) => {
                console.error(error);
                setHasInfo(false);
            })
    }

    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            {hasInfo ? <div>
                <h4><i className="bi bi-geo-alt-fill"></i>{location.city}, {location.country}</h4>
                <h1>{currentTemp}°</h1>
                {desc} <img src={icon} alt={desc} /><br />
                {maxTemp}° / {minTemp}° feels like: {feelsLike}°
                <br />
            </div> :
                <></>}
        </div>
    )
}