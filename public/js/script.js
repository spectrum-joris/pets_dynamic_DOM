// Ophalen van dieren data
const fetchPets = async (sortBy = 'name') => {
    const response = await fetch(`/api/pets?sort=${sortBy}`); // Haal dieren op, gesorteerd volgens de opgegeven parameter
    const pets = await response.json(); // Zet de JSON response om in een JavaScript-object
    console.log(pets); // Controleer of de data correct binnenkomt
    displayPets(pets); // Geef de dieren array door aan displayPets in plaats van een string
};

// Weergeven van dieren in de DOM
const displayPets = (pets) => {
    const petsList = document.querySelector('.pets-list'); // Zoek het DOM-element waar de dierenlijst komt
    petsList.innerHTML = ''; // Maak het element leeg voor nieuwe data

    pets.forEach(pet => { // Loop door elk dier dat is opgehaald
        const petItem = document.createElement('div'); // Maak een nieuw div-element aan voor elk dier
        petItem.classList.add('pets-list__item'); // Voeg de BEM-klasse toe

        const age = pet.death ? calculateAge(pet.birth, pet.death) : calculateAge(pet.birth); // Bereken de leeftijd
        petItem.innerHTML = `
            <h2>${pet.name}</h2>
            <p>Eigenaar: ${pet.owner}</p>
            <p>Leeftijd: ${age} jaar</p>
            <p>Soort: ${pet.species}</p>
        `;
        petsList.appendChild(petItem); // Voeg elk dier toe aan de DOM
    });
};

// Leeftijd berekenen
const calculateAge = (birth, death = new Date()) => {
    const birthDate = new Date(birth); // Maak een datumobject van de geboortedatum
    const endDate = new Date(death); // Gebruik de overlijdensdatum, of huidige datum als het dier nog leeft
    return endDate.getFullYear() - birthDate.getFullYear(); // Bereken het verschil in jaren
};

// Voeg event listeners toe aan de sorteerknoppen
document.querySelectorAll('.sort-buttons__button').forEach(button => {
    button.addEventListener('click', () => {
        const sortBy = button.dataset.sort; // Haal het sorteercriterium uit de dataset van de knop
        fetchPets(sortBy); // Haal de dieren op, gesorteerd volgens de geselecteerde optie
    });
});

// Laad standaard de lijst gesorteerd op naam
fetchPets();


/*
fetchPets: Dit is een async functie die de dieren ophaalt via de API, gesorteerd op basis van het argument sortBy.
fetch(/api/pets?sort=${sortBy}): Hier wordt een GET-verzoek gestuurd naar de server, waarbij de sort queryparameter wordt meegegeven om te bepalen hoe de dieren gesorteerd moeten worden.
displayPets: Deze functie update de DOM door de opgehaalde dieren weer te geven. Elke dier heeft een eigen div-element.
calculateAge: Deze functie berekent de leeftijd van een dier, afhankelijk van of het nog leeft (gebruik de huidige datum) of is overleden (gebruik de overlijdensdatum).
Event Listeners: We gebruiken de data-sort van elke knop om te bepalen hoe de lijst moet worden gesorteerd. Zodra een knop wordt ingedrukt, wordt de lijst opnieuw opgehaald en weergegeven volgens het geselecteerde criterium.
*/