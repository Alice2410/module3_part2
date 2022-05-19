"use strict";
const backLink = document.getElementById('back');
backLink === null || backLink === void 0 ? void 0 : backLink.addEventListener("click", startRedirect);
function startRedirect() {
    window.location.href = "/index.html";
}
