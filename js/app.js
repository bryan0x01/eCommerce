// Makes sure everything is loades before load the javascript
document.addEventListener("DOMContentLoaded", function () {
  setupProductsPage();
  setupContactForm();
});

//set up products function
function setupProductsPage() {

  //gets the products Container element from the html
  var productsContainer = document.getElementById("products-list");

  //if not or empty product container return nothing
  if (!productsContainer) {
    return;
  }

  //get elements from the html
  var messageElement = document.getElementById("products-message");
  var categorySelect = document.getElementById("filter-category");
  var sortSelect = document.getElementById("sort-price");
  var applyButton = document.getElementById("apply-filters");
  var resetButton = document.getElementById("reset-filters");

  //store the products in a new array 
  var allProducts = [];

  //load the json file and handles errors
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

  //apply button to apply filter configurations //if applybutton exits continue
  if (applyButton) {
    //when clicking apply:
    applyButton.addEventListener("click", function () {
      //if categorySelect exists, use its value, otherwise default to "all"
      var category = categorySelect ? categorySelect.value : "all";
      //if sortSelect exists, use its value, otherwise default to "none"
      var sortType = sortSelect ? sortSelect.value : "none";

      // create a copy of the array so dont have to change the original
      var list = allProducts.slice();

      // if category not equal to "all"(specific selected)
      if (category !== "all") {
        //filter the list to only items in that category
        list = list.filter(function (item) {
          // keep the items that match the category
          return item.category === category;
        });
      }

      //if sorting low to high 
      if (sortType === "low-high") {
        //sort list by ascending price
        list.sort(function (a, b) {
          //smaller prices first
          return a.price - b.price;
        });
        //if sorting high to low
      } else if (sortType === "high-low") {
        //sort list by descending price
        list.sort(function (a, b) {
          //bigger prices first
          return b.price - a.price;
        });
      }

      //display the filtered products
      showProducts(list, productsContainer, messageElement);
    });
  }

  //if resetButton exists do:
  if (resetButton) {
    //when click:
    resetButton.addEventListener("click", function () {
      //if categorySelect exists 
      if (categorySelect) {
        //set value to all
        categorySelect.value = "all";
      }
      // if sortSelect exists
      if (sortSelect) {
        // set value to none
        sortSelect.value = "none";
      }
      //show all the products in them original position 
      showProducts(allProducts, productsContainer, messageElement);
    });
  }
}

//show products function / get them from the json and pass them to the html
function showProducts(products, container, messageElement) {
  // if container empty or none return nothing.
  if (!container) {
    return;
  }

  //clear container before showing the products 
  container.innerHTML = "";

  //if products empty or non existent show alert
  if (!products || products.length === 0) {
    if (messageElement) {
      messageElement.textContent = "No products found.";
    }
    return;
  }

  //set message to empty
  if (messageElement) {
    messageElement.textContent = "";
  }

  // for each product function
  products.forEach(function (item) {
    
    // create a new article element for the product card
    var card = document.createElement("article");
    //add the css class so it gets the product-card styling
    card.className = "product-card";

    // create a img element 
    var img = document.createElement("img");
    //set the image source from the product data
    img.src = item.image;
    // set the alt text using products name 
    img.alt = item.name;

    // create an h2 element for tittle of product
    var title = document.createElement("h2");
    // set the text content using products name
    title.textContent = item.name;

    // create a p element for price 
    var price = document.createElement("p");
    //add the css class for price styling
    price.className = "price";
    //show the price with dollar sing and 2 decimals
    price.textContent = "$" + item.price.toFixed(2);

    //create a p element for descriptions
    var desc = document.createElement("p");
    //add the css class for the desc styling
    desc.className = "description";
    // sets the descr content from the product data (json)
    desc.textContent = item.description;

    // add info to the product card
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(desc);

    //add the finished product card to the html
    container.appendChild(card);
  });
}

// setup contact form function
function setupContactForm() {
  //get element contact-form
  var form = document.getElementById("contact-form");
  //if form not existent return nothing
  if (!form) {
    return;
  }

  //get contact-message
  var messageElement = document.getElementById("contact-message");

  //submit event listener
  form.addEventListener("submit", function (event) {
    // prevents website to reload (basically not letting do the default settings)
    event.preventDefault();

    //get inputs (name,email,message)
    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var textInput = document.getElementById("message");

    // trim(removes extra spaces start/end) the values and set to empty if missing
    var name = nameInput ? nameInput.value.trim() : "";
    var email = emailInput ? emailInput.value.trim() : "";
    var text = textInput ? textInput.value.trim() : "";

    // if form empty, ask the user to fill the form
    if (!name || !email || !text) {
      if (messageElement) {
        messageElement.textContent = "Please fill in name, email, and message.";
        messageElement.style.color = "red";
      }
      return;
    }

    //check the email its in a valid format
    if (!simpleEmailValid(email)) {
      if (messageElement) {
        messageElement.textContent = "Please enter a valid email address.";
        messageElement.style.color = "red";
      }
      return;
    }

    //after filling out the form correctly it send a thank you message
    if (messageElement) {
      messageElement.textContent = "Thank you. Your message has been sent.";
      messageElement.style.color = "green";
    }

    //resets the form
    form.reset();
  });
}

//checks the email format 
function simpleEmailValid(email) {
  return email.indexOf("@") > 0 && email.indexOf(".") > 0;
}