import urllib.parse
from bs4 import BeautifulSoup
import requests
import csv
import pandas as pd
import time
from cachetools import TTLCache
from flask import Flask, jsonify

app = Flask(__name__)
cache = TTLCache(maxsize=1000, ttl=1200)

def job_search_timesjobs(keyword,location):


    query = urllib.parse.quote(keyword)
    loc = urllib.parse.quote(location)
    url = "https://www.timesjobs.com/candidate/job-search.html?from=submit&actualTxtKeywords="+query+"&searchBy=0&rdoOperator=OR&searchType=personalizedSearch&txtLocation="+loc+"&luceneResultSize=10&postWeek=60&txtKeywords="+query+"&pDate=I&sequence=1&&startPage=1"
    
    if url in cache:
        print("cache found timesjobs")
        response = cache[url]

    else:
        print("cache added timesjobs")
        response = requests.get(url)
        cache[url] = response
    
    html_text = response.text
    soup = BeautifulSoup(html_text,'lxml')
    jobs = soup.find_all('li',class_ = 'clearfix job-bx wht-shd-bx')

    job_data=[]

    for job in jobs:
        
        scraper_name = 'timesjobs'

        job_title = job.find('header',class_ = 'clearfix').find('h2').text.strip()
        # print("job_title: ", job_title)

        company_name = job.find('h3',class_ = 'joblist-comp-name').text
        company_name = company_name.replace('(More Jobs)','').strip()
        # print("comp name: ", company_name)

        job_description_raw = job.find('ul',class_ = 'list-job-dtl clearfix')
        job_description = job_description_raw.find('li').text.replace('More Details','').replace('Job Description:','').strip()
        # print("job desc: ", job_description)

        skills = job.find('span', class_ = 'srp-skills').text
        skills = skills.split(',')
        skills = [skill.strip() for skill in skills]
        # print("skills: ", skills)

        extra_info=job.find('ul',class_ = 'list-job-dtl clearfix').li.a
        anchor_link = extra_info.get('href')
        # print("anchor links: ",anchor_link)

        data={'scraper_name':scraper_name,'job_title':job_title, 'company_name': company_name, 'job_description': job_description, 'skills': skills, 'anchor_link':anchor_link}

        job_data.append(data)
    
    return job_data

