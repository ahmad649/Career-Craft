import urllib.parse
from bs4 import BeautifulSoup
import requests
import csv
import pandas as pd
import random as r
import time
from flask import Flask, jsonify
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=1200)

app = Flask(__name__)

def job_search_jooble(keyword,location):
    query = urllib.parse.quote(keyword)
    loc = urllib.parse.quote(location)
    url="https://jooble.org/SearchResult?p=2&rgns="+loc+"&ukw="+query
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.5',
        # 'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': "https://www.google.com/",
        'TE': 'Trailers'
    }
    #print(headers)


    if url in cache:
        print("cache found jooble")
        response = cache[url]

    else:
        print("cache added jooble")
        response = requests.get(url,headers=headers)
        cache[url] = response


    # response = requests.get(url)

    #print(response)

    html_text = response.text

    soup = BeautifulSoup(html_text,'lxml')

    jobs=soup.find_all('article',class_='FxQpvm yKsady')
    # print(jobs)

    job_data=[]
    for job in jobs:

        try:
            scraper_name = 'jooble'

            job_title=job.a.text.strip()
            # print("job title: ", j_type)

            company_name=job.find('div',class_='_15xYk4').p.text.strip()
            # print("job: ", job, "company name :", company_name)

            job_description=job.find('div',class_='_9jGwm1').text.replace('...','')
            # print("job description : ", job_description.strip())

            anchor_link=job.a.get('href')
            # print("link : ",anchor_link)

            data={'scraper_name':scraper_name,'job_title': job_title,'company_name': company_name,'job_description': job_description,'anchor_link': anchor_link}
            # data={'job_title':job_title, 'company_name': company_name, 'job_description': job_description, 'skills': skills, 'anchor_link':anchor_link}

            job_data.append(data)
        except:
            print("none type found jooble")
        
    return job_data


