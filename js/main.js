// ---- Données des produits ----

const products = [
    { id: 1, name: 'Chawarma poulet', price: 6000, img: 'img/chaw.jpg', description: 'Délicieux chawarma au poulet frit.', category: 'Chawarma' },
    { id: 2, name: 'Chawarma viande', price: 8000, img: 'img/chawarma.jpg', description: 'Chawarma à la viande tendre, épices maison .', category: 'Chawarma' },
    { id: 3, name: 'Frites mayo', price: 4000, img: 'img/fritte.jpg', description: 'Frites croustillantes maison, servies avec mayonnaise.', category: 'Frites' },
    { id: 4, name: 'cuisse fritte', price: 7000, img: 'img/frittepoulet.jpg', description: 'Cuisse de poulet grillée + frites maison.', category: 'Poulet' },
    { id: 5, name: 'makemba+mayo', price: 4500, img: 'img/makemba.jpg', description: 'Makemba (plantain frit) accompagné de mayonnaise et de ketchup.', category: 'Plantain' },
    { id: 6, name: 'Pizza viande', price: 23000, img: 'img/p_alaviande.jpg', description: 'Pizza garnie de viande hachée, fromage, poivrons et olives.', category: 'Pizza' },
    { id: 7, name: 'Pizza saucissons', price: 15000, img: 'img/p_saucissons.jpg', description: 'Pizza aux saucissons italiens, mozzarella et sauce tomate.', category: 'Pizza' },
    { id: 8, name: 'Pizza poulet', price: 18500, img: 'img/p_poulet.jpg', description: 'Pizza au poulet mariné, champignons et fromage.', category: 'Pizza' },
    { id: 9, name: 'cuisse Makemba', price: 7500, img: 'img/pouletmakemba.jpg', description: 'Cuisse de poulet + makemba (plantain frit).', category: 'Poulet' },
    { id: 10, name: 'cuisse chikwangue', price: 6000, img: 'img/pouletkwanga.jpg', description: '2 cuisses de poulet + chikwangue (manioc).', category: 'Poulet' },
    { id: 11, name: 'Samoussas Poulet', price: 5500, img: 'img/samoussa_poulet.jpg', description: '8 samoussas au poulet, croustillants et épicés.', category: 'Samoussas' },
    { id: 12, name: 'Samoussas viande ', price: 6000, img: 'img/samoussa_viande.jpg', description: '8 samoussas à la viande hachée.', category: 'Samoussas' },
];

// ===== GESTION DU PANIER (LOCALSTORAGE) =====
let panier = [];

// Charger le panier depuis localStorage au démarrage
function chargerPanier() {
    try {
        const panierStocke = localStorage.getItem('panier');
        if (panierStocke) {
            panier = JSON.parse(panierStocke);
        } else {
            panier = [];
        }
        // Mettre à jour l'affichage du badge sur TOUTES les pages
        mettreAJourTousLesBadges();
    } catch (e) {
        console.error("Erreur chargement panier:", e);
        panier = [];
    }
}

// Sauvegarder le panier dans localStorage
function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
    // Mettre à jour tous les badges après sauvegarde
    mettreAJourTousLesBadges();
}

// ===== FONCTIONS DU PANIER =====
function addToCart(id) {
    const produit = products.find(p => p.id === id);
    if (!produit) return;
    
    const existant = panier.find(p => p.id === id);
    
    if (existant) {
        existant.quantite++;
        afficherNotification(`+1 ${produit.name}`, 'success');
    } else {
        panier.push({...produit, quantite: 1});
        afficherNotification(`${produit.name} ajouté au panier`, 'success');
    }
    
    sauvegarderPanier();
    
    // Mettre à jour l'affichage si on est sur la page panier
    if (document.getElementById('cart-items')) {
        mettreAJourPanier();
    }
}

function modifierQuantite(id, changement) {
    const item = panier.find(p => p.id === id);
    if (!item) return;
    
    if (changement > 0) {
        item.quantite++;
    } else {
        if (item.quantite > 1) {
            item.quantite--;
        } else {
            supprimerProduit(id);
            return;
        }
    }
    
    sauvegarderPanier();
    mettreAJourPanier();
}

function supprimerProduit(id) {
    panier = panier.filter(p => p.id !== id);
    afficherNotification('Produit retiré du panier', 'info');
    sauvegarderPanier();
    mettreAJourPanier();
}

function mettreAJourTousLesBadges() {
    // Cette fonction met à jour tous les badges du panier sur la page
    const totalItems = panier.reduce((sum, item) => sum + item.quantite, 0);
    const badges = document.querySelectorAll('.cart-badge');
    
    badges.forEach(badge => {
        if (badge) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
            badge.style.backgroundColor = '#770808';
            badge.style.color = 'white';
            badge.style.borderRadius = '50%';
            badge.style.padding = '2px 8px';
            badge.style.fontSize = '12px';
            badge.style.marginLeft = '5px';
        }
    });
}

