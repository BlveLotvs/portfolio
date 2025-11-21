// 1. MISE EN PLACE DU FOND DE CARTE (BASEMAP)
// On utilise CartoDB Positron pour un rendu "Data Viz" 
const basemapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attributions: '© OpenStreetMap contributors, © CARTO'
    })
});

// 2. GESTION DES REGIONS (Vecteur)
const regionsSource = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(regions, {
        featureProjection: 'EPSG:3857'
    })
});

// Style Choroplèthe dynamique
const styleRegions = function(feature) {
    const population = feature.get('population');
    let color;
    // Palette de couleurs séquentielle (Oranges)
    if (population <= 3000000) color = 'rgba(254, 237, 222, 0.8)';
    else if (population <= 6000000) color = 'rgba(253, 190, 133, 0.8)';
    else if (population <= 9000000) color = 'rgba(253, 141, 60, 0.8)';
    else color = 'rgba(217, 71, 1, 0.8)';

    // Style par défaut
    return new ol.style.Style({
        fill: new ol.style.Fill({ color: color }),
        stroke: new ol.style.Stroke({
            color: 'white',
            width: 1
        })
    });
};

// Style de surbrillance (Highlight) lors du survol
const highlightStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#333',
        width: 3
    }),
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
    }),
    zIndex: 100 // S'assurer qu'il passe au-dessus
});

const regionsLayer = new ol.layer.Vector({
    source: regionsSource,
    style: styleRegions,
    properties: { name: 'regions' } // Identifiant interne utile
});

// 3. GESTION DES CHEF-LIEUX (Vecteur + Labels)
const villesData = [
    { nom: "Lyon", region: "Auvergne-Rhône-Alpes", lat: 45.763420, lon: 4.834277 },
    { nom: "Dijon", region: "Bourgogne-Franche-Comté", lat: 47.316666, lon: 5.016667 },
    { nom: "Rennes", region: "Bretagne", lat: 48.114700, lon: -1.679400 },
    { nom: "Orléans", region: "Centre-Val de Loire", lat: 47.902500, lon: 1.909000 },
    { nom: "Ajaccio", "region": "Corse", lat: 41.926701, lon: 8.736900 },
    { nom: "Strasbourg", region: "Grand Est", lat: 48.580002, lon: 7.750000 },
    { nom: "Lille", region: "Hauts-de-France", lat: 50.629250, lon: 3.057256 },
    { nom: "Paris", region: "Île-de-France", lat: 48.8537648, lon: 2.352356 },
    { nom: "Rouen", region: "Normandie", lat: 49.439999, lon: 1.100000 },
    { nom: "Bordeaux", region: "Nouvelle-Aquitaine", lat: 44.836151, lon: -0.580816 },
    { nom: "Toulouse", region: "Occitanie", lat: 43.604500, lon: 1.444000 },
    { nom: "Nantes", region: "Pays de la Loire", lat: 47.218102, lon: -1.552800 },
    { nom: "Marseille", region: "Provence-Alpes-Côte d'Azur", lat: 43.296398, lon: 5.370000 }
];

const chefLieuxFeatures = villesData.map(city => {
    const feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([city.lon, city.lat])),
        nom: city.nom,
        region: city.region
    });
    return feature;
});

const chefLieuxLayer = new ol.layer.Vector({
    source: new ol.source.Vector({ features: chefLieuxFeatures }),
    style: function(feature) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: '#333' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
            }),
            text: new ol.style.Text({
                text: feature.get('nom'),
                offsetY: -15,
                font: 'bold 12px Calibri,sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 3 }),
                overflow: true // Affiche le texte même si collision partielle
            })
        });
    }
});

// 4. INITIALISATION DE LA CARTE
const map = new ol.Map({
    target: "map",
    layers: [basemapLayer, regionsLayer, chefLieuxLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat([2.5, 46.5]), // Centré globalement
        zoom: 5.5
    }),
    controls: ol.control.defaults().extend([
        new ol.control.FullScreen(),
        new ol.control.ScaleLine(),
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: "EPSG:4326",
            target: document.getElementById("mouse-position"),
            className: "custom-mouse-position"
        })
    ])
});

