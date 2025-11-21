document.addEventListener('DOMContentLoaded', () => {

    const projectGrid = document.getElementById('project-grid');
    const filterButtonsContainer = document.getElementById('filter-buttons');
    let allProjectsData = [];

    // --- GESTION DES PROJETS ---

    async function fetchProjects() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            allProjectsData = await response.json();
            displayProjects(allProjectsData);
            setupFilters();
        } catch (error) {
            console.error('Impossible de charger les projets:', error);
            projectGrid.innerHTML = '<p class="text-danger text-center">Erreur lors du chargement des projets.</p>';
        }
    }

    function displayProjects(projects) {
        projectGrid.innerHTML = '';

        if (projects.length === 0) {
            projectGrid.innerHTML = '<p class="text-muted text-center">Aucun projet ne correspond à ce filtre.</p>';
            return;
        }

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'col-lg-4 col-md-6 project-card';
            projectCard.dataset.tags = JSON.stringify(project.tags);

            const tagsHtml = project.tags.map(tag => 
                `<span class="badge bg-secondary me-1">${tag}</span>`
            ).join(' ');

            // Détermine si le lien doit s'ouvrir dans un nouvel onglet
            // MODIFICATION ICI : On ajoute 'youtube' à la liste
            const linkTarget = (['pdf', 'github', 'youtube'].includes(project.lien.type)) ? 'target="_blank"' : '';

            // MODIFICATION ICI : L'image est maintenant cliquable
            // On enveloppe l'image <img> dans une balise <a> avec la classe "project-link"
            projectCard.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <a href="${project.lien.url}" ${linkTarget} class="project-link" title="Voir le détail du projet">
                        <img src="${project.image}" class="card-img-top" alt="${project.titre}">
                        <div class="hover-overlay">
                            <i class="fas fa-external-link-alt"></i>
                        </div>
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${project.titre}</h5>
                        <p class="card-text">${project.description}</p>
                        <div class="mb-2">
                            ${tagsHtml}
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="${project.lien.url}" ${linkTarget} class="btn btn-primary w-100">Voir le projet</a>
                    </div>
                </div>
            `;
            
            projectGrid.appendChild(projectCard);
        });
    }

    function setupFilters() {
        filterButtonsContainer.addEventListener('click', (event) => {
            const clickedButton = event.target;
            if (!clickedButton.classList.contains('filter-btn')) return;

            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('btn-primary', 'active');
                btn.classList.add('btn-outline-secondary');
            });
            
            clickedButton.classList.add('btn-primary', 'active');
            clickedButton.classList.remove('btn-outline-secondary');

            const filter = clickedButton.dataset.filter;
            filterProjects(filter);
        });
    }

    function filterProjects(filter) {
        const allCards = document.querySelectorAll('.project-card');
        allCards.forEach(card => {
            const cardTags = JSON.parse(card.dataset.tags);
            if (filter === 'all' || cardTags.includes(filter)) {
                card.classList.remove('hide');
            } else {
                card.classList.add('hide');
            }
        });
    }

    // --- BOUTON RETOUR EN HAUT & NAVBAR ---

    const backToTopButton = document.getElementById("btn-back-to-top");
    const navbar = document.querySelector(".navbar");

    window.onscroll = function () {
        scrollFunction();
    };

    function scrollFunction() {
        // Afficher/Masquer le bouton retour en haut
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopButton.style.display = "block";
            // Petit effet d'entrée
            setTimeout(() => { backToTopButton.style.opacity = "1"; }, 10);
        } else {
            backToTopButton.style.opacity = "0";
            setTimeout(() => { if(backToTopButton.style.opacity == "0") backToTopButton.style.display = "none"; }, 300);
        }

        // Effet d'ombre sur la navbar au scroll
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            navbar.classList.add("shadow-sm");
        } else {
            navbar.classList.remove("shadow-sm");
        }
    }

    // Action au clic sur le bouton
    if(backToTopButton) {
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Lancement
    fetchProjects();
});