function mettreAJourPanier() {
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartItems) return;
    
    if (panier.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Votre panier est vide</p><a href="catalogue.html" class="continue-shopping">← Découvrir nos produits</a></div>';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (cartSummary) cartSummary.style.display = 'block';
    cartItems.innerHTML = '';
    
    let sousTotal = 0;
    panier.forEach(item => {
        sousTotal += item.price * item.quantite;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <div class="item-price">${item.price.toLocaleString()} FC</div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="modifierQuantite(${item.id}, -1)">-</button>
                    <span>${item.quantite}</span>
                    <button class="qty-btn" onclick="modifierQuantite(${item.id}, 1)">+</button>
                </div>
                <div class="item-total">Total: ${(item.price * item.quantite).toLocaleString()} FC</div>
            </div>
            <button class="remove-item" onclick="supprimerProduit(${item.id})">🗑️</button>
        `;
        cartItems.appendChild(div);
    });
    
    const subtotalSpan = document.getElementById('subtotal');
    const totalSpan = document.getElementById('total');
    
    if (subtotalSpan) subtotalSpan.innerHTML = sousTotal.toLocaleString() + ' FC';
    if (totalSpan) totalSpan.innerHTML = (sousTotal + 2500).toLocaleString() + ' FC';
}

// ===== NOTIFICATION UNIFORME AVEC LE DESIGN =====
function afficherNotification(message, type = 'success') {
    // Supprimer les anciennes notifications
    const anciennesNotes = document.querySelectorAll('.notification-personnalisee');
    anciennesNotes.forEach(n => n.remove());
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = 'notification-personnalisee';
    notification.textContent = message;
    
    // Styles en ligne pour correspondre au design
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#770808';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 4px 15px rgba(119, 8, 8, 0.3)';
    notification.style.zIndex = '10000';
    notification.style.fontFamily = 'Georgia, Times New Roman, serif';
    notification.style.fontSize = '16px';
    notification.style.fontWeight = 'bold';
    notification.style.borderLeft = '5px solid #f3f3f3';
    notification.style.animation = 'glissement 0.3s ease';
    
    // Ajouter une icône selon le type
    const icone = document.createElement('span');
    icone.style.marginRight = '10px';
    icone.style.fontSize = '18px';
    
    if (type === 'success') {
        icone.innerHTML = '✓';
    } else if (type === 'info') {
        icone.innerHTML = 'ℹ';
    }
    
    notification.prepend(icone);
    
    document.body.appendChild(notification);
    
    // Animation de disparition
    setTimeout(() => {
        notification.style.animation = 'glissementSortie 0.3s ease';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Ajouter les animations dans le head si elles n'existent pas
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes glissement {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes glissementSortie {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

function commander() {
    if (panier.length === 0) {
        afficherNotification('Votre panier est vide', 'info');
        return;
    }
    
    afficherNotification('✅ Merci pour votre commande !', 'success');
    panier = [];
    sauvegarderPanier();
    mettreAJourPanier();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// ===== FONCTION D'AFFICHAGE DES PRODUITS =====
// function displayProducts(contenairId) {
//     try {
//         const container = document.getElementById(contenairId);
//         if (!container) return;
        
//         container.innerHTML = '';

//         if(contenairId === 'menu-catalogue') {
//             products.forEach(product => {
//                 const productDiv = document.createElement('div');
//                 productDiv.className = 'img';
//                 productDiv.innerHTML = `
//                     <img src="${product.img}" alt="${product.name}">
//                     <span class="product-name">${product.name}</span>
//                     <span class="product-price">${product.price.toLocaleString()} FC</span>
//                     <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
//                 `;
//                 container.appendChild(productDiv);
//             });
//         }
//         else if(contenairId === 'menu-container') {
//             const shuffled = [...products].sort(() => 0.5 - Math.random());
//             const selectedProducts = shuffled.slice(0, 3);
            
//             selectedProducts.forEach(product => {
//                 const productDiv = document.createElement('div');
//                 productDiv.className = 'img';
//                 productDiv.innerHTML = `
//                     <img src="${product.img}" alt="${product.name}">
//                     <span class="product-name">${product.name}</span>
//                     <span class="product-price">${product.price.toLocaleString()} FC</span>
//                     <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
//                 `;
//                 container.appendChild(productDiv);
//             });
//         }
//     } catch (error) {
//         console.error('Erreur displayProducts:', error);
//     }
// }
function displayProducts(contenairId) {
    try {
        const container = document.getElementById(contenairId);
        if (!container) return;
        
        container.innerHTML = '';

        if(contenairId === 'menu-catalogue') {
            
            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'img';
                productDiv.innerHTML = `
                    <img src="${product.img}" alt="${product.name}" onclick="ouvrirModalProduit(${product.id})" style="cursor: pointer;">
                    <span class="product-name" onclick="ouvrirModalProduit(${product.id})" style="cursor: pointer;">${product.name}</span>
                    <span class="product-price">${product.price.toLocaleString()} FC</span>
                    <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
                `;
                container.appendChild(productDiv);
            });
        }
        else if(contenairId === 'menu-container') {
            const shuffled = [...products].sort(() => 0.5 - Math.random());
            const selectedProducts = shuffled.slice(0, 3);
            
            selectedProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'img';
                productDiv.innerHTML = `
                    <img src="${product.img}" alt="${product.name}" onclick="ouvrirModalProduit(${product.id})" style="cursor: pointer;">
                    <span class="product-name" onclick="ouvrirModalProduit(${product.id})" style="cursor: pointer;">${product.name}</span>
                    <span class="product-price">${product.price.toLocaleString()} FC</span>
                    <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
                `;
                container.appendChild(productDiv);
            });
        }
    } catch (error) {
        console.error('Erreur displayProducts:', error);
    }
}
// ===== MODAL PRODUIT =====
let currentProduct = null;