// 5. GESTION DU POPUP (OVERLAY)
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: { duration: 250 }
});
map.addOverlay(overlay);

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

// 6. INTERACTIONS AVANCEES

// A. Interaction de Survol (Hover)
let highlightedFeature = null;

map.on('pointermove', function(e) {
    if (e.dragging) return;

    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);

    // Changement de curseur
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';

    // Gestion du highlight
    const feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        if (feature.getGeometry().getType() === 'Polygon' || feature.getGeometry().getType() === 'MultiPolygon') {
            return feature;
        }
    });

    if (feature !== highlightedFeature) {
        if (highlightedFeature) {
            highlightedFeature.setStyle(undefined); // Retour au style par défaut
        }
        if (feature) {
            feature.setStyle(highlightStyle);
        }
        highlightedFeature = feature;
    }
});

// B. Interaction de Clic (Sélection + Animation + Calculs)
map.on('singleclick', function(evt) {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
    });

    if (feature) {
        const geometry = feature.getGeometry();
        const type = geometry.getType();

        if (type === 'Polygon' || type === 'MultiPolygon') {
            // C'est une région
            const nom = feature.get('nom');
            const population = feature.get('population');
            
            // ol.sphere.getArea calcule la surface sur la sphère (plus précis que la géométrie plane projetée)
            const areaSqMeters = ol.sphere.getArea(geometry);
            const areaSqKm = (areaSqMeters / 1000000).toFixed(0);
            
            // Calcul de densité
            const density = (population / (areaSqMeters / 1000000)).toFixed(1);

            // Construction du contenu HTML
            content.innerHTML = `
                <h5 class="text-primary border-bottom pb-2">${nom}</h5>
                <ul class="list-unstyled">
                    <li><strong>Population :</strong> ${population.toLocaleString()} hab.</li>
                    <li><strong>Superficie :</strong> ${parseInt(areaSqKm).toLocaleString()} km²</li>
                    <li><strong>Densité :</strong> ${density} hab/km²</li>
                </ul>
                <small class="text-muted font-italic">Surface calculée via Geodesic Sphere (WGS84)</small>
            `;
            overlay.setPosition(evt.coordinate);

            // Animation "FlyTo" pour zoomer sur la région
            const view = map.getView();
            view.fit(geometry, {
                padding: [100, 100, 100, 100],
                duration: 1000, // 1 seconde
                maxZoom: 8
            });

        } else if (type === 'Point') {
            // C'est un chef-lieu
             content.innerHTML = `
                <h6 class="text-danger">📍 Chef-Lieu</h6>
                <p><strong>${feature.get('nom')}</strong><br>
                Région : ${feature.get('region')}</p>
            `;
            overlay.setPosition(evt.coordinate);
            
            // Petit effet de déplacement fluide vers le point
            map.getView().animate({
                center: geometry.getCoordinates(),
                zoom: 9,
                duration: 800
            });
        }
    } else {
        overlay.setPosition(undefined); // Ferme le popup si on clique dans le vide
    }
});

// 7. CONTROLE DES COUCHES et LEGENDE DYNAMIQUE
// Gestion de la visibilité des couches via les checkboxes
document.getElementById('regions-france').addEventListener('change', function() {
    regionsLayer.setVisible(this.checked);
});
document.getElementById('chef-lieux').addEventListener('change', function() {
    chefLieuxLayer.setVisible(this.checked);
});

const legendPanel = document.getElementById('legend-panel');

document.getElementById('regions-france').addEventListener('change', function() {
    // 1. Visibilité de la couche
    regionsLayer.setVisible(this.checked);
    // 2. Affichage de la légende
    if (this.checked) {
        legendPanel.style.display = 'block';
    } else {
        legendPanel.style.display = 'none';
    }
});

document.getElementById('chef-lieux').addEventListener('change', function() {
    chefLieuxLayer.setVisible(this.checked);
});

// console.log(regions);

// console.log(map);

// console.log(regionsFrance);

// console.log(styleRegions);

// console.log(ChefLieu);

// console.log(villesChefLieu);

// console.log(chefLieuxFeatures);

// console.log(chefLieuxLayer);

// console.log(getDescription);