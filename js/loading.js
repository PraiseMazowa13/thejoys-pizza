 function loanding() {
            // Éléments DOM
            const loadingPage = document.getElementById('loadingPage');
            const mainContent = document.getElementById('mainContent');
            const progressBar = document.getElementById('progressBar');
            const percentageEl = document.getElementById('percentage');
            const messageEl = document.getElementById('message');
            const funTip = document.getElementById('funTip');

            // Messages personnalisés
            const messages = [
                "Préparation de votre commande",
                "Notre chef s'affaire en cuisine",
                "Sélection des meilleurs ingrédients",
                "Cuisson maîtrisée",
                "Dressage de l'assiette",
                "Presque prêt...",
                "C'est bientôt prêt !"
            ];

            // Tips sympas
            const tips = [
                { icon: "🍽️", text: "Les meilleurs plats prennent un peu de temps" },
                { icon: "👨‍🍳", text: "Notre chef prépare tout avec amour" },
                { icon: "🥩", text: "Viande fraîche tous les jours" },
                { icon: "🥖", text: "Pain cuit sur place" },
                { icon: "⭐", text: "Noté 4.8/5 par nos clients" },
                { icon: "🚚", text: "Livraison rapide garantie" }
            ];

            let progress = 0;
            let messageIndex = 0;
            let tipIndex = 0;

            // Fonction de mise à jour de la barre
            function updateProgress() {
                if (progress >= 100) {
                    // Fin du chargement
                    clearInterval(progressInterval);
                    clearInterval(messageInterval);
                    clearInterval(tipInterval);
                    
                    messageEl.textContent = "C'est prêt ! Bon appétit ! 🎉";
                    
                    // Animation de fin
                    setTimeout(() => {
                        loadingPage.style.animation = 'fadeOut 0.5s ease forwards';
                        
                        // Style pour l'animation de sortie
                        const style = document.createElement('style');
                        style.textContent = `
                            @keyframes fadeOut {
                                from { opacity: 1; }
                                to { opacity: 0; visibility: hidden; }
                            }
                        `;
                        document.head.appendChild(style);
                        
                        setTimeout(() => {
                         window.location.href="main.html"
                        }, 1000);
                    }, 800);
                    
                    return;
                }

                // Augmenter la progression
                progress += Math.floor(Math.random() * 3) + 1;
                if (progress > 100) progress = 100;
                
                // Mettre à jour l'affichage
                progressBar.style.width = progress + '%';
                percentageEl.textContent = progress + '%';
            }

            // Changer le message toutes les 1.5 secondes
            function updateMessage() {
                messageIndex = (messageIndex + 1) % messages.length;
                messageEl.style.opacity = '0';
                
                setTimeout(() => {
                    messageEl.textContent = messages[messageIndex];
                    messageEl.style.opacity = '1';
                }, 200);
                
                messageEl.style.transition = 'opacity 0.3s ease';
            }

            // Changer le tip toutes les 3 secondes
            function updateTip() {
                tipIndex = (tipIndex + 1) % tips.length;
                funTip.style.opacity = '0';
                
                setTimeout(() => {
                    funTip.innerHTML = `<span>${tips[tipIndex].icon}</span> ${tips[tipIndex].text} <span>⏱️</span>`;
                    funTip.style.opacity = '0.8';
                }, 300);
                
                funTip.style.transition = 'opacity 0.3s ease';
            }

            // Démarrer les animations
            console.log('🚀 Chargement démarré...');
            
            // Intervalle pour la barre de progression (plus rapide = 2 secondes)
            const progressInterval = setInterval(updateProgress, 40); // 40ms * ~50 = 2 secondes
            
            // Intervalle pour les messages
            const messageInterval = setInterval(updateMessage, 1500);
            
            // Intervalle pour les tips
            const tipInterval = setInterval(updateTip, 3000);

            // Gestionnaire d'erreur
            window.addEventListener('error', function(e) {
                console.log('Erreur de chargement gérée silencieusement');
            });

        };

loanding();