document.addEventListener("DOMContentLoaded", function () {
  setupProductsPage();
  setupContactForm();
});

function setupProductsPage() {
  var productsContainer = document.getElementById("products-list");
  if (!productsContainer) {
    return;
  }

  var messageElement = document.getElementById("products-message");
  var categorySelect = document.getElementById("filter-category");
  var sortSelect = document.getElementById("sort-price");
  var applyButton = document.getElementById("apply-filters");
  var resetButton = document.getElementById("reset-filters");

  var allProducts = [];

  fetch("data/products.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      allProducts = data;
      showProducts(allProducts, productsContainer, messageElement);
    })
    .catch(function () {
      if (messageElement) {
        messageElement.textContent = "Could not load products.";
      }
    });

  if (applyButton) {
    applyButton.addEventListener("click", function () {
      var category = categorySelect ? categorySelect.value : "all";
      var sortType = sortSelect ? sortSelect.value : "none";

      var list = allProducts.slice();

      if (category !== "all") {
        list = list.filter(function (item) {
          return item.category === category;
        });
      }

      if (sortType === "low-high") {
        list.sort(function (a, b) {
          return a.price - b.price;
        });
      } else if (sortType === "high-low") {
        list.sort(function (a, b) {
          return b.price - a.price;
        });
      }

      showProducts(list, productsContainer, messageElement);
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      if (categorySelect) {
        categorySelect.value = "all";
      }
      if (sortSelect) {
        sortSelect.value = "none";
      }
      showProducts(allProducts, productsContainer, messageElement);
    });
  }
}

function showProducts(products, container, messageElement) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!products || products.length === 0) {
    if (messageElement) {
      messageElement.textContent = "No products found.";
    }
    return;
  }

  if (messageElement) {
    messageElement.textContent = "";
  }

  products.forEach(function (item) {
    var card = document.createElement("article");
    card.className = "product-card";

    var img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;

    var title = document.createElement("h2");
    title.textContent = item.name;

    var price = document.createElement("p");
    price.className = "price";
    price.textContent = "$" + item.price.toFixed(2);

    var desc = document.createElement("p");
    desc.className = "description";
    desc.textContent = item.description;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(desc);

    container.appendChild(card);
  });
}

function setupContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  var messageElement = document.getElementById("contact-message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var textInput = document.getElementById("message");

    var name = nameInput ? nameInput.value.trim() : "";
    var email = emailInput ? emailInput.value.trim() : "";
    var text = textInput ? textInput.value.trim() : "";

    if (!name || !email || !text) {
      if (messageElement) {
        messageElement.textContent = "Please fill in name, email, and message.";
        messageElement.style.color = "red";
      }
      return;
    }

    if (!simpleEmailValid(email)) {
      if (messageElement) {
        messageElement.textContent = "Please enter a valid email address.";
        messageElement.style.color = "red";
      }
      return;
    }

    if (messageElement) {
      messageElement.textContent = "Thank you. Your message has been sent.";
      messageElement.style.color = "green";
    }

    form.reset();
  });
}

function simpleEmailValid(email) {
  return email.indexOf("@") > 0 && email.indexOf(".") > 0;
}