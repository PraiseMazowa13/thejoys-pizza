// ---- Données des produits ----
const products = [
    { id: 1, name: 'Chawarma', price: 5000, img: '../img/chaw.jpg' },
    { id: 2, name: 'Chawarma Royal', price: 6500, img: '../img/chawarma.jpg' },
    { id: 3, name: 'Frites Poulet', price: 7000, img: '../img/fritte.jpg' },
    { id: 4, name: 'Makemba', price: 3000, img: '../img/frittepoulet.jpg' },
    { id: 5, name: 'Pizza Margherita', price: 12000, img: '../img/chawarma.jpg' },
    { id: 6, name: 'Pizza 4 Fromages', price: 15000, img: '../img/pizz(1).jpg' },
    { id: 7, name: 'Pizza Pepperoni', price: 13500, img: '../img/pizz(1).jpg' },
    { id: 8, name: 'Poulet Kwango', price: 8500, img: '../img/pizz(1).jpg' },
    { id: 9, name: 'Poulet Makemba', price: 9000, img: '../img/pizz(1).jpg' },
    { id: 10, name: 'Samoussas', price: 2500, img: '../img/pizz(1).jpg' },
    { id: 11, name: 'Samoussas Boeuf', price: 3000, img: '../img/pizz(1).jpg' },
    { id: 12, name: 'Samoussas Poulet', price: 3000, img: '../img/pizz(1).jpg' },
    { id: 13, name: 'Samoussas', price: 3000, img: '../img/pizz (3).jpg' },
    { id: 13, name: 'Samoussas', price: 3000, img: '../img/fritte.jpg' },
    { id: 14, name: 'Samoussas Poulet', price: 3000, img: '../img/pizz(1).jpg' }
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
                    <img src="${product.img}" alt="${product.name}">
                    <span class="product-name">${product.name}</span>
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
                    <img src="${product.img}" alt="${product.name}">
                    <span class="product-name">${product.name}</span>
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
                
                <div class="groupe-champ">
                    <label for="heure">Heure de livraison souhaitée</label>
                    <select id="heure" name="heure">
                        <option value="Des que possible">Dès que possible</option>
                        <option value="Dans 1 heure">Dans 1 heure</option>
                        <option value="Dans 1h30">Dans 1 heure 30</option>
                        <option value="Dans 2 heures">Dans 2 heures</option>
                    </select>
                </div>
                
                <div class="groupe-champ">
                    <label for="instructions">Instructions supplémentaires</label>
                    <textarea id="instructions" name="instructions" placeholder="Ex: Sonner à l'interphone, préciser le code..." rows="2"></textarea>
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
    const heure = document.getElementById('heure').value;
    const instructions = document.getElementById('instructions').value.trim();
    
    // Valider les champs requis add !telephone ||
    if (!nom ||!adresse) {
        afficherNotification('Veuillez remplir tous les champs obligatoires', 'info');
        return;
    }
        
    // Construire le message pour WhatsApp
    let message = "🛵 *NOUVELLE COMMANDE THE JOY'S PIZZA* 🍕\n\n";
    message += `👤 *Client :* ${nom}\n`;
    message += `📍 *Adresse :* ${adresse}\n`;
    message += `⏰ *Livraison :* ${heure}\n`;
    
    if (instructions) {
        message += `📝 *Instructions :* ${instructions}\n`;
    }
    
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

// Rendre les fonctions disponibles globalement
window.fermerModalCommande = fermerModalCommande;
window.envoyerCommandeWhatsApp = envoyerCommandeWhatsApp;

// Rendre les fonctions disponibles globalement
window.addToCart = addToCart;
window.modifierQuantite = modifierQuantite;
window.supprimerProduit = supprimerProduit;
window.commander = commander;