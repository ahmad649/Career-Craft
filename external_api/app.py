from flask import Flask, request, jsonify
from timesjobs_scraper import job_search_timesjobs
from jooble_scraper import job_search_jooble
from mustakbil_scraper import job_search_mustakbil
from glassdoor_scraper import job_search_glassdoor
from bayt_scraper import job_search_bayt
from trabajo_scraper import job_search_trabajo
from trabajo_details import job_detail_trabajo
from timesjobs_details import job_detail_timesjobs
from jooble_details import job_detail_jooble
from mustakbil_details import job_detail_mustakbil
from glassdoor_details import job_detail_glassdoor
from bayt_details import job_detail_bayt
from careerpathModel import getCareerPaths
from bing_scraper import getPathInfo
import random
from concurrent.futures import ThreadPoolExecutor
import pandas as pd
import threading
from flask_cors import CORS


app = Flask(__name__)
cors = CORS(app)

try:
    data = pd.read_csv('Zero_free.csv')
except Exception as e:
    print(f"Error reading CSV file: {e}")
    data = None

def jobsearch_1(keyword, location):
    return job_search_timesjobs(keyword, location)

def jobsearch_2(keyword, location):
    return job_search_jooble(keyword, location)

def jobsearch_3(keyword, location):
    return job_search_mustakbil(keyword, location)

def jobsearch_4(keyword, location):
    return job_search_glassdoor(keyword, location)

def jobsearch_5(keyword,location):
    return job_search_bayt(keyword, location)

def jobsearch_6(keyword,location):
    return job_search_trabajo(keyword, location)

def search_jobs(keyword, location):
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = executor.map(lambda f: f(keyword, location), [jobsearch_1, jobsearch_3, jobsearch_4, jobsearch_5, jobsearch_6])
        all_jobs =  [job for jobs in results for job in jobs]    # if we had just returned results . we would then need to iterate over each job since output was a generator object of the executer. syntax like this, we flatten the results into a list.
        random.shuffle(all_jobs)
        return all_jobs
    
    #     t1 = threading.Thread(target=jobsearch_1)
    #     t2 = threading.Thread(target=jobsearch_2)
    #     t3 = threading.Thread(target=jobsearch_3)
    #     t1.start()
    #     t2.start()
    #     t3.start()
    #     t1.join()
    #     t2.join()
    #     t3.join()


@app.route('/jobsearch', methods=['GET'])
def jobsearch():
    keyword = request.args.get('keyword')
    location = request.args.get('location')

    jobs = search_jobs(keyword, location)

    return jsonify({'jobs': jobs})


@app.route('/jobdetail', methods=['GET'])
def jobdetail():
    url = request.args.get('url')
    scrapername = request.args.get('scraper_name')

    if scrapername == 'timesjobs':
        jobdetail = job_detail_timesjobs(url)
    elif scrapername == 'jooble':
        jobdetail = job_detail_jooble(url)
    elif scrapername == 'mustakbil':
        jobdetail = job_detail_mustakbil(url)
    elif scrapername == 'glassdoor':
        jobdetail = job_detail_glassdoor(url)
    elif scrapername == 'bayt':
        jobdetail = job_detail_bayt(url)
    elif scrapername == 'trabajo':
        jobdetail = job_detail_trabajo(url)

    
    else:
        return jsonify({'error': 'Invalid scraper name'}), 400

    if jobdetail is None:
        return jsonify({'error': 'Invalid URL'}), 404

    response = jsonify({'jobdetail': jobdetail})
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response

@app.route('/careerpathdetail', methods=['GET'])
def pathdetail():
    path_name = request.args.get('path_name')
    info = getPathInfo(path_name)
    return jsonify({'info': info})

@app.route('/careerpathprediction', methods=['GET'])
def pathprediction():
    skills = request.args.get('skills')
    paths = getCareerPaths(skills, data)
    # return jsonify({'paths': paths})
    return paths

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)
