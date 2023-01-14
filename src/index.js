import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetch-countries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('input#search-box'),
  countryList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};
const { countryInfo, countryList, searchBox } = refs;

const clearContainers = () => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};

const createMarkup = data =>
  data
    .map(
      ({ name, flags }) =>
        `<li class="country-list__item">
          <img class="country-list__image" src="${flags.svg}" alt="${name.official}" width="32">
          <span class="country-list__name" >${name.official}</span>
        </li>`
    )
    .join('');

const createOneCountryMarkup = ([country]) => {
  const { name, flags, capital, population, languages } = country;

  return `<div class="country-info__head">
            <img class="country-info__image" src="${flags.svg}" alt="${
    name.official
  }" width="80">
            <span class="country-info__name">${name.official}</span>
          </div>
          <ul class="list">
            <li class="country-info__feature">
              <span class="country-info__feature-caption">Capital: </span>${capital}
            </li>
            <li class="country-info__feature">
              <span class="country-info__feature-caption">Population: </span>${population}
            </li>
            <li class="country-info__feature">
              <span class="country-info__feature-caption">Languages: </span>${Object.values(
                languages
              ).join(', ')}
            </li>
          </ul>`;
};

const checkData = data => {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (data.length > 1) {
    countryList.innerHTML = createMarkup(data);
    return;
  }

  countryInfo.innerHTML = createOneCountryMarkup(data);
};

const showError = error =>
  Notify.failure(
    error.message === '404'
      ? 'Oops, there is no country with that name'
      : 'Oops, something went wrong'
  );

const findCountries = async name => {
  try {
    checkData(await fetchCountries(name));
  } catch (error) {
    showError(error);
  }
};

const onInput = ({ target }) => {
  const countryName = target.value.trim();

  clearContainers();

  if (!countryName) return;

  findCountries(countryName);
};

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));