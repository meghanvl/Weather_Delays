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

engine = create_engine("sqlite:///ORD_Delays.sqlite")

Base = automap_base()

Base.prepare(engine, reflect=True)

Delays = Base.classes.ordtable

@app.route("/")
def index():
    
    return render_template("index.html")

@app.route("/locations")
def location():
    
    session = Session(engine)
   
    results = session.query(Delays.FL_DATE, Delays.ORIGIN, Delays.DEP_DELAY).all()
    
    session.close()
    
    delay_data = []
    for row in results:
        delay_dict = {}
        delay_dict["Date"] = row.FL_DATE 
        delay_dict["Origin"] = row.ORIGIN
        delay_dict["Delay Duration"] = row.DEP_DELAY   
        delay_data.append(delay_dict)

    return jsonify(delay_data)

if __name__ == "__main__":
    app.run(debug=True)
