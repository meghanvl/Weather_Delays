import numpy as np
import sqlalchemy
import datetime as dt
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template

engine = create_engine("sqlite:///ORD_Delays.sqlite")

Base = automap_base()

Base.prepare(engine, reflect=True)

Delays = Base.classes.delays

app = Flask(__name__)

@app.route("/test")
def test():
    
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