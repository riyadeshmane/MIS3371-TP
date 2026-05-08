/*
    Program name: hw4.js
    Author: Riya Deshmane
    Date created: 3/26/26
    Date last edited: 5/8/26
    Version: 1.2
    Description: JavaScript for Mouse Pediatrics patient registration form.
                 Req 1: Fetch API - loads states from states.html
                 Req 4: Cookies  - remembers first name for 48 hours
                 Req 5: localStorage - saves/restores all non-secure fields
*/

// ============================================================
// REQUIREMENT 1: FETCH API
// Loads state <option> tags from states.html into the select
// ============================================================
fetch("states.html")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Could not load states.html: " + response.status);
        }
        return response.text();
    })
    .then(function (html) {
        var stateSelect = document.getElementById("state");
        stateSelect.innerHTML = html;

        // After states load, restore saved state from localStorage if present
        var savedState = getFromLocalStorage("ls_state");
        if (savedState) {
            stateSelect.value = savedState;
        }

        // Save state selection to localStorage when changed
        stateSelect.addEventListener("change", function () {
            if (isRememberMeChecked()) {
                saveToLocalStorage("ls_state", stateSelect.value);
            }
        });
    })
    .catch(function (error) {
        console.error("Fetch error:", error);
        document.getElementById("state").innerHTML =
            "<option disabled selected>Error loading states. Please refresh.</option>";
    });

// ============================================================
// DYNAMIC DATE
// ============================================================
var d = new Date();
var todayText = d.toLocaleDateString();
if (document.getElementById("dateDisplay")) {
    document.getElementById("dateDisplay").innerHTML = todayText;
}

// ============================================================
// RANGE SLIDER
// ============================================================
var slider = document.getElementById("range");
var rangeOutput = document.getElementById("range-slider");
if (slider && rangeOutput) {
    rangeOutput.innerHTML = slider.value;
    slider.oninput = function () {
        rangeOutput.innerHTML = this.value;
    };
}

// ============================================================
// REQUIREMENT 4: COOKIE HELPERS
// ============================================================

// Set a cookie - uses HOURS (requirement says 48 hours max)
function setCookie(name, cvalue, expiryHours) {
    var expDate = new Date();
    expDate.setTime(expDate.getTime() + (expiryHours * 60 * 60 * 1000));
    var expires = "expires=" + expDate.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
}

function getCookie(name) {
    var cookieName = name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].trim();
        if (c.indexOf(cookieName) === 0) {
            return decodeURIComponent(c.substring(cookieName.length, c.length));
        }
    }
    return "";
}

function deleteAllCookies() {
    document.cookie.split(";").forEach(function (cookie) {
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    });
}

// ============================================================
// REQUIREMENT 5: LOCAL STORAGE HELPERS
// ============================================================
function saveToLocalStorage(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
}

function getFromLocalStorage(key) {
    try { return localStorage.getItem(key) || ""; } catch (e) { return ""; }
}

function clearLocalStorage() {
    try { localStorage.clear(); } catch (e) {}
}

// ============================================================
// FIELDS TO SAVE (non-secure only - no SSN, no password)
// ============================================================
var rememberedFields = [
    { id: "fname",    cookieName: "firstName", lsKey: "ls_fname"    },
    { id: "minitial", cookieName: null,         lsKey: "ls_minitial" },
    { id: "lname",    cookieName: null,         lsKey: "ls_lname"    },
    { id: "dob",      cookieName: null,         lsKey: "ls_dob"      },
    { id: "email",    cookieName: null,         lsKey: "ls_email"    },
    { id: "phonenum", cookieName: null,         lsKey: "ls_phonenum" },
    { id: "address1", cookieName: null,         lsKey: "ls_address1" },
    { id: "address2", cookieName: null,         lsKey: "ls_address2" },
    { id: "city",     cookieName: null,         lsKey: "ls_city"     },
    { id: "zipcode",  cookieName: null,         lsKey: "ls_zipcode"  },
    { id: "username", cookieName: null,         lsKey: "ls_username" },
    { id: "notes",    cookieName: null,         lsKey: "ls_notes"    }
];

