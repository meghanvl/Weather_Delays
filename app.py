
import sqlalchemy
import os
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

app = Flask(__name__)

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///ORD_Delays.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

=======
import numpy as np
import sqlalchemy
import datetime as dt
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template
>>>>>>> d7af2c6053ecad5d413ca2ab903f29856177d8a6

engine = create_engine("sqlite:///ORD_Delays.sqlite")

Base = automap_base()

Base.prepare(engine, reflect=True)

Delays = Base.classes.delays



# index route, return index template
@app.route("/")
def index():
    
    return render_template("index.html")

@app.route("/locations")
def locations():
=======
app = Flask(__name__)

@app.route("/test")
def test():
>>>>>>> d7af2c6053ecad5d413ca2ab903f29856177d8a6
    
    session = Session(engine)
   
    results = session.query(Delays.FL_DATE, Delays.ORIGIN, Delays.DEP_DELAY).all()
    
    session.close()
    
    delays = []
    for row in results:
        delay_dict = {}
        delay_dict["Date"] = row.FL_DATE 
        delay_dict["Origin"] = row.ORIGIN
        delay_dict["Delay Duration"] = row.DEP_DELAY   
        delays.append(delay_dict)

    return jsonify(delays)

if __name__ == "__main__":
    app.run(debug=True)
