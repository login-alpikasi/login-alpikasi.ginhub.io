#!/bin/bash
# Auto SSL Installer & Configurator
domain="https://htsika64.wuaze.com/"
email="htsika64@domain.com"

# Install Certbot dan Nginx
apt-get update && apt-get install -y certbot python3-certbot-nginx ufw

# Generate SSL Certificate
certbot --nginx -d $domain -d www.$domain --email $email --agree-tos --non-interactive

# Nginx Konfigurasi Aman
cat <<EOF > /etc/nginx/sites-available/$domain
server {
    listen 443 ssl https://login-alpikasi.ginhub.io/  $domain www.$domain;

    ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Restart Nginx
ln -s /etc/nginx/sites-available/$domain /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Aktifkan Firewall HTTPS
ufw allow 'Nginx Full'
ufw --force enable