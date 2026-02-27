/*
    Program name: hw1.js
    Author: Riya Deshmane
    Date created: 2/15/26
    Date last edited: 2/25/26
    Version: 1.0
    Description: JavaScript for Mouse Pediatrics patient registration form.
                 Handles dynamic date display and range slider output.
*/

//dynamic date js code
const d = new Date();
let text = d.toLocaleDateString();
document.getElementById("today").innerHTML = "Today's date: " + text;
if (document.getElementById("dateDisplay")) {
    document.getElementById("dateDisplay").innerHTML = text;
}

//name slider js code
let slider = document.getElementById("range");
let output = document.getElementById("range-slider");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
};
