import requests
from bs4 import BeautifulSoup
import urllib.parse
import pandas as pd
import csv
import os
from cachetools import TTLCache
cache = TTLCache(maxsize=1000, ttl=3600)

def getPathInfo(path_name):
    dic={}
    
    filename = "bing_results.csv"
    # check if csv file exists
    if os.path.isfile(filename):
        # load existing csv file into a pandas DataFrame
        df = pd.read_csv(filename)
        path_name_result = df.loc[df['title'] == path_name, 'info']
        if not path_name_result.empty:
            print('Title already exists.')
            return str(path_name_result.iloc[0])

    else:
        # create empty pandas DataFrame
        df = pd.DataFrame()
        
    data=[]
    link = f"https://www.bing.com/search?q={urllib.parse.quote(path_name)}"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0;Win64) AppleWebkit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.5',
#         'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': link,
        'TE': 'Trailers'
    }

    try:
        if link in cache:
            print("cache found bing")
            response = cache[link]
        else:
            print("cache added bing")
            response = requests.get(link,headers=headers)
            cache[link] = response
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print("An error occurred while making the request:", e)
        exit()

    html_text = response.text
    soup = BeautifulSoup(html_text, 'lxml')
    info = ""
    try:
        info = soup.find('div', class_='l_ecrd_imcolheader_desc').a.p.text
    except AttributeError:
        print("Could not find the information element.")



    ##################### trying something ############################
    if info == "":
        try:
            info = soup.find('div', class_='l_ecrd_a1').span.span.text
            print("info : ", info)
        except AttributeError:
            print("Could not find this information element either.")
    if info == "":
        try:
            info = soup.find('div', class_='l_ecrd_a1').div.span.span.text
            print("info : ", info)
        except AttributeError:
            print("Could not find it once more.")
    ####################################################################

    print("info : ", info)
    if info !="":
        dic['title']=path_name
        dic['info']=info
        data.append(dic)
        df = df.append(data)
        df.to_csv('bing_results.csv',index=False)
        print(df)
    return info