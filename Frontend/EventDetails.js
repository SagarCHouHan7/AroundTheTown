// Extract event ID from URL
const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
console.log("Event ID from URL:", eventId);

// Fetch event details from backend
async function getEventDetails() {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/events/${eventId}`);
    const data = await response.json();

    console.log("API Response:", data);

    // If API indicates failure
    if (!data.success || !data.data) {
      throw new Error(data.message || "Event not found.");
    }

    // Display the event on page
    displayEventDetails(data.data);
  } catch (error) {
    console.error("Error fetching event:", error);
    document.getElementById("event-container").innerHTML = "<p>Failed to load event.</p>";
  }
}

// Render event details on the page
function displayEventDetails(event) {
  const container = document.getElementById("event-container");
  const eventDate = new Date(event.event_date_time);

  container.innerHTML = `
    <div class="event-card">
      <div class="detail-img">
      
        <img src="${event.image_url || `https://picsum.photos/seed/${Math.floor(Math.random()*200+2)}/600/400`}" alt="${event.title}" style="max-width:350px; border-radius:8px;" />
        <img src="${event.image_url || `https://picsum.photos/seed/${Math.floor(Math.random()*200+2)}/600/400`}" alt="${event.title}" style="max-width:350px; border-radius:8px;" />
      </div>
      <div class="details">
        <h2>${event.title}</h2>
        <p><strong>Type:</strong> ${event.event_type}</p>
        <p><strong>City:</strong> ${event.city}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>Date:</strong> ${eventDate.toLocaleString()}</p>
        <p><strong>Food:</strong> ${event.food_available === 'yes' ? 'Yes' : 'No'}</p>
        <p><strong>Cost:</strong> ${event.participation_cost > 0 ? `₹${event.participation_cost}` : "Free"}</p>
        <p><strong>Contact:</strong> ${event.contact}</p>
        <p><strong>Description:</strong> ${event.description}</p>
      </div>
    </div>
  `;
}

// Call the function on page load
getEventDetails();
