// Get the form element
var form = document.getElementById('userForm');

// Add event listener for form submission
form.addEventListener('submit', function(event) {
  // Prevent the default form submission
  event.preventDefault();
  
  var firstName = form.elements['firstName'].value;
  var lastName = form.elements['lastName'].value;
  var age = form.elements['age'].value;
  var year = form.elements['year'].value;
  var licenseNo = form.elements['licenseNo'].value;

  if (firstName.trim() === '') {
    alert('First Name cannot be empty');
    return;
  }

  if (lastName.trim() === '') {
    alert('Last Name cannot be empty');
    return;
  }

  if (age < 18) {
    alert('You must be at least 18 years old');
    return;
  }

  if (year < 1900 || year > 2022) {
    alert('Year must be between 1900 and 2022');
    return;
  }

  // if (licenseNo.length !== 8 || !/^[a-zA-Z0-9]+$/.test(licenseNo)) {
  //   alert('License Number must be 8 characters long and alphanumeric');
  //   return;
  // }
  
  form.submit();
});
