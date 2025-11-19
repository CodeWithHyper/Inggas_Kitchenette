function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", function(){

const form = document.querySelector(".feedback-section form");
const name = document.getElementById("userName");
const email = document.getElementById("userEmail"); 
const phoneNum= document.getElementById("userNum");
const starRate = document.getElementsByName("rate");
const feedback = document.getElementById("feedbackText");

if(!form){
   console.error("The form was not found!");
    return;
}

if(form){
form.addEventListener("submit", function(e){
e.preventDefault();

let rating = null;
for(let star of starRate){
if(star.checked){
 rating = star.id.replace("rate-","");
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