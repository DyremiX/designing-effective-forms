let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');        
        
        const countryList = document.getElementById('countryList');
        countryList.innerHTML = countries.map(country => `<option value="${country}"></option>`).join('');
   
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            countryInput.value = country;
            getCountryCode();
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode() {
    const countryName = countryInput.value;
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")
            document.getElementById('countryCode').value = countryCode
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

(async () => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);
    getCountryByIP();
    document.getElementById('country').addEventListener('change', function () {
        getCountryCode();
    });

    document.getElementById('countrySearch').addEventListener('change', function() {
        const selectedCountry = this.value;
        document.getElementById('country').value = selectedCountry;
        getCountryCode();
    });
    fetchAndFillCountries();
})()
