document.addEventListener('DOMContentLoaded', () => {
    let allCountries = [];
    let currentPage = 1;
    const rowsPerPage = 25;

    const loadCountryAPI = () => {
        fetch('https://restcountries.com/v3.1/all')
            .then(res => res.json())
            .then(data => {
                allCountries = data;
                displayCountry();
                setupPagination();
            });
    }

    const displayCountry = () => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedCountries = allCountries.slice(start, end);

        const countriesHTML = paginatedCountries.map(country => getCountry(country)).join('');
        document.getElementById('countries').innerHTML = countriesHTML;

        document.querySelectorAll('.country-name').forEach(item => {
            item.addEventListener('click', event => {
                const countryName = event.target.getAttribute('data-name');
                const country = allCountries.find(c => c.name.common === countryName);
                show_modal(country);
            });
        });
    }

    const getCountry = country => {
        const nativeNames = Object.values(country.name.nativeName || {}).map(n => n.common).join(', ');
        const altSpellings = country.altSpellings ? country.altSpellings.join(', ') : 'N/A';
        const iddRoot = country.idd.root ? country.idd.root : 'N/A';
        const iddSuffixes = country.idd.suffixes ? country.idd.suffixes.join(', ') : 'N/A';

        return `
            <div class="country-div">
                <img src="${country.flags.png}" alt="${country.name.common} flag">
                <h4 class="country-name pt-2" data-name="${country.name.common}">${country.name.common}</h4>
                <h6>Alpha-2 Code: ${country.cca2}</h6>
                <h6>Alpha-3 Code: ${country.cca3}</h6>
                <h6>Native Name: ${nativeNames}</h6>
                <h6>Alternative Spellings: ${altSpellings}</h6>
                <h6>International Direct Dialing: ${iddRoot} ${iddSuffixes}</h6>
            </div>
        `;
    }

    const show_modal = country => {
        document.getElementById('modalCountryName').innerText = country.name.common;
        document.getElementById('modalCountryFlag').src = country.flags.png;
        document.getElementById('modalCountryInfo').innerHTML = `
            <strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}<br>
            <strong>Population:</strong> ${country.population}<br>
            <strong>Region:</strong> ${country.region}<br>
            <strong>Subregion:</strong> ${country.subregion}<br>
            <strong>Area:</strong> ${country.area} km²<br>
            <strong>Timezones:</strong> ${country.timezones.join(', ')}<br>
            <strong>Languages:</strong> ${Object.values(country.languages).join(', ')}<br>
        `;

        $('#countryModal').modal('show');
    }

    

    const updatePaginationButtons = () => {
        document.getElementById('prev-page').classList.toggle('disabled',currentPage === 1 );
        document.getElementById('next-page').classList.toggle('disabled',currentPage === Math.ceil(allCountries.length / rowsPerPage));
    } 
    document.getElementById('prev-page').addEventListener('click',(event)=>{
        event.preventDefault();
        if(currentPage > 1){
            currentPage -- ; 
            displayCountry();
            updatePaginationButtons();
        }

    });
    document.getElementById('next-page').addEventListener('click',(event)=>{
        event.preventDefault();
        if(currentPage <Math.ceil(allCountries.length / rowsPerPage)){
            currentPage ++ ; 
            displayCountry();
            updatePaginationButtons();
        }

    });

    loadCountryAPI();
});
