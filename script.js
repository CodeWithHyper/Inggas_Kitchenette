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

      // Fix for iOS bounce effect (negative scrolling)
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
      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove("active-link"));
      // Add active class to the clicked one
      this.classList.add("active-link");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".feedback-section form");
  const name = document.getElementById("userName");
  const email = document.getElementById("userEmail");
  const phoneNum = document.getElementById("userNum");
  const starRate = document.getElementsByName("rate");
  const feedback = document.getElementById("feedbackText");

  if (!form) {
    console.error("The form was not found!");
    return;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let rating = null;
      for (let star of starRate) {
        if (star.checked) {
          rating = star.id.replace("rate-", "");
          break;
        }
      }
      console.log("Name: ", name.value);
      console.log("Email :", email.value);
      console.log("Phone Number: ", phoneNum.value);
      console.log("Rating: ", rating + "/5");
      console.log("Feedback: ", feedback.value);

      alert("Thank you for your feedback, we appreciate it!");

      form.reset();
    });
  }
});
