
// ===== GESTION COMPLÈTE DES AVIS AVEC NOMS CONGOLAIS =====
let avisData = {
    avis: []
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    chargerAvis();
    afficherAvis();
    mettreAJourStatistiques();
    initEtoiles();
    mettreAJourCompteurPanier();
});

// ===== CHARGER LES AVIS DEPUIS LOCALSTORAGE =====
function chargerAvis() {
    const avisStockes = localStorage.getItem('theJoyPizzaAvis');
    
    if (avisStockes) {
        try {
            avisData = JSON.parse(avisStockes);
        } catch (e) {
            console.error('Erreur de chargement des avis', e);
            initialiserAvisParDefaut();
        }
    } else {
        initialiserAvisParDefaut();
    }
}

// ===== AVIS PAR DÉFAUT AVEC NOMS CONGOLAIS =====
function initialiserAvisParDefaut() {
    avisData = {
        avis: [
            {
                id: 1,
                nom: "Jean-Pierre Kalombo",
                date: "2024-02-20",
                note: 5,
                commentaire: "Ba pizza oyo ezali vraiment malamu ! Nalingi yango mingi. Ba ingrédients ezali frais, livraison ekima mbangu."
            },
            {
                id: 2,
                nom: "Marie-Thérèse Mbayo",
                date: "2024-02-18",
                note: 5,
                commentaire: "Chawarma na bango ezali bomba ! Miso ekoyoka masiya. Nakotinda ba camarades na ngai koya."
            },
            {
                id: 3,
                nom: "Alphonse Luntadila",
                date: "2024-02-15",
                note: 4,
                commentaire: "Mboté, nazali client régulier. Ba frites na bango ezali croquant, kasi bakoki kobakisa mwa mayones."
            },
            {
                id: 4,
                nom: "Béatrice Ntumba",
                date: "2024-02-12",
                note: 5,
                commentaire: "Nzambe akopambola bango ! Pona Noël, natindaki ba commande mingi, famille na ngai esepelaki mingi."
            },
            {
                id: 5,
                nom: "Joseph Kasongo",
                date: "2024-02-10",
                note: 5,
                commentaire: "Ba pizza ya Limete oyo eleki sukali ! Service client ezali malamu, bakoyamba yo malamu."
            },
            {
                id: 6,
                nom: "Joséphine Mputu",
                date: "2024-02-08",
                note: 4,
                commentaire: "Makemba na bango ezali ndenge nalingi. Kasi bazali ntango mosusu kowumela na livraison."
            },
            {
                id: 7,
                nom: "Marcel Tshibangu",
                date: "2024-02-05",
                note: 5,
                commentaire: "Ya solo, The Joy's Pizza eza numéro 1 na Kinshasa ! Ba quantités ezali généreuses."
            },
            {
                id: 8,
                nom: "Odette Mbuyi",
                date: "2024-02-03",
                note: 5,
                commentaire: "Ba frites poulet na bango ekoki kokamata moto. Bana na ngai balingi yango mingi."
            },
            {
                id: 9,
                nom: "André Kabongo",
                date: "2024-01-28",
                note: 5,
                commentaire: "Chaque vendredi soir, nakosala commande. Ba prix ezali abordable mpe makanisi malamu."
            },
            {
                id: 10,
                nom: "Céline Lunkamba",
                date: "2024-01-25",
                note: 4,
                commentaire: "Ba samoussas na bango ezali nzoto mokongo. Napesi conseil na baninga."
            },
            {
                id: 11,
                nom: "Félix-À-Dieu Mpiana",
                date: "2024-01-22",
                note: 5,
                commentaire: "Ba pizza ya quatre fromages oyo eleki kitoko na Kinshasa. Mapamboli !"
            },
            {
                id: 12,
                nom: "Antoinette Kapinga",
                date: "2024-01-20",
                note: 5,
                commentaire: "Nasepelaki mingi na commande na ngai. Ba ingredients ezali frais, bokaboli yango malamu."
            }
        ]
    };
    sauvegarderAvis();
}

// ===== SAUVEGARDER DANS LOCALSTORAGE =====
function sauvegarderAvis() {
    localStorage.setItem('theJoyPizzaAvis', JSON.stringify(avisData));
}

