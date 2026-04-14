/*
    Name: Riya Deshmane
    Date created: 2/15/26
    Date last updated: 2/23/26
    Purpose: Homework 1 Javascript 
*/   

//dynamic date//
const d = new Date();
let text = d.toLocaleDateString();
document.getElementById("today").innerHTML = text;

//range slider//
let slider = document.getElementById("range");
let output = document.getElementById("range-slider");
output.innerHTML = slider.value;

slider.oninput = function () {
    output.innerHTML = this.value;
};