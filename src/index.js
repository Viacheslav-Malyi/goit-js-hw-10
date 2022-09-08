import './css/styles.css';
import fetchCountry from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
//import countryList from './country.hbs';
const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(countrySearh, DEBOUNCE_DELAY));

function countrySearh(event) {
  console.log(refs.input.value);

  if (event.target.value.trim() === '') {
    reset();
    return;
  }

  let searh = refs.input.value.trim();
  fetchCountry(searh).then(murkupRender);
}

function murkupRender(data) {
  let listOfCountry = data.length;
  if (listOfCountry > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (data.status === 404) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    return;
  }
  if (listOfCountry >= 2 && listOfCountry < 10) {
    createListOfCountries(data);
  }
  if (listOfCountry === 1) {
    console.log(data);
    renderCountryCard(data);
  }
}
function createListOfCountries(data) {
  const countryList = data
    .map(({ name, flags }) => {
      return `
      <li class='item-list'>
  <img src='${flags.svg}' alt='${name.common}' width='40px' height='30px' />
  <p class='text countries-name'>${name.common}</p>
</li>`;
    })
    .join();
  refs.countryInfo.innerHTML = countryList;
}

function renderCountryCard(data) {
  const countryCard = data.map(
    ({ flags, name, capital, languages, population }) => {
      const language = Object.values(languages).join(',');
      return `
<div>
  <ul>
    <li class='country_item'>
      <img src='${flags.svg}' alt='${name}' width='50px' height='30px' />
      <h1>${name.common}</h1>
    </li>
    <li>
      <p class='country__text'>Capital:<span class='text'>${capital}</span></p>
    </li>
    <li>
      <p class='country__text'>Population:<span
          class='text'
        >${population}</span></p>
    </li>
    <li>
      <p class='country__text'>Languages:<span class='text'>${language}</span>
      </p>
    </li>
  </ul>
</div>`;
    }
  );
  refs.countryInfo.innerHTML = countryCard;
}
function reset() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