function isRememberMeChecked() {
    var cb = document.getElementById("remember-me");
    return cb && cb.checked;
}

// ============================================================
// REQUIREMENT 4 & 5: PAGE LOAD - cookies + localStorage init
// ============================================================
document.addEventListener("DOMContentLoaded", function () {

    var firstName = getCookie("firstName");
    var welcome1  = document.getElementById("welcome1");
    var welcome2  = document.getElementById("welcome2");

    if (firstName !== "") {
        // --- RETURNING USER ---
        // Show welcome back in heading
        if (welcome1) welcome1.innerHTML = "Welcome back, " + firstName + "!";

        // Show "Not [Name]?" link
        if (welcome2) {
            welcome2.innerHTML =
                "<a href='#' id='new-user'>Not " + firstName +
                "? Click here to start as a new user.</a>";

            document.getElementById("new-user").addEventListener("click", function (e) {
                e.preventDefault();
                // Expire cookie and clear all local storage, then reload
                deleteAllCookies();
                clearLocalStorage();
                location.reload();
            });
        }

        // Restore all non-secure fields from localStorage
        rememberedFields.forEach(function (field) {
            var el = document.getElementById(field.id);
            if (!el) return;
            var saved = getFromLocalStorage(field.lsKey);
            if (saved !== "") {
                el.value = saved;
            }
        });

    } else {
        // --- NEW USER ---
        if (welcome1) welcome1.innerHTML = "Welcome, new user!";
        if (welcome2) welcome2.innerHTML = "";
    }

    // --- Attach input/blur listeners to save data ---
    rememberedFields.forEach(function (field) {
        var el = document.getElementById(field.id);
        if (!el) return;

        function saveField() {
            if (!isRememberMeChecked()) return;
            // Save first name both as 48-hour cookie AND localStorage
            if (field.id === "fname" && el.value.trim() !== "") {
                setCookie("firstName", el.value.trim(), 48);
            }
            saveToLocalStorage(field.lsKey, el.value);
        }

        el.addEventListener("input", saveField);
        el.addEventListener("blur", saveField);
    });

    // --- Remember Me checkbox ---
    var rememberMeBox = document.getElementById("remember-me");
    if (rememberMeBox) {
        rememberMeBox.addEventListener("change", function () {
            if (!this.checked) {
                // Unchecked: delete cookie and clear localStorage
                deleteAllCookies();
                clearLocalStorage();
            } else {
                // Re-checked: save current field values
                rememberedFields.forEach(function (field) {
                    var el = document.getElementById(field.id);
                    if (!el || el.value.trim() === "") return;
                    if (field.id === "fname") {
                        setCookie("firstName", el.value.trim(), 48);
                    }
                    saveToLocalStorage(field.lsKey, el.value);
                });
            }
        });
    }
});

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

