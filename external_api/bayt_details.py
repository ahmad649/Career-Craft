import urllib.parse
from bs4 import BeautifulSoup
import requests
import pandas as pd
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=3600)



def job_detail_bayt(url):

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Referer': url,
        'TE': 'Trailers'
    }
    scraper_name = "bayt"
    
    try:
        if url in cache:
            print("cache found bayt details")
            response = cache[url]
        else:
            print("cache added bayt details")
            response = requests.get(url,headers=headers)
            response.raise_for_status()
            cache[url] = response

        html_text = response.text
        soup = BeautifulSoup(html_text,'lxml')

        des=soup.find('div',class_='card-content is-spaced')
        job_description = ""
        if des:
            full_des=des.find_all('p')
            # print(full_des)
            for i in full_des:
                # print(i.text)
                job_description += i.text
            full_des=des.find_all('ul')
            for ul in full_des:
                for li in ul.find_all('li'):
                    # print('-',li.text)
                    job_description += li.text
            return job_description
        else:
            print("No job description found in the page.")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while processing the url {url}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred while processing the url {url}: {e}")