// ===== AFFICHER LES AVIS =====
function afficherAvis() {
    const container = document.getElementById('reviewsList');
    
    // Simuler un chargement
    setTimeout(() => {
        if (!avisData.avis || avisData.avis.length === 0) {
            container.innerHTML = `
                <div class="no-reviews">
                    <i class="far fa-smile"></i>
                    <p>Avis moko te. <br> Yoya kopesa opinion na yo !</p>
                </div>
            `;
            return;
        }

        // Trier du plus récent au plus ancien
        const avisTries = [...avisData.avis].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        container.innerHTML = '';

        avisTries.forEach(avis => {
            // Formater la date
            const dateObj = new Date(avis.date);
            const dateFormatee = dateObj.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Générer les étoiles
            let etoiles = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= avis.note) {
                    etoiles += '<i class="fas fa-star"></i>';
                } else {
                    etoiles += '<i class="far fa-star"></i>';
                }
            }

            // Obtenir les initiales pour l'avatar
            const initiales = avis.nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${initiales}</div>
                        <span class="reviewer-name">${avis.nom}</span>
                    </div>
                    <span class="review-date"><i class="far fa-calendar-alt"></i> ${dateFormatee}</span>
                </div>
                <div class="review-stars">${etoiles}</div>
                <p class="review-comment">"${avis.commentaire}"</p>
                <div class="review-footer">
                    <span class="verified-badge">
                        <i class="fas fa-check-circle"></i> Avis vérifié
                    </span>
                    <span>
                        <i class="far fa-thumbs-up"></i> Utile
                    </span>
                </div>
            `;
            container.appendChild(card);
        });
    }, 500);
}

// ===== METTRE À JOUR LES STATISTIQUES =====
function mettreAJourStatistiques() {
    const total = avisData.avis.length;
    
    if (total === 0) {
        document.getElementById('avgRating').textContent = '0.0';
        document.getElementById('totalReviews').textContent = '0 avis';
        
        const starsContainer = document.getElementById('avgStars');
        starsContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsContainer.innerHTML += '<i class="far fa-star"></i>';
        }
        return;
    }

    const somme = avisData.avis.reduce((acc, avis) => acc + avis.note, 0);
    const moyenne = (somme / total).toFixed(1);
    
    document.getElementById('avgRating').textContent = moyenne;
    document.getElementById('totalReviews').textContent = 
        `${total} avis`;

    // Mettre à jour les étoiles de la moyenne
    const starsContainer = document.getElementById('avgStars');
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(moyenne)) {
            starsContainer.innerHTML += '<i class="fas fa-star"></i>';
        } else {
            starsContainer.innerHTML += '<i class="far fa-star"></i>';
        }
    }
}

// ===== INITIALISATION DES ÉTOILES =====
let currentRating = 0;

function initEtoiles() {
    const stars = document.querySelectorAll('.stars-input i');
    
    stars.forEach(star => {
        // Survol
        star.addEventListener('mouseenter', function() {
            const rating = this.dataset.rating;
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });

        // Fin du survol
        star.addEventListener('mouseleave', function() {
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });

        // Clic
        star.addEventListener('click', function() {
            currentRating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
            
            const selectedDiv = document.getElementById('selectedRating');
            if (currentRating === 1) selectedDiv.textContent = '⭐ Mabe mingi';
            else if (currentRating === 2) selectedDiv.textContent = '⭐⭐ Ebele mabe';
            else if (currentRating === 3) selectedDiv.textContent = '⭐⭐⭐ Eza malamu';
            else if (currentRating === 4) selectedDiv.textContent = '⭐⭐⭐⭐ Eza kitoko';
            else if (currentRating === 5) selectedDiv.textContent = '⭐⭐⭐⭐⭐ Ya koleka !';
        });
    });
}

// ===== AJOUTER UN AVIS =====
function ajouterAvis() {
    const nom = document.getElementById('nom').value.trim();
    const commentaire = document.getElementById('commentaire').value.trim();

    // Vérifications
    if (!nom) {
        afficherNotificationV2('Saisissez votre nom', 'error');
        return;
    }

    if (!commentaire) {
        afficherNotificationV2('Saisissez votre nom', 'error');
        return;
    }

    if (commentaire.length < 5) {
        afficherNotificationV2('Likanisi ezali mokuse mingi', 'error');
        return;
    }

    if (currentRating === 0) {
        afficherNotificationV2('Pesa note na biso', 'error');
        return;
    }

    // Créer le nouvel avis
    const nouvelAvis = {
        id: Date.now(),
        nom: nom,
        date: new Date().toISOString().split('T')[0],
        note: currentRating,
        commentaire: commentaire
    };

    // Ajouter au tableau
    avisData.avis.push(nouvelAvis);

    // Sauvegarder dans localStorage
    sauvegarderAvis();

    // Mettre à jour l'affichage
    afficherAvis();
    mettreAJourStatistiques();

    // Notification de succès
    afficherNotificationV2('Matondo mingi mpo na avis na yo ! 🍕', 'success');

    // Réinitialiser le formulaire
    document.getElementById('nom').value = '';
    document.getElementById('commentaire').value = '';
    currentRating = 0;
    document.getElementById('selectedRating').textContent = '';
    
    // Réinitialiser les étoiles
    document.querySelectorAll('.stars-input i').forEach(s => {
        s.className = 'far fa-star';
    });
}

// ===== NOTIFICATION PERSONNALISÉE =====
function afficherNotificationV2(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification-avis';
    
    const icone = document.createElement('i');
    icone.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    notification.appendChild(icone);
    notification.appendChild(document.createTextNode(' ' + message));
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== METTRE À JOUR LE COMPTEUR DU PANIER =====
function mettreAJourCompteurPanier() {
    try {
        const panier = JSON.parse(localStorage.getItem('panier') || '[]');
        const totalItems = panier.reduce((sum, item) => sum + (item.quantite || 0), 0);
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    } catch (e) {
        console.error('Erreur compteur panier', e);
    }
}

// Rendre les fonctions disponibles globalement
window.ajouterAvis = ajouterAvis;