function validateFname() {
    var fname = document.getElementById("fname").value.trim();
    var namePattern = /^[a-zA-Z'-]+$/;
    if (fname === "") {
        document.getElementById("fname-error").innerHTML = "First name field cannot be empty";
        return false;
    } else if (!fname.match(namePattern)) {
        document.getElementById("fname-error").innerHTML = "Letters, apostrophes, and dashes only.";
        return false;
    } else if (fname.length < 2) {
        document.getElementById("fname-error").innerHTML = "First name cannot be less than 2 characters.";
        return false;
    } else if (fname.length > 30) {
        document.getElementById("fname-error").innerHTML = "First name cannot be more than 30 characters.";
        return false;
    } else {
        document.getElementById("fname-error").innerHTML = "";
        return true;
    }
}

function validateMinitial() {
    var mini = document.getElementById("minitial").value;
    mini = mini.toUpperCase();
    document.getElementById("minitial").value = mini;
    if (mini !== "" && !mini.match(/^[a-zA-Z]$/)) {
        document.getElementById("minitial-error").innerHTML = "Middle initial must be a single letter";
        return false;
    }
    document.getElementById("minitial-error").innerHTML = "";
    return true;
}

function validateLname() {
    var lname = document.getElementById("lname").value.trim();
    var namePattern = /^[a-zA-Z'-]+$/;
    if (lname === "") {
        document.getElementById("lname-error").innerHTML = "Last name field cannot be empty";
        return false;
    } else if (!lname.match(namePattern)) {
        document.getElementById("lname-error").innerHTML = "Letters, apostrophes, and dashes only.";
        return false;
    } else if (lname.length > 30) {
        document.getElementById("lname-error").innerHTML = "Last name cannot be more than 30 characters.";
        return false;
    }
    document.getElementById("lname-error").innerHTML = "";
    return true;
}

function validateDob() {
    var dob = document.getElementById("dob");
    var date = new Date(dob.value);
    var maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 120);
    if (!dob.value) {
        document.getElementById("dob-error").innerHTML = "Date of birth cannot be empty";
        return false;
    } else if (date > new Date()) {
        document.getElementById("dob-error").innerHTML = "Date can't be in the future";
        dob.value = "";
        return false;
    } else if (date < maxDate) {
        document.getElementById("dob-error").innerHTML = "Date can't be more than 120 years ago";
        dob.value = "";
        return false;
    }
    document.getElementById("dob-error").innerHTML = "";
    return true;
}

function validateSsn() {
    var ssn = document.getElementById("ssn").value;
    var ssnR = /^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/;
    if (!ssnR.test(ssn)) {
        document.getElementById("ssn-error").innerHTML = "Please enter a valid SSN";
        return false;
    }
    document.getElementById("ssn-error").innerHTML = "";
    return true;
}

function validatePhone() {
    var phoneInput = document.getElementById("phonenum");
    var phone = phoneInput.value.replace(/\D/g, "");
    if (phone.length === 0) {
        document.getElementById("phonenum-error").innerHTML = "Phone Number cannot be left blank";
        return false;
    } else if (phone.length !== 10) {
        document.getElementById("phonenum-error").innerHTML = "Phone Number must be 10 digits";
        return false;
    }
    var formatted = phone.slice(0, 3) + "-" + phone.slice(3, 6) + "-" + phone.slice(6, 10);
    phoneInput.value = formatted;
    document.getElementById("phonenum-error").innerHTML = "";
    return true;
}

function validateAddress1() {
    var ad1 = document.getElementById("address1").value;
    if (ad1.length < 2) {
        document.getElementById("address1-error").innerHTML = "Please enter your address";
        return false;
    }
    document.getElementById("address1-error").innerHTML = "";
    return true;
}

function validateCity() {
    var city = document.getElementById("city").value.trim();
    if (!city) {
        document.getElementById("city-error").innerHTML = "City can't be blank";
        return false;
    }
    document.getElementById("city-error").innerHTML = "";
    return true;
}

function validateZipcode() {
    var zipInput = document.getElementById("zipcode");
    var zip = zipInput.value.replace(/[^\d-]/g, "");
    if (!zip) {
        document.getElementById("zipcode-error").innerHTML = "Zip code can't be blank";
        return false;
    }
    var digits = zip.replace(/-/g, "");
    if (digits.length > 5) {
        zip = digits.slice(0, 5) + "-" + digits.slice(5, 9);
    } else {
        zip = digits.slice(0, 5);
    }
    zipInput.value = zip;
    document.getElementById("zipcode-error").innerHTML = "";
    return true;
}

function validateEmail() {
    var email = document.getElementById("email").value;
    var emailR = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email === "") {
        document.getElementById("email-error").innerHTML = "Email cannot be blank";
        return false;
    } else if (!email.match(emailR)) {
        document.getElementById("email-error").innerHTML = "Please enter a valid email address";
        return false;
    }
    document.getElementById("email-error").innerHTML = "";
    return true;
}

function validateUsername() {
    var username = document.getElementById("username").value.toLowerCase();
    document.getElementById("username").value = username;
    if (username.length === 0) {
        document.getElementById("username-error").innerHTML = "User ID can't be blank";
        return false;
    }
    if (!isNaN(username.charAt(0))) {
        document.getElementById("username-error").innerHTML = "User ID can't start with a number";
        return false;
    }
    var regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(username)) {
        document.getElementById("username-error").innerHTML = "Username can only have letters, numbers, underscores, and dashes";
        return false;
    } else if (username.length < 5) {
        document.getElementById("username-error").innerHTML = "Username must be at least 5 characters";
        return false;
    } else if (username.length > 30) {
        document.getElementById("username-error").innerHTML = "Username can't exceed 30 characters";
        return false;
    }
    document.getElementById("username-error").innerHTML = "";
    return true;
}

