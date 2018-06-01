import {parseData} from "./parser";

const fetchData = () => {
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${baseUrl}/measurements/latest`;
  return fetch(url)
  .then(response => response.json())
  .then(json => json.measurements);
};

const fakefetchData = () => {
  const fakeData =
  "Elektra-Solar1;1;1522935107;5;480;0;22.0;18.0;13.9;95;100;23;11.7;14.1;17;50;52.507454;13.458673\n";
  return Promise.resolve(parseData(fakeData));
};


export {fetchData, fakefetchData}
