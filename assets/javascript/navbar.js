window.onscroll = function () { myFunction() };

//In jQuery, to get the same result as document.getElementById, you can access the jQuery Object and get the first element in the object (Remember JavaScript objects act similar to associative arrays).
var navbar = $("#navbar")[0];
var sticky = navbar.offsetTop;

function myFunction() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky")
        $("#body").addClass("push")
    } else {
        navbar.classList.remove("sticky");
        $("#body").removeClass("push")

    }
}