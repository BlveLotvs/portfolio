var map = L.map('map').setView([46.603354, 1.888334], 6); // Centrage sur la France

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

var formations = [
    { coords: [48.9415, 2.3601], nom: "Université Paris 8 - Master G2M", desc: "2023-2025", color: "blue" },
    { coords: [43.1895, 2.3402], nom: "IUT de Carcassonne - Licence Pro SIG WEB", desc: "2022-2023", color: "blue" },
    { coords: [45.7500, 4.8550], nom: "Université Lyon 3 - Licence Géographie", desc: "2019-2022", color: "blue" },
    { coords: [45.7657, 4.8450], nom: "Lycée Edouard Herriot - Bac ES", desc: "2017-2019", color: "blue" }
];

var experiences = [
    { coords: [48.8387, 2.7913], nom: "Groupe SAUR", desc: "Géomaticien - 2023-2025", color: "red" },
    { coords: [48.8950, 2.2265], nom: "Veolia Eau d'Ile de France", desc: "Technicien SIG - 2022-2023", color: "red" },
    { coords: [45.7578, 4.8326], nom: "Jobs étudiants et bénévolat", desc: "Animateur, Livreur, Scouts - 2018-2023", color: "red" }
];

// Ajout des marqueurs avec couleurs
function addMarkers(data, category) {
    data.forEach(function(item) {
        var marker = L.circleMarker(item.coords, {
            radius: 8,
            fillColor: item.color,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        marker.bindPopup(`<strong>${item.nom}</strong><br>${item.desc}`);
    });
}

addMarkers(formations, "formation");
addMarkers(experiences, "experience");

// Ajout de la légende
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<strong>Légende</strong><br>";
    div.innerHTML += '<i style="background: blue"></i> Formations<br>';
    div.innerHTML += '<i style="background: red"></i> Expériences<br>';
    return div;
};

legend.addTo(map);
