import sqlite3
import re
import pycountry

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from helper_class.country_names import find_iso_of_country

#Some countries have link, others are listed and others have links while being listed
def get_countries_languages():
    array_of_country_info = []
    info = {}
    try:
        # this is the link to the first page
        url = 'https://en.wikipedia.org/wiki/List_of_official_languages_by_country_and_territory'

        # set up the headless chrome driver
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        # create a new chrome session
        driver = webdriver.Chrome(options=chrome_options)
        driver.implicitly_wait(19)
        driver.get(url)
        # Selenium hands the page source to Beautiful Soup
        soup=BeautifulSoup(driver.page_source, 'html.parser')

        # patter of the link to the country page that the href should match
        table = soup.find('table', {'class':"wikitable"})
        tbody = table.find('tbody')
        table_rows = tbody.find_all('tr')
        for tr in table_rows:
            table_columns = tr.find_all('td')
            number_of_columns = len(table_columns)
            index = 0
            country = ""
            official_languages = [] #array of offcial languages
            regional_languages = []
            minority_languages = []
            national_languages = []
            widely_spoken_languages = []
            if(number_of_columns > 0):
                a_tag= table_columns[index].find('a')
                if(a_tag != None): #The headers do not count
                    a_tag_text = a_tag.string
                    if((not re.findall("[0-9]", a_tag_text)) and (not re.findall("\[", a_tag_text))):
                        if(index == 0):
                            country = a_tag_text
            index = 1
            if(number_of_columns > 0):
                while(index < number_of_columns):
                    li_tags_array = table_columns[index].find_all('li') #For languages displayed as a list
                    a_tags_array = table_columns[index].find_all('a') #For languages displayed as a list

                    if(len(li_tags_array) > 0): #Listed
                        for li_tag in li_tags_array:
                            if(li_tag != None): #The headers do not count
                                a_tag = li_tag.find('a')
                                super_script_tag = li_tag.find('sup')
                                li_tag_text = li_tag.string
                                if(a_tag != None and super_script_tag == None): #countries with links and that don't have a superscript number
                                    a_tag_text = a_tag.string
                                    if(((not re.findall("[0-9]", a_tag_text)) or (not re.findall("\[", a_tag_text))) and (not (re.findall("languages", a_tag_text)))):
                                        if(index == 1):
                                            official_languages.append(a_tag_text)
                                        elif(index == 2):
                                            regional_languages.append(a_tag_text)
                                        elif(index == 3):
                                            minority_languages.append(a_tag_text)
                                        elif(index == 4):
                                            national_languages.append(a_tag_text)
                                        elif(index == 5):
                                            widely_spoken_languages.append(a_tag_text)
                                else:
                                    li_tag_text = li_tag.text
                                    if(re.findall("\[",li_tag_text)): #if it has brackets
                                        index_of_bracket = li_tag_text.index("[")
                                        li_tag_text = li_tag_text[:index_of_bracket]

                                    if(((not re.findall("[0-9]", li_tag_text)) or (not re.findall("\[", li_tag_text))) and (not (re.findall("languages", li_tag_text)))):
                                        if(index == 1):
                                            official_languages.append(li_tag_text)
                                        elif(index == 2):
                                            regional_languages.append(li_tag_text)
                                        elif(index == 3):
                                            minority_languages.append(li_tag_text)
                                        elif(index == 4):
                                            national_languages.append(li_tag_text)
                                        elif(index == 5):
                                            widely_spoken_languages.append(li_tag_text)
                    else: #Not Listed
                        if(len(a_tags_array) > 0):
                            a_tag = table_columns[index].find('a') #countries with links
                            super_script_tag = li_tag.find('sup')
                            a_tag_text = a_tag.text
                            if(a_tag != None and super_script_tag == None): #Not listed Not Linked
                                if(((not re.findall("[0-9]", a_tag_text)) or (not re.findall("\[", a_tag_text))) and (not (re.findall("languages", a_tag_text)))):
                                    if(index == 1):
                                        official_languages.append(a_tag_text)
                                    elif(index == 2):
                                        regional_languages.append(a_tag_text)
                                    elif(index == 3):
                                        minority_languages.append(a_tag_text)
                                    elif(index == 4):
                                        national_languages.append(a_tag_text)
                                    elif(index == 5):
                                        widely_spoken_languages.append(a_tag_text)

                            else: #If not listed linked and superscripted
                                td_tag = table_columns[index]
                                if(td_tag != None):
                                    td_tag_text = td_tag.text.strip('\n') #remove carriage return

                                    if(re.findall("\[",td_tag_text)): #if it has brackets
                                            index_of_bracket = td_tag_text.index("[")
                                            td_tag_text = td_tag_text[:index_of_bracket]
                                    if(((not re.findall("[0-9]", td_tag_text)) or (not re.findall("\[", td_tag_text))) and (not (re.findall("languages", td_tag_text)))):
                                        if(not(td_tag_text == "")):
                                            if(index == 1):
                                                official_languages.append(td_tag_text)
                                            elif(index == 2):
                                                regional_languages.append(td_tag_text)
                                            elif(index == 3):
                                                minority_languages.append(td_tag_text)
                                            elif(index == 4):
                                                national_languages.append(td_tag_text)
                                            elif(index == 5):
                                                widely_spoken_languages.append(td_tag_text)
                        else: #Case where not listed not linked in td
                            td_tag = table_columns[index]
                            if(td_tag != None):
                                td_tag_text = td_tag.text.strip('\n') #remove carriage return

                                if(re.findall("\[",td_tag_text)): #if it has brackets
                                        index_of_bracket = td_tag_text.index("[")
                                        td_tag_text = td_tag_text[:index_of_bracket]

                                if(((not re.findall("[0-9]", td_tag_text)) or (not re.findall("\[", td_tag_text))) and (not (re.findall("languages", td_tag_text)))):
                                    if(not(td_tag_text == "")):
                                        if(index == 1):
                                            official_languages.append(td_tag_text)
                                        elif(index == 2):
                                            regional_languages.append(td_tag_text)
                                        elif(index == 3):
                                            minority_languages.append(td_tag_text)
                                        elif(index == 4):
                                            national_languages.append(td_tag_text)
                                        elif(index == 5):
                                            widely_spoken_languages.append(td_tag_text)
                    index+=1
            country_iso = find_iso_of_country(country)
            if(not(country_iso == "")):
                info = {
                    "country_iso": country_iso,
                    "country_name": country,
                    "official_languages": official_languages,
                    "regional_languages": regional_languages,
                    "minority_languages": minority_languages,
                    "national_languages": national_languages,
                    "widely_spoken_languages": widely_spoken_languages
                }
                array_of_country_info.append(info)

        return(array_of_country_info)
    finally:
        driver.close()
        driver.quit()

