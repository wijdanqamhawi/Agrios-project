/* ==========================================================================
   Agrios - main.js
   Simple vanilla JavaScript for the Agrios static website.
   No libraries, no frameworks. All code runs after the DOM is ready.
   Every block checks that its elements exist first, so pages that do not
   have a certain section will simply skip that feature (no console errors).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  mobileMenuToggle();
  backToTopButton();
  formValidation();
  shopSearchFilter();
});

/* --------------------------------------------------------------------------
   1) Mobile navigation menu toggle  ->  click event
   The small ".menue" icon in the header opens / closes the main navigation
   on small screens by toggling Tailwind's "hidden" class.
   -------------------------------------------------------------------------- */
function mobileMenuToggle() {
  var menuButton = document.querySelector(".menue");
  var nav = document.querySelector("nav");
  if (!menuButton || !nav) return;

  var list = nav.querySelector("ul");
  var section = nav.closest("section");

  menuButton.style.cursor = "pointer";

  menuButton.addEventListener("click", function () {
    // If the whole nav bar is hidden on mobile, show/hide that section.
    if (section && section.classList.contains("hidden")) {
      section.classList.toggle("hidden");
    } else if (list) {
      // Otherwise just show/hide the list of links.
      list.classList.toggle("hidden");
    }
  });

  // Close the menu again after a link is tapped (nicer on mobile).
  if (list) {
    list.addEventListener("click", function (event) {
      if (event.target.tagName === "A" && window.innerWidth < 1024) {
        if (section && !section.classList.contains("hidden") &&
            section.classList.contains("lg:block")) {
          section.classList.add("hidden");
        } else if (!list.classList.contains("hidden")) {
          list.classList.add("hidden");
        }
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2) Back to top button  ->  click event (and a small scroll listener)
   The button is created here in JavaScript, so no HTML file needs a new tag.
   -------------------------------------------------------------------------- */
function backToTopButton() {
  var button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", "Back to top");
  button.textContent = "↑"; // up arrow

  button.style.position = "fixed";
  button.style.right = "20px";
  button.style.bottom = "20px";
  button.style.width = "44px";
  button.style.height = "44px";
  button.style.borderRadius = "9999px";
  button.style.border = "none";
  button.style.background = "#4baf47";
  button.style.color = "#ffffff";
  button.style.fontSize = "18px";
  button.style.cursor = "pointer";
  button.style.display = "none";
  button.style.zIndex = "9999";
  button.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";

  document.body.appendChild(button);

  // Show the button only after scrolling down a bit.
  window.addEventListener("scroll", function () {
    button.style.display = window.scrollY > 300 ? "block" : "none";
  });

  // click event -> scroll back to the top of the page.
  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------------------------------
   3) Form validation  ->  submit event  +  input event
   Works for the contact form and the footer newsletter form.
   - submit: checks that every text/email field is filled and that email
     addresses look valid. Shows a message instead of reloading the page.
   - input: removes the red border as soon as the user fixes a field.
   -------------------------------------------------------------------------- */
function formValidation() {
  var forms = document.querySelectorAll("form");
  if (!forms.length) return;

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      var fields = form.querySelectorAll("input, textarea");
      var isValid = true;

      fields.forEach(function (field) {
        var type = (field.getAttribute("type") || "text").toLowerCase();
        if (type === "submit" || type === "button" || type === "hidden") return;

        var value = field.value.trim();

        if (value === "") {
          isValid = false;
          markInvalid(field);
        } else if (type === "email" && !isValidEmail(value)) {
          isValid = false;
          markInvalid(field);
        } else {
          clearInvalid(field);
        }
      });

      // Stop the page from reloading (there is no backend for this project).
      event.preventDefault();

      if (isValid) {
        showFormMessage(form, "Thank you! Your message has been sent.", "#4baf47");
        form.reset();
      } else {
        showFormMessage(form, "Please fill in all fields with valid information.", "#e03131");
      }
    });

    // input event: clear the error styling while the user types.
    form.addEventListener("input", function (event) {
      if (event.target.value.trim() !== "") {
        clearInvalid(event.target);
      }
    });
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function markInvalid(field) {
  field.style.border = "1px solid #e03131";
}

function clearInvalid(field) {
  field.style.border = "";
}

function showFormMessage(form, text, color) {
  var message = form.querySelector("[data-js-message]");
  if (!message) {
    message = document.createElement("p");
    message.setAttribute("data-js-message", "true");
    message.style.marginTop = "12px";
    message.style.fontSize = "14px";
    message.style.width = "100%";
    message.style.flexBasis = "100%"; // wrap below fields on flex forms
    form.appendChild(message);
  }
  message.textContent = text;
  message.style.color = color;
}

/* --------------------------------------------------------------------------
   4) Shop search / filter  ->  input event
   Filters the product cards on shop.html as the user types in the
   "Search products" box. Matching is done on the product title.
   -------------------------------------------------------------------------- */
function shopSearchFilter() {
  var searchInput = document.querySelector('input[placeholder="Search products"]');
  if (!searchInput) return;

  var wrapper = searchInput.closest(".grid");
  var productGrid = wrapper ? wrapper.querySelector(".grid") : null;
  if (!productGrid) return;

  var cards = productGrid.children;

  searchInput.addEventListener("input", function () {
    var term = searchInput.value.trim().toLowerCase();

    for (var i = 0; i < cards.length; i++) {
      var titleEl = cards[i].querySelector("h3");
      var title = titleEl ? titleEl.textContent.trim().toLowerCase() : "";
      var match = title.indexOf(term) !== -1;
      cards[i].classList.toggle("hidden", !match);
    }
  });
}
