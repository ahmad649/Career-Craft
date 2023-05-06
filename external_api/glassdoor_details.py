import urllib.parse
from bs4 import BeautifulSoup
import requests
import csv
import pandas as pd
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=3600)

def job_detail_glassdoor(url):
    
    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.5',
    # 'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Referer': url,
    'TE': 'Trailers'
    }

    if url in cache:
        print("cache found glassdoor details")
        response = cache[url]
    else:
        print("cache added glassdoor details")
        response = requests.get(url,headers=headers)
        cache[url] = response

    print(response)
    html_text = response.text
    soup = BeautifulSoup(html_text,'lxml')

    anchor_links=[]
    jobs=soup.find_all('li',class_='react-job-listing')
    main_href="http://www.glassdoor.com"
    data={}
    job_data=[]
    # print("jobs",jobs)



    try:
        jd_raw = soup.find(id="JobDescriptionContainer")
        jdwhole = jd_raw.find('div',class_ = 'desc css-58vpdc ecgq1xb5').ul
        # print(response," url: ",url)
        # print(jdwhole.text)
        return jdwhole.text
    except:
        print("none type found glassdoor")
        return None
    # print(job_data[:1])