def get_concatinated_values(array_values):
    concatinated_values = ""
    seperator = ', '
    if(array_values == None or (array_values != None and len(array_values) <= 0)):
        return ""
    for value in array_values:
        concatinated_values = seperator.join(array_values)
    return concatinated_values

def save_to_languages():
    con  = sqlite3.connect('../countries.sqlite')
    cur = con.cursor()
    # should not create the table every time
    # change in the future
    cur.execute('DROP TABLE IF EXISTS languages')
    con.commit()
    cur.execute('CREATE TABLE languages (country_iso VARCHAR, country_name VARCHAR, official_languages VARCHAR, regional_languages VARCHAR, minority_languages VARCHAR, national_languages VARCHAR, widely_spoken_languages VARCHAR)')
    con.commit()

    countries_data = get_countries_languages()
    for country in countries_data:
        country_iso = country.get('country_iso')
        country_name = country.get('country_name')
        official_languages = get_concatinated_values(country.get('official_languages'))
        regional_languages = get_concatinated_values(country.get('regional_languages'))
        minority_languages = get_concatinated_values(country.get('minority_languages'))
        national_languages = get_concatinated_values(country.get('national_languages'))
        widely_spoken_languages = get_concatinated_values(country.get('widely_spoken_languages'))

        cur.execute('INSERT INTO languages (country_iso,country_name,official_languages,regional_languages, minority_languages, national_languages, widely_spoken_languages ) values( ?, ?, ?, ?, ?, ?, ?)',(country_iso,country_name,official_languages,regional_languages, minority_languages, national_languages, widely_spoken_languages))
    con.commit()
    con.close()


save_to_languages()