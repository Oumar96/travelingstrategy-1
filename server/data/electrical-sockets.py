import sqlite3
import re
import pycountry
import numpy as np

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from helper_class.country_names import find_iso_of_country
from helper_class.chrome_driver import create_driver
from helper_class.chrome_driver import quit_driver

def get_electrical_sockets():
    info = {}
    try:
        url = 'https://www.worldstandards.eu/electricity/plug-voltage-by-country/'
        
        driver = create_driver()
        driver.get(url)

        #Selenium hands the page source to Beautiful Soup
        soup=BeautifulSoup(driver.page_source, 'lxml')
        
        return info

    finally:
        driver.close()
        driver.quit()

def save_electrical_sockets():
    con  = sqlite3.connect('../countries.sqlite')
    cur = con.cursor()

    cur.execute('DROP TABLE IF EXISTS sockets')
    con.commit()
    cur.execute('CREATE TABLE sockets (country_iso VARCHAR, country_name VARCHAR, types VARCHAR)')
    con.commit()


    socket_data = get_electrical_sockets()
    # something needs to change here

    con.commit()
    con.close()