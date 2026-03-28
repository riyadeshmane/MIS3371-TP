/*
    Program name: hw2.js
    Author: Riya Deshmane
    Date created: 3/26/26
    Date last edited: 3/26/26
    Version: 1.0
    Description: JavaScript for Mouse Pediatrics patient registration form.
                 Handles dynamic date display and range slider output.
*/

// dynamic date js code
const d = new Date();
let text = d.toLocaleDateString();
document.getElementById("today").innerHTML = "Today's date: " + text;
if (document.getElementById("dateDisplay")) {
    document.getElementById("dateDisplay").innerHTML = text;
}

// range slider js code
let slider = document.getElementById("range");
let output = document.getElementById("range-slider");
if (slider && output) {
    output.innerHTML = slider.value;
    slider.oninput = function () {
        output.innerHTML = this.value;
    };
}

// validates first name
function validateFname() {
    const fname = document.getElementById("fname").value;
    const nameR = /^[a-zA-Z'-]{1,30}$/;

    if (fname == "") {
        document.getElementById("fname-error").innerHTML = "First name cannot be blank";
        return false;
    } else if (!nameR.test(fname)) {
        document.getElementById("fname-error").innerHTML = "Letters, apostrophes, and dashes only";
        return false;
    } else {
        document.getElementById("fname-error").innerHTML = "";
        return true;
    }
}

// validates middle initial
function validateMinitial() {
    const minitial = document.getElementById("minitial").value;
    const miR = /^[a-zA-Z]{0,1}$/;

    if (!miR.test(minitial)) {
        document.getElementById("minitial-error").innerHTML = "One letter only";
        return false;
    } else {
        document.getElementById("minitial-error").innerHTML = "";
        return true;
    }
}

// validates last name
function validateLname() {
    const lname = document.getElementById("lname").value;
    const nameR = /^[a-zA-Z'-]{1,30}$/;

    if (lname == "") {
        document.getElementById("lname-error").innerHTML = "Last name cannot be blank";
        return false;
    } else if (!nameR.test(lname)) {
        document.getElementById("lname-error").innerHTML = "Letters, apostrophes, and dashes only";
        return false;
    } else {
        document.getElementById("lname-error").innerHTML = "";
        return true;
    }
}

// validates date of birth
function validateDob() {
    dob = document.getElementById("dob");
    let date = new Date(dob.value);
    let maxDate = new Date().setFullYear(new Date().getFullYear() - 120);

    if (date > new Date()) {
        document.getElementById("dob-error").innerHTML =
        "Date can't be in the future";
        dob.value = "";
        return false;
    } else if (date < new Date(maxDate)) {
        document.getElementById("dob-error").innerHTML =
        "Date can't be more than 120 years ago";
        dob.value = "";
        return false;
    } else {
        document.getElementById("dob-error").innerHTML = "";
        return true;
    }
}

// validates SSN
function validateSsn() {
    const ssn = document.getElementById("ssn").value;
    const ssnR = /^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/;

    if (!ssnR.test(ssn)) {
        document.getElementById("ssn-error").innerHTML =
        "Please enter a valid SSN";
        return false;
    } else {
        document.getElementById("ssn-error").innerHTML = "";
        return true;
    }
}

// validates phone number
function validatePhonenum() {
    const phoneInput = document.getElementById("phonenum");
    const phone = phoneInput.value.replace(/\D/g, ""); // removes all non-number characters

    if (phone.length === 0) {
        document.getElementById("phonenum-error").innerHTML =
        "Phone Number cannot be left blank";
        return false;
    } else if (phone.length !== 10) {
        document.getElementById("phonenum-error").innerHTML =
        "Phone Number must be 10 digits";
        return false;
    }

    const formattedPhone = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6, 10);
    phoneInput.value = formattedPhone;
    document.getElementById("phonenum-error").innerHTML = "";
    return true;
}

// validates Address 1
function validateAddress1() {
    var ad1 = document.getElementById("address1").value;

    if (ad1.length < 2) {
        document.getElementById("address1-error").innerHTML =
        "Please enter your address";
        return false;
    } else {
        document.getElementById("address1-error").innerHTML = "";
        return true;
    }
}

// validates city
function validateCity() {
    city = document.getElementById("city").value.trim();

    if (!city) {
        document.getElementById("city-error").innerHTML = "City must be filled";
        return false;
    } else {
        document.getElementById("city-error").innerHTML = "";
        return true;
    }
}

// validates zipcode
function validateZipcode() {
    const zipInput = document.getElementById("zipcode");
    let zip = zipInput.value.replace(/[^\d-]/g, "");

    if (!zip) {
        document.getElementById("zipcode-error").innerHTML = 
        "Zip code can't be blank";
        return false;
    }

    if (zip.length > 5) {
        zip = zip.slice(0, 5) + "-" + zip.slice(5, 9);
    } else {
        zip = zip.slice(0, 5);
    }

    zipInput.value = zip;
    document.getElementById("zipcode-error").innerHTML = ""; 
    return true;
}

// validates email
function validateEmail() {
    email = document.getElementById("email").value;
    var emailR = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email == "") {
        document.getElementById("email-error").innerHTML =
        "Email cannot be blank";
        return false;
    } else if (!email.match(emailR)) {
        document.getElementById("email-error").innerHTML =
        "Please enter a valid email address";
        return false;
    } else {
        document.getElementById("email-error").innerHTML = "";
        return true;
    }
}

