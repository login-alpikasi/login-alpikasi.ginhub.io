const { exec } = require('child_process');
const fs = require('fs');

// 1. Update DuckDNS (Domain Dinamis)
const updateDuckDNS = () => {
    const duckdnsUrl = "https://www.duckdns.org/update?domains=mywebsite&token=YOUR_TOKEN&ip=";
    exec(`curl -k "${duckdnsUrl}"`, (err, stdout) => {
        if (err) console.error('DuckDNS update gagal:', err);
        else console.log('DuckDNS berhasil diupdate:', stdout);
    });
};

// 2. Failover Domain
const failoverDomains = () => {
    const domains = ['https://mywebsite.com', 'https://mywebsite.net', 'https://mywebsite.is'];
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
    console.log('Failover script berhasil dibuat.');
};

// 3. Deploy ke Netlify
const deployNetlify = () => {
    exec('netlify deploy --prod', (err, stdout) => {
        if (err) console.error('Deploy ke Netlify gagal:', err);
        else console.log('Berhasil deploy ke Netlify:', stdout);
    });
};

// 4. Deploy ke Tor
const deployTor = () => {
    exec('sudo apt install tor && sudo service tor start', (err) => {
        if (err) console.error('Install Tor gagal:', err);
        else {
            const torrc = `
                HiddenServiceDir /var/lib/tor/hidden_service/
                HiddenServicePort 80 127.0.0.1:80
            `;
            fs.writeFileSync('/etc/tor/torrc', torrc);
            exec('sudo service tor restart', () => console.log('Tor hidden service berhasil jalan.'));
        }
    });
};

// 5. Schedule Otomatis (CRON)
const scheduleCron = () => {
    const cronJob = `@reboot node ${__filename}`;
    fs.appendFileSync('/etc/crontab', cronJob);
    console.log('Job otomatis berhasil dijadwalkan.');
};

// Main Automation
const main = () => {
    console.log('Mulai deploy otomatis...');
    updateDuckDNS();
    failoverDomains();
    deployNetlify();
    deployTor();
    scheduleCron();
    console.log('Deploy otomatis selesai, siap perang!');
};

main();