from flask import Flask, render_template, request, redirect, url_for
import ssl

app = Flask(__name__)

# Middleware untuk keamanan dan penguatan jaringan
@app.after_request
def apply_security_headers(response):
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self';"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['X-Frame-Options'] = 'DENY'
    return response

# Halaman utama dengan Turbo HTML
@app.route('/')
def index():
    return '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Turbo HTML App</title>
        <script type="module">
            import hotwiredTurbo from 'https://cdn.skypack.dev/@hotwired/turbo';
            hotwiredTurbo.start();
        </script>
        <link rel="stylesheet" href="/static/styles.css">
    </head>
    <body>
        <h1>Selamat Datang di Turbo HTML dengan HTTPS</h1>
        <form action="/submit" method="POST">
            <label for="data">Masukkan Data:</label>
            <input type="text" id="data" name="data" required>
            <button type="submit">Kirim</button>
        </form>
        <div id="response"></div>
    </body>
    </html>
    '''

# Halaman untuk memproses input
@app.route('/submit', methods=['POST'])
def submit():
    data = request.form.get('data', 'No data submitted')
    return f'''
    <div id="response">
        <p>Data yang diterima: {data}</p>
    </div>
    '''

if __name__ == '__main__':
    # Menyiapkan sertifikat SSL untuk mendukung HTTPS
    context = ssl.SSLContext(ssl.PROTOCOL_TLS)
    context.load_cert_chain('cert.pem', 'key.pem')  # Gunakan file sertifikat SSL Anda
    
    # Jalankan server dengan HTTPS dan HTTP/2
    app.run(host='0.0.0.0', port=443, ssl_context=context)