// validates username
function validateUsername() {
    username = document.getElementById("username").value.toLowerCase();
    document.getElementById("username").value = username;

    if (username.length == 0) {
        document.getElementById("username-error").innerHTML =
        "User ID can't be blank";
        return false;
    }

    if (!isNaN(username.charAt(0))) {
        document.getElementById("username-error").innerHTML =
        "User ID can't start with a number";
        return false;
    }

    let regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(username)) {
        document.getElementById("username-error").innerHTML =
        "Username can only have letters, numbers, underscores, and dashes";
        return false;
    } else if (username.length < 5) {
        document.getElementById("username-error").innerHTML =
        "Username must be at least 5 characters";
        return false;
    } else if (username.length > 30) {
        document.getElementById("username-error").innerHTML =
        "Username can't exceed 30 characters";
        return false;
    } else {
        document.getElementById("username-error").innerHTML = "";
        return true;
    }
}

// validates password
function validatePassword() {
    const pass = document.getElementById("password").value; 
    const username = document.getElementById("username").value;

    const errorSpans = ["msg1","msg2","msg3","msg4","msg5"];
    errorSpans.forEach(id => document.getElementById(id).innerHTML = "");

    let msgIndex = 1;

    if (!pass.match(/[a-z]/)) {
        document.getElementById("msg" + msgIndex++).innerHTML = "❌ Enter at least one lowercase letter";
    }
    if (!pass.match(/[A-Z]/)) {
        document.getElementById("msg" + msgIndex++).innerHTML = "❌ Enter at least one uppercase letter";
    }
    if (!pass.match(/[0-9]/)) {
        document.getElementById("msg" + msgIndex++).innerHTML = "❌ Enter at least one number";
    }
    if (!pass.match(/[!\@#\$%&*\-_\\.+\(\)]/)) {
        document.getElementById("msg" + msgIndex++).innerHTML = "❌ Enter at least one special character";
    }
    if (username && (pass === username || pass.includes(username))) {
        document.getElementById("msg" + msgIndex++).innerHTML = "❌ Password cannot contain username";
    }
    return valid;
}

// confirm password 
function confirmPassword() {
    pword1 = document.getElementById("password").value;   
    pword2 = document.getElementById("confirmpass").value; 

    if (pword1 !== pword2) {
        document.getElementById("password2-error").innerHTML = 
        "Passwords don't match";
        return false;
    } else {
        document.getElementById("password2-error").innerHTML =
        "✔ Passwords match";
        return true;
    }
}

// review button
function reviewInput() {
    var formcontent = document.querySelector("form");
    var formoutput = "<table class='output'><tr><th colspan='2'>Review Your Information:</th></tr>";

    for (var i = 0; i < formcontent.elements.length; i++) {
        var el = formcontent.elements[i];
        var datatype = el.type;
        var name = el.name;
        var value = el.value;

        if (!name) continue;

        switch (datatype) {
            case "checkbox":
                if (el.checked) {
                    formoutput += "<tr><td align='right'>" + name + "</td>";
                    formoutput += "<td class='outputdata'>&#x2713;</td></tr>";
                }
                break;

            case "radio":
                if (el.checked) {
                    formoutput += "<tr><td align='right'>" + name + "</td>";
                    formoutput += "<td class='outputdata'>" + value + "</td></tr>";
                }
                break;

            case "range":
                if (value !== "0") {
                    formoutput += "<tr><td align='right'>" + name + "</td>";
                    formoutput += "<td class='outputdata'>" + value + "</td></tr>";
                }
                break;

            case "button":
            case "submit":
            case "reset":
                break;

            default:
                if (value !== "") {
                    formoutput += "<tr><td align='right'>" + name + "</td>";
                    formoutput += "<td class='outputdata'>" + value + "</td></tr>";
                }
        }
    }

    formoutput += "</table>";
    document.getElementById("showInput").innerHTML = formoutput;
}

// remove user input
function removeReview() {
    document.getElementById("showInput").innerHTML = "";
}