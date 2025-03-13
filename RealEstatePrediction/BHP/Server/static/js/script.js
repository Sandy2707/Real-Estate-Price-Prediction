// Function to get the selected bathroom value
function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value); // Bathrooms start from 1
    }
  }
  return -1; // Invalid value
}

// Function to get the selected BHK value
function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value); // BHK starts from 1
    }
  }
  return -1; // Invalid value
}

// Function to handle the "Estimate Price" button click
function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  // Ensure that all fields are filled
  if (sqft.value === "" || bhk === -1 || bathrooms === -1 || location.value === "") {
    alert("Please fill in all the fields.");
    return;
  }

  // Flask API URL (ensure correct port if changed)
  var url = "http://127.0.0.1:5000/predict_home_price";

  // Disable the estimate button to avoid multiple submissions
  document.querySelector(".submit").disabled = true;
  estPrice.innerHTML = "<h2>Loading...</h2>";

  $.ajax({
    url: url,
    type: "POST",
    contentType: "application/json", // Send as JSON
    data: JSON.stringify({
      total_sqft: parseFloat(sqft.value),
      bhk: parseInt(bhk),
      bath: parseInt(bathrooms),
      location: location.value
    }),
    success: function (data) {
      console.log("Estimated Price data:", data);
      estPrice.innerHTML = "<h2>Estimated Price: ₹" + data.estimated_price.toString() + " Lakh</h2>";
    },
    error: function (xhr, status, error) {
      estPrice.innerHTML = "<h2>Error: Could not get price estimate. Please try again later.</h2>";
      console.log("Error:", xhr.responseText);
    },
    complete: function () {
      document.querySelector(".submit").disabled = false;
    }
  });
}

// Function to fetch location names from Flask API
function onPageLoad() {
  console.log("Document loaded");

  var url = "http://127.0.0.1:5000/get_location_names";

  $.get(url, function (data, status) {
    console.log("Got response for get_location_names request");

    if (data && data.locations) {
      var locations = data.locations;
      var uiLocations = document.getElementById("uiLocations");
      $('#uiLocations').empty(); // Clear existing options
      $('#uiLocations').append(new Option("Choose a Location", "", true, false)); // Default option

      locations.forEach(function (location) {
        var opt = new Option(location, location);
        $('#uiLocations').append(opt);
      });
    } else {
      console.log("No locations data found!");
      alert("Failed to load location data. Please try again later.");
    }
  }).fail(function (xhr, status, error) {
    console.log("Error:", error);
    alert("Failed to load location data. Please try again later.");
  });
}

// Initialize locations on page load
window.onload = onPageLoad;
