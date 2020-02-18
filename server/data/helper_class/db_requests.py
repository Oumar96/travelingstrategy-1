from flags import Flags
from logger import Logger
import datetime
import sys
sys.path.append("..")
from lib.database import Database

DB = Database("countries.sqlite")
#This maybe will no be done in this script but we keep for testing
NOW = datetime.datetime.now()
DATE_FORMAT = "%Y-%m-%d"
DATE = NOW.strftime(DATE_FORMAT)


def set_up_db():
    DB.add_table("requests",request_id="INTEGER PRIMARY KEY AUTOINCREMENT", user_id = "INTEGER",days_to_trip="INTEGER",
            date_of_trip="text", search_term="text", email="text")

def calculate_days_to_trip(date_trip):
    date_trip = datetime.datetime.strptime(date_trip, DATE_FORMAT)
    delta = date_trip - NOW
    days = delta.days
    return days


#TO DELETE
def test():
    to_trip1  = calculate_days_to_trip("2020-02-25")
    to_trip2  = calculate_days_to_trip("2020-03-01")
    to_trip3  = calculate_days_to_trip("2020-04-23")
    DB.insert("requests","null","1",str(to_trip1),"2020-02-25", "newyork", "chanc09@gmail.com")
    DB.insert("requests","null","2",str(to_trip2),"2020-03-01", "newyork", "ghanemline@gmail.com")
    DB.insert("requests","null","3",str(to_trip3),"2020-04-23", "newyork", "chanc09@outlook.com")

# Since we are testing we are reusing the same ids
#TO BE DELETED
DB.drop_table("requests")
set_up_db()
test()