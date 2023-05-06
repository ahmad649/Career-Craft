import urllib.parse
from bs4 import BeautifulSoup
import requests
import csv
import pandas as pd
import time
from flask import Flask, jsonify
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=3600)

app = Flask(__name__)

def job_detail_jooble(url):

    job_data = []

    # headers = {
    #     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    #     'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
    #     # 'Accept-Encoding': 'gzip, deflate',
    #     'Connection': 'keep-alive',
    #     'Referer': url,
    #     'Upgrade-Insecure-Requests': '1'
    # }

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        # 'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Referer': url,
        'Upgrade-Insecure-Requests': '1'
    }


    if url in cache:
        print("cache found jooble details")
        response = cache[url]
    else:
        print("cache added jooble details")
        response = requests.get(url,headers=headers)
        cache[url] = response

    try:
        print("response : ",response)
        html_text = response.text
        soup = BeautifulSoup(html_text,'lxml')
        job_description=soup.find('div',class_='_1yTVFy').text
        print("job description : ", job_description)
        return job_description.strip()
    except Exception as e:
        print("An error occurred:", str(e))
        return None

    
