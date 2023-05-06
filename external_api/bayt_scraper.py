import urllib.parse
from bs4 import BeautifulSoup
import requests
import pandas as pd
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=1200)


def job_search_bayt(keyword,location):

    query = urllib.parse.quote(keyword)
    loc = urllib.parse.quote(location)
    loc = ""
    if loc == "" or loc == " ": 
        loc = "international"
    link="https://www.bayt.com/en/"+loc+"/jobs/"+query+"-jobs/"
    

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Referer': link,
        'TE': 'Trailers'
    }
    scraper_name = "bayt"
    
    try:

        if link in cache:
            print("cache found bayt")
            response = cache[link]
        else:
            print("cache added bayt")
            response = requests.get(link,headers=headers)
            response.raise_for_status()
            cache[link] = response

        html_text = response.text
        soup = BeautifulSoup(html_text,'lxml')
    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}")
    except requests.exceptions.ConnectionError as errc:
        print(f"Connection Error: {errc}")
    except requests.exceptions.Timeout as errt:
        print(f"Timeout Error: {errt}")
    except requests.exceptions.RequestException as err:
        print(f"Something went wrong: {err}")


    anchor_links=[]

    jobs=soup.find_all('li',class_='has-pointer-d')
    job_data=[]

    for job in jobs:

        div = job.find('div')
        company_name = job.find('b', class_='jb-company').text
        # print("company_name : ", company_name)

        job_title = div.find('h2',class_='jb-title m0 t-large').text

        anchor_link = 'https://www.bayt.com'+div.find('h2',class_='jb-title m0 t-large').a.get('href')

        job_description = div.find('div',class_='jb-descr m10t t-small').text

        data={'scraper_name':scraper_name, 'job_title':job_title, 'company_name':company_name, 'job_description':job_description, 'anchor_link': anchor_link }
        job_data.append(data)

    return job_data

