// GSAP animation for the hero section
gsap.from(".hero-text h1", { opacity: 0, y: -50, duration: 1 });
gsap.from(".cta-btn", { opacity: 0, y: 50, duration: 1, delay: 0.5 });

// Scroll-triggered animations for other sections
gsap.from(".booking", {
    scrollTrigger: ".booking",
    opacity: 0,
    y: 100,
    duration: 1.5,
});


function initMap() {
    var options = {
        zoom: 8,
        center: { lat: 33.6844, lng: 73.0479 }, // Coordinates for Azad Kashmir
    };
    var map = new google.maps.Map(document.getElementById('map-container'), options);
}

window.onload = initMap;

// JavaScript typing effect function
window.onload = function() {
    const text = "Book your ride in the beautiful Kashmir region today!";
    let i = 0;
    const speed = 100; // Speed of typing (in milliseconds)
    const typingTextElement = document.getElementById("typing-text");

    function typeWriter() {
        if (i < text.length) {
            typingTextElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }

    typeWriter(); // Call the function to start typing on load
};


// book section  

// Fare rates per km for different vehicles
const fareRates = {
    bike: 5,  // ₹5 per km
    car: 10,  // ₹10 per km
    bus: 3    // ₹3 per km
};

// Function to update fare dynamically based on vehicle and distance
function updateFare() {
    let vehicle = document.getElementById("vehicle").value;
    let distance = document.getElementById("distance").value;
    
    if (distance > 0) {
        let totalFare = fareRates[vehicle] * distance;
        document.getElementById("fare-display").innerText = `Estimated Fare: ₹${totalFare}`;
    } else {
        document.getElementById("fare-display").innerText = "Estimated Fare: ₹0";
    }
}

// Function to book the ride
function bookRide() {
    let name = document.getElementById("name").value.trim();
    let section = document.getElementById("section").value;
    let vehicle = document.getElementById("vehicle").value;
    let distance = document.getElementById("distance").value;
    let confirmationMsg = document.getElementById("confirmation");

    if (name === "" || distance <= 0) {
        confirmationMsg.style.color = "red";
        confirmationMsg.innerText = "Please enter a valid name and distance!";
        return;
    }

    let totalFare = fareRates[vehicle] * distance;

    confirmationMsg.style.color = "#0066cc";
    confirmationMsg.innerText = `✅ Thank you, ${name}! You have booked a ${section} section with a ${vehicle.toUpperCase()} for ${distance} km. Total Fare: ₹${totalFare}`;
}


// slide show

let currentIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
    slides.forEach((slide, index) => {
        slide.style.opacity = index === currentIndex ? "1" : "0";
    });
    currentIndex = (currentIndex + 1) % slides.length;
}

setInterval(showSlides, 3000); // Change image every 3 seconds

// login page 

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Fake users (Replace with database check)
    let users = [
        { email: "test@chinarxpress.com", password: "123456" },
        { email: "provider@chinarxpress.com", password: "pass123" }
    ];

    let validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        alert("✅ Login Successful! Redirecting...");
        window.location.href = "dashboard.html"; // Redirect to Dashboard
    } else {
        alert("❌ Invalid Email or Password!");
    }
});
