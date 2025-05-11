document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('eventForm');
    const confirmation = document.getElementById('confirmation');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const formData = new FormData(form);
        const event = {
            title: formData.get('title'),
            type: formData.get('type'),
            city: formData.get('city'),
            venue: formData.get('venue'),
            dateTime: formData.get('dateTime'),
            foodAvailable: formData.get('foodAvailable'),
            cost: parseFloat(formData.get('cost')) || 0,
            description: formData.get('description'),
            contact: formData.get('contact'),
            image: `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/600/400` // Random image
        };

        try {
            const response = await fetch('http://localhost:8080/api/v1/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                confirmation.classList.remove('hidden');
                confirmation.textContent = "🎉 Your event has been submitted!";
                form.reset();
            } else {
                confirmation.classList.remove('hidden');
                confirmation.textContent = `❌ Error: ${result.message || 'Submission failed'}`;
            }

        } catch (error) {
            console.error("Error submitting event:", error);
            confirmation.classList.remove('hidden');
            confirmation.textContent = "❌ Something went wrong!";
        }
    });
});
