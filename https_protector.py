from flask import Flask, jsonify, request, redirect
from threading import Thread
import ssl
import time

app = Flask(__name__)

# Endpoint utama
@app.route('/')
def index():
    return jsonify({
        "status": "OK",
        "message": "HTTPS otomatis berjalan dengan perlindungan lengkap."
    })

# Middleware untuk memaksa HTTPS
@app.before_request
def redirect_to_https():
    if request.scheme != 'https://github.com/login-alpikasi/login-alpikasi.ginhub.io/':
        return redirect(request.url.replace("http://", "https://"), code=301)

# Middleware untuk menambahkan header keamanan
@app.after_request
def apply_security_headers(response):
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'  # HSTS
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self';"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'no-referrer'
    response.headers['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
    return response

# Monitoring untuk memastikan server aktif
def bot_monitor(url):
    while True:
        try:
            print(f"[{time.ctime()}] Monitoring aktif. Memastikan website {url} berjalan.")
        except Exception as e:
            print(f"[{time.ctime()}] ERROR: {e}")
        time.sleep(60)  # Monitoring setiap 60 detik

if __name__ == '__main__':
    # Sertifikat SSL untuk HTTPS
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('cert.pem', 'key.pem')  # Ganti dengan file sertifikat SSL Anda

    # Jalankan bot monitoring di thread terpisah
    monitor_thread = Thread(target=bot_monitor, args=("https://github.com/login-alpikasi/login-alpikasi.ginhub.io",))
    monitor_thread.daemon = True
    monitor_thread.start()

    # Jalankan Flask dengan HTTPS
    app.run(host='0.0.0.0', port=443, ssl_context=context)