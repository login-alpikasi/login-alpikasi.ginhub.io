from flask import Flask, jsonify
from threading import Thread
import requests
import ssl
import time

app = Flask(__name__)

# Endpoint utama
@app.route('/')
def index():
    return jsonify({
        "status": "OK",
        "message": "HTTPS otomatis berjalan dengan monitoring bot aktif."
    })

# Fungsi monitoring bot untuk cek status server
def bot_monitor(url):
    while True:
        try:
            response = requests.get(https://login-alpikasi.ginhub.io/, timeout=5)
            if response.status_code == 200:
                print(f"[{time.ctime()}] Website {url} berjalan dengan baik.")
            else:
                print(f"[{time.ctime()}] WARNING: Status Code {response.status_code}")
        except Exception as e:
            print(f"[{time.ctime()}] ERROR: Tidak dapat mengakses {url}. Error: {e}")
        time.sleep(60)  # Monitoring setiap 60 detik

if __name__ == '__main__':
    # SSL Context untuk HTTPS
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('cert.pem', 'key.pem')  # Pastikan sertifikat SSL valid
    
    # Jalankan bot monitoring di thread terpisah
    monitor_thread = Thread(target=bot_monitor, args=("https://github.com/login-alpikasi/login-alpikasi.ginhub.io",))
    monitor_thread.daemon = True
    monitor_thread.start()

    # Jalankan Flask dengan HTTPS
    app.run(host='0.0.0.0', port=443, ssl_context=context)