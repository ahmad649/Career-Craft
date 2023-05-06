import urllib.parse
from bs4 import BeautifulSoup
import requests
import csv
import pandas as pd
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=1200)

def job_search_glassdoor(keyword,location):
    query = urllib.parse.quote(keyword)
    loc = urllib.parse.quote(location)
    link="https://www.glassdoor.com/Job/jobs.htm?sc.keyword="+keyword+"&locName="+loc
    
    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.5',
    # 'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Referer': link,
    'TE': 'Trailers'
    }

    if link in cache:
        print("cache found glassdoor")
        response = cache[link]
    else:
        print("cache added glassdoor")
        response = requests.get(link,headers=headers)
        cache[link] = response

    html_text = response.text
    soup = BeautifulSoup(html_text,'lxml')

    anchor_links=[]
    jobs=soup.find_all('li',class_='react-job-listing')
    main_href="http://www.glassdoor.com"
    data={}
    job_data=[]
    # print("jobs",jobs)


    for job in jobs:
        try:
            scraper_name = "glassdoor"

            link=job.find('div',class_='d-flex justify-content-between align-items-start').a
            # print(link)

            company_name=link.text
            # print("name", company_name)

            job_title=job.find('a',class_='jobLink css-1rd3saf eigr9kq2').text
            # print(job_title)

            job_location = job.find('div', class_='d-flex flex-wrap css-11d3uq0 e1rrn5ka2').text
            # print(job_location)

            job_salary = job.find('div', class_='css-3g3psg pr-xxsm').text
            # print(job_salary)

            job_description = "Job Location: "+ job_location +", Salary: "+ job_salary +", Click on View details or Apply to see more information about this job"
            
            anchor_link = main_href + link.get('href')
            
            data={'scraper_name':scraper_name, 'job_title':job_title, 'company_name':company_name, 'job_description':job_description, 'anchor_link': anchor_link }
            job_data.append(data)

        except:
            print("none type found glassdoor")
        
    return job_data
