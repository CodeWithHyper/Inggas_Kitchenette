document.addEventListener("DOMContentLoaded", function () {
  /* --- 1. Mobile Menu Toggle --- */
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  /* --- 2. Smart Navbar Logic --- */
  const navbar = document.getElementById("navbar");
  let lastScrollTop = 0;

  if (navbar) {
    window.addEventListener("scroll", function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      scrollTop = Math.max(scrollTop, 0);

      if (scrollTop > lastScrollTop) {
        // Scrolling DOWN - Hide Navbar
        navbar.style.top = "-90px";
      } else {
        // Scrolling UP - Show Navbar
        navbar.style.top = "0";
      }
      lastScrollTop = scrollTop;
    });
  }

  /* --- 3. Active Link Logic for Navbar --- */
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
    // 1. Smooth scroll to form
    const formSection = document.getElementById("contact-form");
    formSection.scrollIntoView({ behavior: "smooth" });

    // 2. Select the option in dropdown
    const serviceSelect = document.getElementById("service");
    serviceSelect.value = serviceValue;

    // 3. Optional: Trigger a visual "flash" to show it's selected
    serviceSelect.style.borderColor = "#d51500";
    setTimeout(() => {
      serviceSelect.style.borderColor = "#ccc"; // Reset after 1s
    }, 1000);
  };
});

// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.querySelector(".feedback-section form");
//   const name = document.getElementById("userName");
//   const email = document.getElementById("userEmail");
//   const phoneNum = document.getElementById("userNum");
//   const starRate = document.getElementsByName("rate");
//   const feedback = document.getElementById("feedbackText");

//   if (!form) {
//     console.error("The form was not found!");
//     return;
//   }

//   if (form) {
//     form.addEventListener("submit", function (e) {
//       e.preventDefault();

//       let rating = null;
//       for (let star of starRate) {
//         if (star.checked) {
//           rating = star.id.replace("rate-", "");
//           break;
//         }
//       }
//       console.log("Name: ", name.value);
//       console.log("Email :", email.value);
//       console.log("Phone Number: ", phoneNum.value);
//       console.log("Rating: ", rating + "/5");
//       console.log("Feedback: ", feedback.value);

//       alert("Thank you for your feedback, we appreciate it!");

//       form.reset();
//     });
//   }
// });
