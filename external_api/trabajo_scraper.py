from bs4 import BeautifulSoup
import requests
import urllib.parse
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=1200)


def job_search_trabajo(keyword,location):

    query = urllib.parse.quote(keyword)
    loc = urllib.parse.quote(location)

    link="https://pk.trabajo.org/jobs-"+query+"/"+loc

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Referer': link,
        'TE': 'Trailers'
    }

    scraper_name = "trabajo"

    try:

        if link in cache:
            print("cache found trabajo")
            response = cache[link]
        else:
            print("cache added trabajo")
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

    # lnr lnr-briefcase mr-2

    anchor_links=[]

    jobs=soup.find_all('li',class_='nf-job list-group-item mb-3 job-item')
    job_data =[]
    for job in jobs:

        element=job.find('div',class_='d-flex flex-column justify-content-center').h2
        job_title=element.text

        anchor_link = element.a.get('href')

        des = job.find('div',class_='nf-job-list-desc mt-4')
        p_tags=des.find_all('p')
        job_description = ""
        for p in p_tags:
            # print(p.text)
            job_description += p.text

        company_name_divs = job.find('div',class_='nf-job-list-info d-flex flex-wrap mb-2')
        company_name_element = company_name_divs.find_all("span")[1]
        company_name = company_name_element.get_text()

        data={'scraper_name':scraper_name, 'job_title':job_title, 'company_name':company_name, 'job_description':job_description, 'anchor_link': anchor_link }
        job_data.append(data)

    return job_data