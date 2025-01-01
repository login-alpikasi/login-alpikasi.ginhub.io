const { exec } = require('child_process');
const fs = require('fs');

// 1. Cloudflare DNS Auto-Update
const updateCloudflareDNS = () => {
    const apiKey = "8073965719:AAH229OkRQSpdlJEL2a6tkPGYENeRaIVjdI";
    const zoneID = "6723584330";
    const recordID = "6723584330";
    const ip = "NEW_SERVER_IP"; // Ganti otomatis kalau server berubah

    const command = `
        curl -X PUT "https://api.cloudflare.com/client/v4/zones/${zoneID}/dns_records/${recordID}" \
        -H "Authorization: Bearer ${apiKey}" \
        -H "Content-Type: application/json" \
        --data '{"type":"A","name":"yourwebsite.com","content":"${ip}","ttl":1,"proxied":true}'
    `;
    exec(command, (err, stdout) => {
        if (err) console.error('Cloudflare DNS Update Gagal:', err);
        else console.log('Cloudflare DNS Updated:', stdout);
    });
};

// 2. Deploy Mirror ke Netlify
const deployToNetlify = () => {
    exec('netlify deploy --prod', (err, stdout) => {
        if (err) console.error('Netlify Deploy Gagal:', err);
        else console.log('Netlify Deploy Sukses:', stdout);
    });
};

// 3. DuckDNS Auto-Update
const updateDuckDNS = () => {
    const token = "YOUR_DUCKDNS_TOKEN";
    const domain = "yourwebsite";
    const command = `curl -k "https://www.duckdns.org/update?domains=${domain}&token=${token}&ip="`;
    exec(command, (err, stdout) => {
        if (err) console.error('DuckDNS Update Gagal:', err);
        else console.log('DuckDNS Updated:', stdout);
    });
};

// 4. Deploy ke Tor Hidden Service
const deployToTor = () => {
    const torrcConfig = `
        HiddenServiceDir /var/lib/tor/hidden_service/
        HiddenServicePort 80 127.0.0.1:8080
    `;
    fs.writeFileSync('/etc/tor/torrc', torrcConfig);
    exec('sudo service tor restart', (err) => {
        if (err) console.error('Tor Deploy Gagal:', err);
        else console.log('Tor Hidden Service Jalan!');
    });
};

// 5. Failover Script Otomatis
const createFailoverScript = () => {
    const domains = ['https://yourwebsite.com', 'https://backup-website.netlify.app'];
    const script = `
        const domains = ${JSON.stringify(domains)};
        let index = 0;
        function redirect() {
            fetch(domains[index])
                .then(() => window.location.href = domains[index])
                .catch(() => {
                    index = (index + 1) % domains.length;
                    redirect();
                });
        }
        redirect();
    `;
    fs.writeFileSync('public/failover.js', script);
    console.log('Failover Script Dibuat!');
};

// Main Automation
const main = () => {
    console.log('Mulai Deploy Otomatis...');
    updateCloudflareDNS();
    deployToNetlify();
    updateDuckDNS();
    deployToTor();
    createFailoverScript();
    console.log('Semua Beres, Web Lu Jadi Hantu Online!');
};

main(on);