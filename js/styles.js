document.addEventListener("DOMContentLoaded", function() {
    // Ajout d'une animation au survol des icônes
    document.querySelectorAll(".icon").forEach(icon => {
        icon.addEventListener("mouseenter", function() {
            this.style.transform = "scale(1.2)";
            this.style.transition = "transform 0.3s ease";
        });
        icon.addEventListener("mouseleave", function() {
            this.style.transform = "scale(1)";
        });
    });

    document.querySelectorAll(".logo").forEach(icon => {
        icon.addEventListener("mouseenter", function() {
            this.style.transform = "scale(1.2)";
            this.style.transition = "transform 0.3s ease";
        });
        icon.addEventListener("mouseleave", function() {
            this.style.transform = "scale(1)";
        });
    });
    // Ajout d'une animation au chargement de la page
    document.querySelector("body").style.opacity = "0";
    document.querySelector("body").style.transition = "opacity 1s ease-in-out";
    setTimeout(() => {
        document.querySelector("body").style.opacity = "1";
    }, 200);

    // Ajout d'un effet de surbrillance aux sections au survol
    document.querySelectorAll(".section-title").forEach(section => {
        section.addEventListener("mouseenter", function() {
            this.style.backgroundColor = "#FFD700";
            this.style.transition = "background-color 0.3s ease";
        });
        section.addEventListener("mouseleave", function() {
            this.style.backgroundColor = "#FFA500";
        });
    });
});
