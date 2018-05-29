import os
from flask import Flask, jsonify, render_template, request

template_dir = os.path.dirname(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
template_dir = os.path.join(template_dir, 'html')

app = Flask(__name__, static_url_path=template_dir)

@app.route('/')
def index():
    return render_template("hockey points analyzer.html")

if __name__ == "__main__":
    app.run()
