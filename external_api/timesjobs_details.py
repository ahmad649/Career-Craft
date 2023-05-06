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

def job_detail_timesjobs(url):

    if url in cache:
        print("cache found timesjobs details")
        response = cache[url]
    else:
        print("cache added timesjobs details")
        response = requests.get(url)
        cache[url] = response

    job_data = []
    html_text = response.text
    soup = BeautifulSoup(html_text, 'lxml')
    job_description = soup.find('div', class_='jd-desc job-description-main').text

    # data = {'JOB DESCRIPTION': job_description.strip()}

    return job_description.replace('Job Description:','').strip()