const fetchData = () => {
  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${baseUrl}/measurements/latest`;
  return fetch(url)
  .then(response => response.json())
  .then(json => json.measurements);
};

const fetchDetails = nodeId => {
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const url = `${backendUrl}/measurements/${nodeId}/latest`;
  return fetch(url)
    .then(response => response.json())
    .then(json => json.measurements);
};

export {fetchData, fetchDetails}
