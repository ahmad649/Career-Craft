import urllib.parse
from bs4 import BeautifulSoup
import requests
import csv
import pandas as pd
from flask import Flask, jsonify
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=3600)

app = Flask(__name__)

def job_detail_mustakbil(url):

    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.5',
    # 'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Referer': url,
    'TE': 'Trailers'
    }

    if url in cache:
        print("cache found mustakbil details")
        response = cache[url]
    else:
        print("cache added mustakbil details")
        response = requests.get(url,headers=headers)
        cache[url] = response

    html_text = response.text
    soup = BeautifulSoup(html_text,'lxml')


    job_des = ""
    try:
        job_info=soup.find('div',class_='p15 mat-card mb10')
    
        divs = job_info.find_all("div")
        # print(divs)
        for div in divs:
            # ptags = div.find_all("p")
            # for tag in ptags:
            #     job_des += str(tag.text)
            try:
                ultags=div.find_all('ul')
                for tag in ultags:
                    for l in tag:
                        job_des += str('.',l.text)
            except ultag_not_found as ultag_error:
                continue
            ptags = div.find_all("p")
            for tag in ptags:
                job_des += str(tag.text)


        job_des = job_des.replace("â","'")
        job_des = job_des.replace("Â","<br>")
        # print(job_des)
        return job_des
    except:
        print("except : ", response)
        return None



