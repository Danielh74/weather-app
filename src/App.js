import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import { api } from './services/apiService';

function App() {
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState({ country: "", city: "" });
  const [hasInfo, setHasInfo] = useState(false);
  const [icon, setIcon] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    api.get(city)
      .then((response) => {
        console.log(response);
        setHasInfo(true);
        setTemp(response.data.current.feelslike_c);
        setDesc(response.data.current.condition.text)
        setLocation({ country: response.data.location.country, city: response.data.location.name })
        setIcon(response.data.current.condition.icon)
      })
      .catch((error) => {
        console.error(error);
        setHasInfo(false);
      })

  }

  return (
    <div className="App">
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
        Location: {location.country}, {location.city} <br />
        temperture: {temp} &#8451; <br />
        <img src={icon} alt={desc} /> <br />
        {desc}
      </div> :
        <></>}

    </div>
  );
}

export default App;
