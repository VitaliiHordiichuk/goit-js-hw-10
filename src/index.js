import './css/styles.css';

import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener(
  'input',
  debounce(e => {
    const inputValue = input.value.trim();

    if (inputValue === '') {
      cleanHtml();
    } else {
      if (inputValue !== '') {
        fetchCountries(inputValue).then(foundCountry => {
          if (foundCountry.length > 10) {
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
          } else if (foundCountry.length === 0) {
            Notiflix.Notify.failure('Oops, there is no country with that name');
          } else if (foundCountry.length >= 2 && foundCountry.length <= 10) {
            renderCountryList(foundCountry);
          } else if (foundCountry) {
            renderOneCountry(foundCountry);
          }
        });
      }
    }
  }, DEBOUNCE_DELAY)
);

function renderCountryList(countries) {
  const infoCountry = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
         <b>${country.name.official}</b></p>
                </li>`;
    })
    .join('');
  countryList.innerHTML = infoCountry;
  countryInfo.innerHTML = '';
}

function renderOneCountry(countries) {
  const infoCountry = countries
    .map(country => {
      return `
      <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
         <b>${country.name.official}</b></p>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)} </p>`;
    })
    .join('');
  countryList.innerHTML = '';
  countryInfo.innerHTML = infoCountry;
}

function cleanHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
