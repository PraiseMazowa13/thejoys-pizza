// Injection du header avec badge stylisé
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    if (header) {
        header.innerHTML = `
            <header>
                <img src="../img/logo.jpg" alt="The Joy's Pizza" style="height: 60px; width: 60px; border-radius: 60px; object-fit: cover;">
                <nav class="links">
                    <a href="index.html">Accueil</a>
                    <a href="catalogue.html">Menu</a>
                    <a href="panier.html" style="position: relative;">
                        Panier 
                        <span class="cart-badge" id="cart-count" style="display: none;">0</span>
                    </a>
                </nav>
                
            </header>
        `;
    }

    // Injection du footer
    const footer = document.getElementById('footer');
    if (footer) {
        footer.innerHTML = `
            <footer style="height: 150px; width: 100%; color: #fff; background-color: rgba(66, 14, 14, 0.911); display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <p>The Joy's Pizza - Tous droits réservés</p>
                <div style="margin-top: 10px;">
                    <a href="https://facebook.com" style="color: white; margin: 0 10px; text-decoration: none;">Facebook</a>
                    <a href="https://whatsapp.com" style="color: white; margin: 0 10px; text-decoration: none;">Whatsapp</a>
                    <a href="#" style="color: white; margin: 0 10px; text-decoration: none;">Devs</a>
                </div>
            </footer>
        `;
    }
    
    // Mettre à jour le badge après injection du header
    if (typeof chargerPanier === 'function') {
        chargerPanier();
    }
});