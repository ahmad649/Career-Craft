from bs4 import BeautifulSoup
import requests
import re
import urllib.parse
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=3600)


def job_detail_trabajo(url):


    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Referer': url,
        'TE': 'Trailers'
    }

    scraper_name = "trabajo"

    try:

        if url in cache:
            print("cache found trabajo details")
            response = cache[url]
        else:
            print("cache added trabajo details")
            response = requests.get(url,headers=headers)
            response.raise_for_status()
            cache[url] = response

        html_text = response.text
        soup = BeautifulSoup(html_text,'lxml')


        des = soup.find('div',class_='nf-job-list-desc-box mt-4')
        job_description = ""
        if des:
            for span in des('span'):
                span.extract()  # remove span tags and their contents

            text = des.text
            text = text.replace('POSITION:', '\n POSITION: ')
            text = text.replace('LOCATION:', '\n LOCATION: ')
            text = text.replace('SCHEDULE:', '\n SCHEDULE: ')
            text = text.replace('About ', '\n About ')
            pattern = r"(?<=[a-z])(?=[A-Z])"
            replace = " \n"

            text = re.sub(pattern, replace, text)
            text = text.replace("Apply", "").strip()

            # print("text : ", text)

            # p_tags = des.find_all('p')
            # for p in p_tags:
            #     print('.',p.text)
            job_description += text
            return job_description
        else:
            print("'nothing found')")
    
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while processing the url {url}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred while processing the url {url}: {e}")
