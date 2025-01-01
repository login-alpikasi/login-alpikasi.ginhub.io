from flask import Flask, request, render_template_string, abort, make_response
from markupsafe import escape

app = Flask(__name__)

# Middleware untuk mencegah serangan XSS dengan menambahkan CSP header
@app.after_request
def set_security_headers(response):
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self';"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Route untuk menerima input dan mengamankan output
@app.route('/submit', methods=['POST'])
def submit():
    # Validasi input
    user_input = request.form.get('user_input', '')
    if not user_input:
        abort(400, "Input tidak boleh kosong!")

    # Escape output untuk mencegah XSS
    safe_input = escape(user_input)

    # Contoh respon HTML aman
    response_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Hasil Aman</title>
    </head>
    <body>
        <h1>Input Anda:</h1>
        <p>{safe_input}</p>
    </body>
    </html>
    """
    return render_template_string(response_html)

# Route utama
@app.route('/')
def index():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Form Aman</title>
    </head>
    <body>
        <form action="/submit" method="POST">
            <label for="user_input">   𝗗𝗔𝗡𝗔 𝗚𝗶𝘃𝗲𝗮𝘄𝗮𝘆 𝗜𝗻𝗱𝗼𝗻𝗲𝘀𝗶𝗮:</label>
            <input type="text" id="user_input" name="user_input" required>
            <button type="submit">Submit</button>
        </form>
    </body>
    </html>
    '''

if __name__ == '__main__':
    # Menjalankan aplikasi dengan mode debug off untuk keamanan
    app.run(debug=False)
   