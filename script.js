document.addEventListener("DOMContentLoaded", function () {
  /* --- Mobile Menu Toggle --- */
  const hamburger = document.getElementById("hamburger-btn");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active"); 
    });

    const menuLinks = document.querySelectorAll(".right a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active"); 
      });
    });
  }

  /* --- Active Link Scroll Logic --- */
  const navItems = document.querySelectorAll(".right a:not(.nav-order-btn)");
  const sections = document.querySelectorAll("section");

  function activeLinkScrollSpy() {
    let currentSectionId = "";

    // Determine which section is currently in view
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 150) {
        currentSectionId = section.getAttribute("id");

        if (!currentSectionId && section.classList.contains("hero-image")) {
          currentSectionId = "home";
        }
      }
    });

    // Update active link styling
    navItems.forEach((link) => {
      link.classList.remove("active-link");
      const href = link.getAttribute("href");

      if (currentSectionId === "home" && href === "#") {
        link.classList.add("active-link");
      } else if (currentSectionId && href === `#${currentSectionId}`) {
        link.classList.add("active-link");
      }
    });
  }

  window.addEventListener("scroll", activeLinkScrollSpy);
  activeLinkScrollSpy();

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

  /* --- Review Modal Open/Close --- */
  window.openReviewModal = function () {
    document.getElementById("reviewModal").style.display = "block";
  };

  window.closeReviewModal = function () {
    document.getElementById("reviewModal").style.display = "none";
  };

  window.addEventListener("click", function (event) {
    const modal = document.getElementById("reviewModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Function to create reviewCard
  function createReviewCard(name, rating, text, source = "via Website") {
    let stars = "";
    for (let i = 0; i < rating; i++) stars += "★";

    const newCard = document.createElement("div");
    newCard.className = "testimonial-card";
    newCard.innerHTML = `
        <div class="review-header">
            <div class="review-user">
                <div class="user-avatar">${name.charAt(0).toUpperCase()}</div>
                <div class="user-info">
                    <h4>${name}</h4>
                    <span>${source}</span>
                </div>
            </div>
            <div style="color: #ffd700;">${stars}</div>
        </div>
        <div class="review-text-content">
            <p style="color: #444;">"${text}"</p>
        </div>
    `;
    return newCard;
  }

  // Load Reviews from Database on Page Load
  let allReviews = [];
  let showingAll = false;

  // Fuction to load reviews from database
  function loadReviews() {
    fetch("get_reviews.php")
      .then((response) => response.json())
      .then((reviews) => {
        const container = document.getElementById("reviews-container");
        const wrapper = document.getElementById("reviews-wrapper");

        let showingAll = false;
        const showCount = 2; // Shows the first 2 latest reviews.

        function displayReviews(count) {
          // Only clear DB-added reviews, not the hardcoded ones
          const dbCards = container.querySelectorAll(".db-review-card");
          dbCards.forEach((card) => card.remove());

          for (let i = 0; i < count && i < reviews.length; i++) {
            const card = createReviewCard(
              reviews[i].name,
              reviews[i].rating,
              reviews[i].review_text
            );
            card.classList.add("db-review-card"); // Mark these as DB reviews
            container.appendChild(card);
          }
        }

        displayReviews(showCount);

        //Condition wherein if there are more than 2 reviews, a show more button will appear
        if (reviews.length > showCount) {
          let btn = wrapper.querySelector(".show-more-btn");
          if (!btn) {
            btn = document.createElement("button");
            btn.className = "show-more-btn";
            wrapper.appendChild(btn);
          }
          btn.textContent = "Show More";

          btn.onclick = () => {
            if (!showingAll) {
              displayReviews(reviews.length); //Shows all reviews when pressed
              btn.textContent = "Show Less";
              showingAll = true;
            } else {
              displayReviews(showCount); // Returns back to showing 2 reviews only
              btn.textContent = "Show More";
              showingAll = false;
            }
          };
        }
      })
      .catch((error) => console.error("Error loading reviews:", error));
  }
  loadReviews();

  //Submit Review Function with Email Verification
  window.submitReview = function (event) {
    event.preventDefault();

    const name = document.getElementById("reviewName").value;
    const email = document.getElementById("reviewEmail").value;
    const rating = document.getElementById("reviewRating").value;
    const text = document.getElementById("reviewText").value;

    if (!name || !email || !rating || !text) {
      alert("Please fill in all fields");
      return;
    }

    //Checks if email exists in contacts table in the database
    fetch(`verify_contact.php?email=${encodeURIComponent(email)}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.exists) {
          alert(
            "Your email is not registered in our contacts. You cannot post a review."
          );
          return;
        }

        // Add review to screen
        const newCard = createReviewCard(name, rating, text);
        const container = document.getElementById("reviews-container");
        container.prepend(newCard);

        // Saves the review to the database
        const email = document.getElementById("reviewEmail").value;
        fetch("save_review.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(
            email
          )}&rating=${encodeURIComponent(
            rating
          )}&reviewtext=${encodeURIComponent(text)}`,
        })
          .then((response) => response.text())
          .then((data) => console.log("Saved:", data))
          .catch((error) => console.error("Error:", error));

        closeReviewModal();
        document.getElementById("reviewForm").reset();
        alert("Thank you! Your review has been posted.");
      })
      .catch((err) => console.error("Error verifying email:", err));
  };

  /* --- Smart Booking Logic --- */
  window.selectService = function (serviceValue) {
    const formSection = document.getElementById("contact-form");
    formSection.scrollIntoView({ behavior: "smooth" });

    const serviceSelect = document.getElementById("service");
    serviceSelect.value = serviceValue;

    // Highlight selection briefly
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
