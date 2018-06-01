from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def home():
    return render_template("first.html", header="test", paragraph = "paragraph")


if __name__ == "__main__":
    app.run()
