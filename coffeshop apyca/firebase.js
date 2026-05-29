import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDMX9ywoUFmhEqVSSUfF23Szp9sVBzT0Ig",
    authDomain: "apycacoffeey.firebaseapp.com",
    projectId: "apycacoffeey",
    storageBucket: "apycacoffeey.firebasestorage.app",
    messagingSenderId: "475967388014",
    appId: "1:475967388014:web:f2ce286fa6ee5941cb697f",
    measurementId: "G-N3SE018638"
};

try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Expose to window
    window.db = db;
    window.serverTimestamp = serverTimestamp;

    // Override processOrder dengan Firebase Logic jika koneksi berhasil
    window.processOrder = async function() {
        const btn = document.querySelector('#invoiceModal button[onclick="processOrder()"]');
        const originalText = btn.innerText;
        btn.innerText = "Memproses...";
        btn.disabled = true;

        try {
            let total = 0;
            cart.forEach(i => total += i.price);
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

            await addDoc(collection(db, "orders"), {
                items: cart,
                total: total,
                paymentMethod: paymentMethod,
                status: "pending",
                createdAt: serverTimestamp()
            });

            showToast("Berhasil!", "Pesanan telah dibuat.");
            cart = [];
            updateCartBadge();
            renderCart();
            closeInvoice();
            closeMenuModal();

        } catch (error) {
            console.error(error);
            alert("Gagal: " + error.message);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
    
    console.log("Firebase Connected");

} catch (e) {
    console.warn("Firebase blocked or failed (likely CORS on local file). Using UI Simulation mode.");
}