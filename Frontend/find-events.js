document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('searchCity');
    const eventsContainer = document.getElementById('eventsContainer');

    const fetchEvents = async (city = "") => {
        try {
            const url = 'http://localhost:8080/api/v1/events';
            const response = await fetch(url);
            const result = await response.json();
            if (response.ok && result.success) {
                let events = result.data;
            
                if (city.trim() !== "") {
                    events = events.filter(event =>
                        event.city.toLowerCase().includes(city.toLowerCase())
                    );
                }
            
                // Sort events by date in descending order (latest first)
                events.sort((a, b) => new Date(b.event_date_time) - new Date(a.event_date_time));
            
                renderEvents(events);
            }
            
            else {
                eventsContainer.innerHTML = "<p>No events found.</p>";
            }
        } catch (error) {
            console.error("Error fetching events", error);
            eventsContainer.innerHTML = "<p>Error loading events.</p>";
        }
    };

    const renderEvents = (events) => {
        eventsContainer.innerHTML = "";

        if (events.length === 0) {
            eventsContainer.innerHTML = "<p>No events match your search.</p>";
            return;
        }

        events.forEach(event => {
            const eventDate = new Date(event.event_date_time);
            const isPast = eventDate < new Date();

            const card = document.createElement('div');
            card.className = `event-card ${isPast ? 'past' : ''}`;

            // Generate a fallback image or use the one from the event
            const imageUrl = `https://picsum.photos/seed/${event.id}/600/400`;

            // card.innerHTML = `
            //     <img src="${imageUrl}" alt="${event.title}" />
            //     <div class="details">
            //         <h3>${event.title}</h3>
            //         <p><strong>Type:</strong> ${event.event_type}</p>
            //         <p><strong>City:</strong> ${event.city}</p>
            //         <p><strong>Venue:</strong> ${event.venue}</p>
            //         <p><strong>Date:</strong> ${eventDate.toLocaleString()}</p>
            //         <p><strong>Food:</strong> ${event.food_available === 'yes' ? 'Yes' : 'No'}</p>
            //         <p><strong>Cost:</strong> ${event.participation_cost > 0 ? `₹${event.participation_cost}` : "Free"}</p>
            //         <p><strong>Contact:</strong> ${event.contact}</p>
            //         <p>${event.description}</p>
            //     </div>
            // `;

            card.innerHTML = `
                <a  href = "./EventDetails.html">
                 <img src="${imageUrl}" alt="${event.title}" />
                   <div class="details">
                    <h3>${event.title}</h3>
                   <p><strong>Type:</strong> ${event.event_type}</p>
                    <p><strong>Date:</strong> ${eventDate.toLocaleString()}</p>
                   </div>
            
                </a>`;

            eventsContainer.appendChild(card);
        });
    };

    // On Search
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value;
        fetchEvents(city);
    });

    // Load all events on page load
    fetchEvents();
});
