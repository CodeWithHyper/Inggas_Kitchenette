document.addEventListener("DOMContentLoaded", function () {
  /* --- 1. Mobile Menu Toggle --- */
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  /* --- 2. Active Link Logic for Navbar --- */
  const navItems = document.querySelectorAll(".right a:not(.nav-order-btn)");

  navItems.forEach((link) => {
    link.addEventListener("click", function () {
      navItems.forEach((nav) => nav.classList.remove("active-link"));
      this.classList.add("active-link");
    });
  });

  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  if (slides.length > 0) {
    function nextSlide() {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }
    setInterval(nextSlide, 3000);
  }

  window.openReviewModal = function () {
    document.getElementById("reviewModal").style.display = "block";
  };

  window.closeReviewModal = function () {
    document.getElementById("reviewModal").style.display = "none";
  };

  // Close modal if clicked outside (Using event listener instead of assignment)
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("reviewModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  window.submitReview = function (event) {
    event.preventDefault(); // Prevent actual form submission

    const name = document.getElementById("reviewName").value;
    const rating = document.getElementById("reviewRating").value;
    const text = document.getElementById("reviewText").value;

    // Create stars string
    let stars = "";
    for (let i = 0; i < rating; i++) stars += "★";

    // Create new review card HTML (Text version for user submissions)
    const newCard = document.createElement("div");
    newCard.className = "testimonial-card";
    newCard.innerHTML = `
                <div class="review-header">
                    <div class="review-user">
                        <div class="user-avatar">${name
                          .charAt(0)
                          .toUpperCase()}</div>
                        <div class="user-info">
                            <h4>${name}</h4>
                            <span>via Website</span>
                        </div>
                    </div>
                    <div style="color: #ffd700;">${stars}</div>
                </div>
                <div class="review-text-content">
                    <p>"${text}"</p>
                </div>
            `;

    // Add to container
    const container = document.getElementById("reviews-container");
    container.prepend(newCard); // Add to beginning

    // Close and reset
    closeReviewModal();
    document.getElementById("reviewForm").reset();
    alert("Thank you! Your review has been posted.");
  };

  /* --- SMART BOOKING LOGIC --- */
  window.selectService = function (serviceValue) {
    const formSection = document.getElementById("contact-form");
    formSection.scrollIntoView({ behavior: "smooth" });

    const serviceSelect = document.getElementById("service");
    serviceSelect.value = serviceValue;

    serviceSelect.style.borderColor = "#d51500";
    setTimeout(() => {
      serviceSelect.style.borderColor = "#ccc"; 
    }, 1000);
  };

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const captionText = document.getElementById("caption");
  const galleryImages = document.querySelectorAll(".gallery-item img");

  galleryImages.forEach((img) => {
    img.addEventListener("click", function () {
      lightbox.style.display = "block";
      lightboxImg.src = this.src;
      captionText.innerHTML = this.alt;
    });
  });

  document.querySelector(".close-lightbox").addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.style.display = "none";
  });
});
