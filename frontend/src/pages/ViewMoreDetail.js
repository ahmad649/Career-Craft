import { useState, useEffect } from 'react'

import './../css/viewMoreDetail.css';


const ViewMoreDetail = (props) => {
    
    const [error, setError] = useState('')
    const [job_title,setJobTitle] = useState('')
    const [company_name,setCompanyName] = useState('')
    const [job_description,setJobDescription] = useState('')
    const [skills,setSkills] = useState('')
    const [anchor_link,setAnchorLink] = useState('')
    const [scraper_name,setScraperName] = useState('')
    
    const handleClose = (event) => {
        event.preventDefault();
        props.onClose(event);
    };
    
    function SkillsList({skills}){
        if(!skills) {
            return 
        }

        return (
            <div className="skills_main" id='view-details-main'>
                <h3>skills: </h3>
                <div className='skills_container' id="view-details-skills">
                    {skills.map((skill, index) => (
                        <div key={index}>
                            {/* {index % 5 == 0 && index != 0 && <br />} */}
                            <p className='individual_skill'>{skill}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const handleApply = (event, url) => {
        event.preventDefault();
        window.open(url, '_blank', 'noreferrer')
        // window.location.href = url;
    };

    const getmoredetail = async () =>{

        const response = await fetch('/api/routes/getjobdetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'url': props.thisJob["anchor_link"],
                'scraper_name':props.thisJob["scraper_name"],
            },
        }).then((res) => res.json())

        console.log("more detail response : ", response.data.jobdetail)
        setJobDescription(response.data.jobdetail)

    }



    useEffect(() => {
        setJobTitle(props.thisJob["job_title"])
        setCompanyName(props.thisJob["company_name"])
        setJobDescription(props.thisJob["job_description"])
        setSkills(props.thisJob["skills"])
        setAnchorLink(props.thisJob["anchor_link"])
        setScraperName(props.thisJob["scraper_name"])
        // console.log("more details loaded" , props.thisJob["scraper_name"] , "job:",job)

        getmoredetail()
        
        if(props.thisJob["scraper_name"]=="timesjobs"){

            console.log("run timesjobs scraper")
        }else if(props.thisJob["scraper_name"]=="jooble"){
            console.log("run jooble scraper")
        }


        // here we can prefetch some of the jobs stored in our database and load them to our page
    }, [])


    return (
        <div className="backgroundBlur">
            <div className="mainJobDetail">
                <button className='closeBtnJobDetail' onClick={event => handleClose(event)}> X </button>
                {/* <h2>View More Details here</h2> */}
                {props.thisJob && (
                    // used home.css content here
                    <div className='content'> 
                        <h3 id='view-details-h3'>{job_title}</h3>
                        <h3 id='view-details-h3'>{company_name}</h3>
                        <p className='jd_long'>{job_description}</p>
                        <SkillsList skills={skills}/>

                        {/* <h3>{props.thisJob["job_title"]}</h3>
                        <h3>{props.thisJob["company_name"]}</h3>
                        <p>{props.thisJob["job_description"]}...</p>
                        <SkillsList skills={props.thisJob["skills"]}/> */}
                    </div>
                )}
                <button className='applyBtnJobDetail' onClick={event => handleApply(event,anchor_link)}>Apply</button>

            </div>
        </div>
    );
};

export default ViewMoreDetail;

