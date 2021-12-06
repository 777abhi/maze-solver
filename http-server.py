from flask import Flask, render_template, make_response, request
import random

app = Flask(__name__, static_folder='static')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

private_key = "Q@!NF0T3CH"
enkey = "Rq6jreLf2EmkllCuzg1DNC7FLnyytt6Q2f4tweo3sDo="

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route("/c/<cid>")
def landing(cid):
    p = random.randint(0, 9)
    print(p)
    return make_response(render_template(cid+".html", cookie=1, bct=1, p=p))

def response_crystal_maze():
    direction = request.form["crystalMazePath"]
    if not direction.startswith("r"):
        return False
    if not direction.endswith("r"):
        return False
    if(len(direction)<30):
        return False
    return True

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