function ouvrirModalProduit(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    // Créer ou récupérer le modal
    let modal = document.getElementById('product-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'product-modal';
        modal.className = 'product-modal';
        document.body.appendChild(modal);
    }
    
    // Remplir le modal
    modal.innerHTML = `
        <div class="close-top" onclick="fermerModalProduit()">&times;</div>
        <div class="modal-content">
            <img src="${product.img}" alt="${product.name}" class="modal-img">
            <div class="modal-body">
                <span class="modal-category">${product.category || 'Spécialité'}</span>
                <h2>${product.name}</h2>
                <div class="modal-price">${product.price.toLocaleString()} FC</div>
                <div class="modal-description">${product.description || 'Découvrez notre spécialité maison, préparée avec des ingrédients frais et beaucoup d\'amour.'}</div>
                <div class="modal-actions">
                    <button class="modal-close-btn" onclick="fermerModalProduit()">Fermer</button>
                    <button class="modal-add-btn" onclick="ajouterDepuisModal()">🛒 Ajouter au panier</button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function fermerModalProduit() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentProduct = null;
}

function ajouterDepuisModal() {
    if (currentProduct) {
        addToCart(currentProduct.id);
        fermerModalProduit();
    }
}



// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Charger le panier
    chargerPanier();
    
    // Initialiser l'affichage des produits selon la page
    const path = window.location.pathname;
    
    if (path.includes('catalogue.html')) {
        displayProducts('menu-catalogue');
    } else if (path.includes('panier.html')) {
        setTimeout(function() {
            const loadingPage = document.getElementById('loadingPage');
            const cartSection = document.getElementById('cart-section');
            
            if (loadingPage) loadingPage.style.display = 'none';
            if (cartSection) cartSection.style.display = 'block';
            
            // Mettre à jour l'affichage du panier
            mettreAJourPanier();
        }, 1000);
    } else if (path.includes('index.html') || path.endsWith('/')) {
        displayProducts('menu-container');
    }
    
    // Gestionnaire pour les clics sur "Ajouter au panier"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
            
            e.target.style.transform = 'scale(0.95)';
            e.target.style.backgroundColor = '#a30808';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = 'rgba(139, 6, 6, 0.904)';
            }, 200);
        }
    });
});
function commander() {
    if (panier.length === 0) {
        afficherNotification('Votre panier est vide', 'info');
        return;
    }
    
    // Afficher le formulaire de livraison
    afficherFormulaireLivraison();
}

function afficherFormulaireLivraison() {
    // Vérifier si le modal existe déjà
    let modal = document.getElementById('modal-commande');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-commande';
        modal.className = 'modal-commande';
        document.body.appendChild(modal);
    }
    
    // Calculer le total
    const sousTotal = panier.reduce((sum, item) => sum + (item.price * item.quantite), 0);
    const total = sousTotal + 2500;
    
    // Générer le résumé des articles
    const articlesHTML = panier.map(item => `
        <div class="article-resume">
            <span class="nom">${item.quantite}x ${item.name}</span>
            <span class="prix">${(item.price * item.quantite).toLocaleString()} FC</span>
        </div>
    `).join('');
    
    // Contenu du modal
    modal.innerHTML = `
        <div class="modal-contenu">
            <h2>🛵 Finaliser la commande</h2>
            
            <form id="form-livraison" onsubmit="event.preventDefault(); envoyerCommandeWhatsApp();">
                <div class="groupe-champ">
                    <label for="nom">Nom complet *</label>
                    <input type="text" id="nom" name="nom" required placeholder="Votre nom">
                </div>
                
                <!-- <div class="groupe-champ">
                    <label for="telephone">Téléphone *</label>
                    <input type="tel" id="telephone" name="telephone" required placeholder="Votre numéro" value="+243">
                </div> -->
                
                <div class="groupe-champ">
                    <label for="adresse">Adresse de livraison *</label>
                    <textarea id="adresse" name="adresse" required placeholder="Commune, Quartier, Avenue, Numéro" rows="3"></textarea>
                </div>
                
                <h3>Récapitulatif de votre commande</h3>
                <div class="resume-commande-modal">
                    ${articlesHTML}
                </div>
                
                <div class="total-modal">
                    <span>Total à payer</span>
                    <span>${total.toLocaleString()} FC</span>
                </div>
                
                <div class="infos-livraison">
                    <strong>🚚 Frais de livraison :</strong> 2 500 FC inclus<br>
                    <strong>💳 Paiement :</strong> À la livraison
                </div>
                
                <div class="actions-modal">
                    <button type="button" class="btn-annuler" onclick="fermerModalCommande()">Annuler</button>
                    <button type="submit" class="btn-confirmer">📱 Confirmer sur WhatsApp</button>
                </div>
            </form>
        </div>
    `;
    
    // Afficher le modal
    modal.style.display = 'flex';
    
    // Ajouter la validation en temps réel
    const inputs = modal.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('error');
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
}

function fermerModalCommande() {
    const modal = document.getElementById('modal-commande');
    if (modal) {
        modal.style.display = 'none';
    }
}

function envoyerCommandeWhatsApp() {
    // Récupérer les valeurs du formulaire
    const nom = document.getElementById('nom').value.trim();
    // const telephone = document.getElementById('telephone').value.trim();
    const adresse = document.getElementById('adresse').value.trim();
   
    // Valider les champs requis add !telephone ||
    if (!nom ||!adresse) {
        afficherNotification('Veuillez remplir tous les champs obligatoires', 'info');
        return;
    }
        
    // Construire le message pour WhatsApp
    let message = "🛵 *NOUVELLE COMMANDE THE JOY'S PIZZA* 🍕\n\n";
    message += `👤 *Client :* ${nom}\n`;
    message += `📍 *Adresse :* ${adresse}\n`;

    
    message += `\n🍽️ *ARTICLES COMMANDÉS :*\n`;
    message += `─────────────────\n`;
    
    let sousTotal = 0;
    panier.forEach(item => {
        const totalArticle = item.price * item.quantite;
        sousTotal += totalArticle;
        message += `${item.quantite}x ${item.name} - ${totalArticle.toLocaleString()} FC\n`;
    });
    
    message += `─────────────────\n`;
    message += `📦 *Sous-total :* ${sousTotal.toLocaleString()} FC\n`;
    message += `🚚 *Livraison :* 2 500 FC\n`;
    message += `💰 *TOTAL :* ${(sousTotal + 2500).toLocaleString()} FC\n\n`;
    
    message += `💳 *Mode de paiement :* Espèces à la livraison\n\n`;
    message += `⏱️ *Commande passée le :* ${new Date().toLocaleString('fr-FR')}\n\n`;
    message += `Merci de votre confiance ! 🙏`;
    
    // Encoder le message pour URL
    const messageEncode = encodeURIComponent(message);
    
    // Numéro WhatsApp (format international sans +)
    const numeroWhatsApp = "243975018199";
    
    // Créer le lien WhatsApp
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${messageEncode}`;
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(urlWhatsApp, '_blank');
    
    // Afficher un message de confirmation
    afficherNotification('✅ Redirection vers WhatsApp...', 'success');
    
    // Fermer le modal
    fermerModalCommande();
    
    // Vider le panier après envoi
    panier = [];
    sauvegarderPanier();
    mettreAJourPanier();
    mettreAJourTousLesBadges();
    
    // Afficher un message
    setTimeout(() => {
        afficherNotification('🎉 Commande envoyée ! Vous allez être redirigé vers WhatsApp', 'success');
    }, 1000);
}


// Rendre disponibles globalement
window.ouvrirModalProduit = ouvrirModalProduit;
window.fermerModalProduit = fermerModalProduit;
window.ajouterDepuisModal = ajouterDepuisModal;

// Rendre les fonctions disponibles globalement
window.fermerModalCommande = fermerModalCommande;
window.envoyerCommandeWhatsApp = envoyerCommandeWhatsApp;

// Rendre les fonctions disponibles globalement
window.addToCart = addToCart;
window.modifierQuantite = modifierQuantite;
window.supprimerProduit = supprimerProduit;
window.commander = commander;
