// ===== GESTION DU PANIER =====
function ajouterAuPanier(id) {
    const produit = produits.find(p => p.id === id);
    const existant = panier.find(p => p.id === id);
    
    if (existant) {
        existant.quantite++;
        afficherMessage(`+1 ${produit.nom}`);
    } else {
        panier.push({...produit, quantite: 1});
        afficherMessage(`${produit.nom} ajouté au panier`);
    }
    
    mettreAJourPanier();
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
    mettreAJourPanier();
}

function supprimerProduit(id) {
    panier = panier.filter(p => p.id !== id);
    afficherMessage('Produit retiré du panier');
    mettreAJourPanier();
}

function mettreAJourPanier() {
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartCount = document.getElementById('cart-count');
    
    const totalItems = panier.reduce((sum, item) => sum + item.quantite, 0);
    cartCount.textContent = totalItems;
    
    if (panier.length === 0) {
        cartItems.innerHTML = '<p>Votre panier est vide</p>';
        cartSummary.style.display = 'none';
        return;
    }
    
    cartSummary.style.display = 'block';
    cartItems.innerHTML = '';
    
    let sousTotal = 0;
    panier.forEach(item => {
        sousTotal += item.prix * item.quantite;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.nom}">
            <div class="item-details">
                <h4>${item.nom}</h4>
                <div>${item.prix.toFixed(2)} €</div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="modifierQuantite(${item.id}, -1)">-</button>
                    <span>${item.quantite}</span>
                    <button class="qty-btn" onclick="modifierQuantite(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="supprimerProduit(${item.id})">🗑️</button>
        `;
        cartItems.appendChild(div);
    });
    
    document.getElementById('subtotal').textContent = sousTotal.toFixed(2) + ' €';
    document.getElementById('total').textContent = (sousTotal + 2.50).toFixed(2) + ' €';
}

function afficherMessage(texte) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = texte;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function commander() {
    if (panier.length === 0) {
        afficherMessage('Votre panier est vide');
        return;
    }
    afficherMessage('Merci pour votre commande !');
    panier = [];
    mettreAJourPanier();
    showSection('home');
}