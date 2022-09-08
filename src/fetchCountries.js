export default function fetchCountries(countryName) {
  return fetch(
    `https://restcountries.com/v3.1/name/${countryName}?fields=capital,population,languages,name,flags`
  ).then(responce => {
    return responce.json();
  });
}
