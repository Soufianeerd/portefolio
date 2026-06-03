/* ============================================================
   TANTI GUSTI II — LOGIQUE PANIER & POCKETBASE
   Fichier : commande.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const btnOrder = document.getElementById('btn-order');
    if (btnOrder) {
        // On change le comportement du bouton pour PocketBase
        btnOrder.textContent = "Valider ma commande";
        btnOrder.addEventListener('click', handleCheckout);
    }
});

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total-price');
    const checkoutForm = document.getElementById('checkout-form-container');
    
    const cart = window.getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Votre panier est vide. <br><br> <a href="menu.html" class="btn btn-or">Voir la carte</a></div>';
        subtotalEl.textContent = '0,00€';
        totalEl.textContent = '0,00€';
        if (checkoutForm) checkoutForm.style.display = 'none';
        return;
    }

    if (checkoutForm) checkoutForm.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="item-info">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-price">${item.price.toFixed(2).replace('.', ',')}€</p>
            </div>
            <div class="item-controls">
                <div class="quantity-selector">
                    <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">Supprimer</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    subtotalEl.textContent = `${total.toFixed(2).replace('.', ',')}€`;
    totalEl.textContent = `${total.toFixed(2).replace('.', ',')}€`;
}

window.updateQty = function(id, delta) {
    let cart = window.getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        window.saveCart(cart);
        renderCart();
        window.updateCartBadge();
    }
}

window.removeFromCart = function(id) {
    let cart = window.getCart();
    cart = cart.filter(i => i.id !== id);
    window.saveCart(cart);
    renderCart();
    window.updateCartBadge();
}

async function handleCheckout() {
    const cart = window.getCart();
    console.log("🛒 Panier récupéré:", cart);
    
    if (cart.length === 0) {
        console.warn("⚠️ Tentative de commande avec un panier vide.");
        return;
    }

    const form = document.getElementById('order-form');
    if (!form.reportValidity()) {
        console.warn("⚠️ Formulaire invalide.");
        return;
    }

    const btnOrder = document.getElementById('btn-order');
    const originalText = btnOrder.textContent;

    try {
        // 1. Loading State
        btnOrder.disabled = true;
        btnOrder.innerHTML = '<span class="loader"></span> Envoi en cours...';

        const formData = new FormData(form);
        
        // Nettoyage et validation de l'adresse
        const rawAdress = formData.get('adress') || '';
        const cleanedAdress = rawAdress.trim().replace(/\s+/g, ' ');
        
        if (cleanedAdress.length < 5) {
            alert("Veuillez saisir une adresse valide.");
            btnOrder.disabled = false;
            btnOrder.textContent = originalText;
            return;
        }

        const orderData = {
            nom: formData.get('nom'),
            phone: formData.get('phone'),
            adress: cleanedAdress,
            order_type: formData.get('order_type'),
            status: 'pending',
            total: parseFloat(calculateTotal(cart)),
            notes: formData.get('notes') || ''
        };

        console.log("🚀 Envoi de la commande vers PocketBase...", orderData);

        // 2. Créer la commande dans PocketBase
        let orderRecord;
        try {
            orderRecord = await window.pb.collection('orders').create(orderData);
            console.log("✅ Commande créée avec succès, ID:", orderRecord.id);
        } catch (pbError) {
            console.error("❌ Erreur PocketBase lors de la création de 'orders':", pbError);
            console.error("Détails technique:", pbError.data);
            throw new Error(`Erreur 'orders': ${JSON.stringify(pbError.data || pbError.message)}`);
        }

        // 3. Créer les items de la commande
        console.log("Commande créée :", orderRecord);
        console.log("Panier à envoyer :", cart);
        console.log("📦 Envoi des articles de la commande...");

        for (let index = 0; index < cart.length; index++) {
            const item = cart[index];
            try {
                const itemData = {
                    order_id: orderRecord.id,
                    product_name: item.name,
                    quantity: Number(item.quantity || 1),
                    price: Number(item.price || 0),
                    options: item.options || item.optionsText || ''
                };
                console.log(`Création article ${index + 1}/${cart.length}`, item);
                const createdItem = await window.pb.collection('order_items').create(itemData);
                console.log("Article créé :", createdItem);
            } catch (pbItemsError) {
                console.error("Erreur création order_items :", {
                    item,
                    error: pbItemsError
                });
                console.error("Détails technique:", pbItemsError.data);
                throw new Error(`Erreur 'order_items': ${JSON.stringify(pbItemsError.data || pbItemsError.message)}`);
            }
        }
        console.log("✅ Tous les articles ont été créés.");

        // 4. Succès
        showSuccess();
        
        // 5. Nettoyage
        window.saveCart([]); // Vide le localStorage et le badge
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 4000);

    } catch (error) {
        console.error('❌ DEBUG COMPLET - Échec de la commande:', error);
        
        // Affichage d'un message plus détaillé pour le debug (à retirer en prod si besoin)
        let errorMsg = "Une erreur est survenue lors de la validation de votre commande.";
        if (error.message.includes('orders')) errorMsg += "\n(Erreur collection 'orders')";
        if (error.message.includes('order_items')) errorMsg += "\n(Erreur collection 'order_items')";
        
        alert(errorMsg + "\n\nConsultez la console (F12) pour plus de détails.");
        
        btnOrder.disabled = false;
        btnOrder.textContent = originalText;
    }
}

function calculateTotal(cart) {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

function showSuccess() {
    const overlay = document.getElementById('success-overlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}
