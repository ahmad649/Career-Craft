import urllib.parse
from bs4 import BeautifulSoup
import requests
import csv
import pandas as pd
from flask import Flask, jsonify
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=1200)

app = Flask(__name__)

def job_search_mustakbil(keyword,location):

    query = urllib.parse.quote(keyword)
    loc = urllib.parse.quote(location)
    link="https://www.mustakbil.com/jobs/search?countryId=162&keywords="+query + "&city="+loc
    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.5',
    # 'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Referer': link,
    'TE': 'Trailers'
    }

    if link in cache:
        print("cache found mustakbil")
        response = cache[link]

    else:
        print("cache added mustakbil")
        response = requests.get(link,headers=headers)
        cache[link] = response

    html_text = response.text
    soup = BeautifulSoup(html_text,'lxml')

    anchor_links=[]

    jobs=soup.find_all('div',class_='mat-card mb10 list-item ng-star-inserted')
    main_href="https://www.mustakbil.com"
    data={}
    job_data=[]
    # print(jobs)


    for job in jobs:
        try:

            scraper_name = "mustakbil"

            job_text=job.text
            # print(job_text)

            extra_info=job.find('h2',class_='mb5 mt0 tappable').a
            link=extra_info.get('href')
            anchor_link = (main_href+link)

            job_title=extra_info.text
            job_title = job_title.split('Jobs in')[0].strip()
            job_title = job_title.split('Online')[0].strip()
            #print(job_title)

            company_name = job_text.replace(job_title,' ')
            company_name = company_name.split("Type")[0].strip()
            company_name = company_name.split('Jobs in Pakistan')[-1].strip()

            job_description=job.find('div',class_='mt10 mb10').text
            # #print(job_description)

            data={'scraper_name':scraper_name, 'job_title':job_title, 'company_name':company_name, 'job_description':job_description, 'anchor_link': anchor_link }
            job_data.append(data)
        except:
            print("none type found mustakbil")

    return job_data