function validatePassword() {
    var pass     = document.getElementById("password").value;
    var username = document.getElementById("username").value;
    var ids = ["msg1","msg2","msg3","msg4","msg5"];
    ids.forEach(function (id) { document.getElementById(id).innerHTML = ""; });
    var idx = 1;
    if (!pass.match(/[a-z]/))                                      document.getElementById("msg" + idx++).innerHTML = "&#10060; Enter at least one lowercase letter";
    if (!pass.match(/[A-Z]/))                                      document.getElementById("msg" + idx++).innerHTML = "&#10060; Enter at least one uppercase letter";
    if (!pass.match(/[0-9]/))                                      document.getElementById("msg" + idx++).innerHTML = "&#10060; Enter at least one number";
    if (!pass.match(/[!@#$%&*\-_\\.+()]/))                        document.getElementById("msg" + idx++).innerHTML = "&#10060; Enter at least one special character";
    if (username && (pass === username || pass.includes(username))) document.getElementById("msg" + idx++).innerHTML = "&#10060; Password cannot contain username";
    return idx === 1;
}

function confirmPassword() {
    var p1 = document.getElementById("password").value;
    var p2 = document.getElementById("confirmpass").value;
    if (p1 !== p2) {
        document.getElementById("password2-error").innerHTML = "Passwords don't match";
        return false;
    }
    document.getElementById("password2-error").innerHTML = "&#10004; Passwords match";
    return true;
}

// ============================================================
// REVIEW BUTTON
// ============================================================
function reviewInput() {
    var formcontent = document.querySelector("form");
    var out = "<table class='output'><tr><th colspan='2'>Review Your Information:</th></tr>";
    for (var i = 0; i < formcontent.elements.length; i++) {
        var el    = formcontent.elements[i];
        var dtype = el.type;
        var name  = el.name;
        var val   = el.value;
        if (!name) continue;
        switch (dtype) {
            case "checkbox":
                if (el.checked && name !== "remember-me") {
                    out += "<tr><td align='right'>" + name + "</td><td class='outputdata'>&#x2713;</td></tr>";
                }
                break;
            case "radio":
                if (el.checked) {
                    out += "<tr><td align='right'>" + name + "</td><td class='outputdata'>" + val + "</td></tr>";
                }
                break;
            case "password":
                break; // Never show SSN or passwords
            case "button":
            case "submit":
            case "reset":
                break;
            default:
                if (val !== "") {
                    out += "<tr><td align='right'>" + name + "</td><td class='outputdata'>" + val + "</td></tr>";
                }
        }
    }
    out += "</table>";
    document.getElementById("showInput").innerHTML = out;
}

// ============================================================
// ALERT BOX
// ============================================================
function showAlert() {
    var alertBox   = document.getElementById("alert-box");
    var closeAlert = document.getElementById("close-alert");
    alertBox.style.display = "flex";
    closeAlert.onclick = function () { alertBox.style.display = "none"; };
}

// ============================================================
// VALIDATE EVERYTHING
// ============================================================
function validateEverything() {
    var valid = true;
    if (!validateFname())    valid = false;
    if (!validateMinitial()) valid = false;
    if (!validateLname())    valid = false;
    if (!validateDob())      valid = false;
    if (!validateSsn())      valid = false;
    if (!validateAddress1()) valid = false;
    if (!validateCity())     valid = false;
    if (!validateZipcode())  valid = false;
    if (!validateEmail())    valid = false;
    if (!validatePhone())    valid = false;
    if (!validateUsername()) valid = false;
    if (!validatePassword()) valid = false;
    if (!confirmPassword())  valid = false;

    var submitBtn = document.getElementById("submit");
    if (valid) {
        if (submitBtn) submitBtn.style.display = "inline";
    } else {
        if (submitBtn) submitBtn.style.display = "none";
        showAlert();
    }
}