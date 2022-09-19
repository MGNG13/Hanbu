(() => {
    const footer_copyright = document.getElementById("footer_information_copyright");
    footer_copyright.textContent = `${footer_copyright.textContent} ${new Date().getUTCFullYear()}`;
})();