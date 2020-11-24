import React, {useState,useEffect} from "react";
import './App.css';
import { MenuItem, FormControl, Select, Card,CardContent } from "@material-ui/core";
import InfoBox from './InfoBox.js';
import Map from './Map.js'
import Table from './Table.js';
import { sortData } from "./util";
import LineGraph from './LineGraph.js'

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] =useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data);
    });
  },[]);
   
  useEffect(() => {
     const getCountriesData = async () => {
       await fetch("https://disease.sh/v3/covid-19/countries")
       .then((response) => response.json())
       .then((data) => {
         const countries = data.map((country) => (
           {
             name:country.country,
             value:country.countryInfo.iso2
           }));
           const sortedData = sortData(data);
           setTableData(sortedData);
           setCountries(countries);
       });
     };
     getCountriesData();
  },[]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
    })
  };
  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select
          variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
            {/*<MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Worldwide</MenuItem>*/}

          </Select>
        </FormControl>
      </div>
      <div className="app__stats">
      <InfoBox title="coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
      <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
      <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
      </div>
      <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          {/*Table*/}
          <Table countries={tableData}/>
          <h3>Worldwide new cases</h3>
         {/*Graph*/}
         <LineGraph />
         </CardContent>
        
      </Card>
      
    </div>
  );
}

export default App;
