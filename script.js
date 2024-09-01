// Your Ticketmaster API key
const apiKey = 'LLx3GHqUvLJOl46ZWAr0MZhEiZQGeCoQ';

// Function to fetch and display events
async function fetchAndDisplayEvents(filters = {}) {
    const { keyword = '', eventType = '', location = '', date = '' } = filters;
    
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    url.searchParams.append('apikey', apiKey);
    if (keyword) url.searchParams.append('keyword', keyword);
    if (eventType) url.searchParams.append('classificationName', eventType);
    if (location) url.searchParams.append('city', location);
    if (date) url.searchParams.append('startDateTime', `${date}T00:00:00Z`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Extract event data
        const events = data._embedded?.events.map(event => ({
            name: event.name,
            date: event.dates.start.localDate,
            type: event.classifications[0]?.segment?.name || 'N/A',
            location: event._embedded.venues[0]?.city?.name || 'Unknown',
            url: event.url, // URL for the booking page
            image: event.images[0]?.url || 'default-image.jpg' // Cover image for the event
        })) || [];

        // Display events on the page
        displayEvents(events);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

// Function to display events
function displayEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = '';

    if (events.length === 0) {
        eventsContainer.innerHTML = '<p>No events found.</p>';
        return;
    }

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event';
        eventCard.innerHTML = `
            <img src="${event.image}" alt="${event.name}" class="event-image">
            <div class="event-content">
                <h2>${event.name}</h2>
                <p>Date: <span class="event-date">${event.date}</span></p>
                <p>Type: ${event.type}</p>
                <p>Location: ${event.location}</p>
                <a href="${event.url}" class="event-link" target="_blank">Book Tickets</a>
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

// Function to handle filter button click
document.getElementById('filter-btn').addEventListener('click', () => {
    const keyword = document.getElementById('search').value;
    const eventType = document.getElementById('event-type').value;
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;

    fetchAndDisplayEvents({ keyword, eventType, location, date });
});

// Fetch and display events when the page loads
fetchAndDisplayEvents();
