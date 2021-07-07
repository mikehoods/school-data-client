import useFetch from './useFetch';
import { useState, useEffect } from 'react';

const Home = () => {
    const { data, isLoading, error } = useFetch('https://api.data.gov/ed/collegescorecard/v1/schools/?school.operating=1&id=240444&api_key=297S7932ybwihdF333i2X9RqrCYSABid2X3YqwpF')

    const [schoolData, setSchoolData] = useState(null); 
    
    useEffect(() => {
        console.log(data)
        if (data) {
            setSchoolData(...data)
        }
    }, [data])
    
    return (
        <div className="wrapper">
            {schoolData && <div className="main-div">
                <h1>{schoolData.school.name}</h1>
                {schoolData.school.alias && <h2>{schoolData.school.alias}</h2>}
                <h3>{schoolData.school.school_url}</h3>
                <h3>{schoolData.school.city}, {schoolData.school.state} {schoolData.school.zip}</h3>
                <p>Total No. of Students: {schoolData.latest.student.size}</p>
                <p>Program Percentage:</p>
                {Object.keys(schoolData.latest.academics.program_percentage).map((item, i) => (
                    schoolData.latest.academics.program_percentage[item] !== 0 && <p key={i}>{i + 1} {item}: {schoolData.latest.academics.program_percentage[item]}</p>
                ))}
                <p>Race Ethnicity:</p>
                {Object.keys(schoolData.latest.student.demographics.race_ethnicity).map((item, i) => (
                    schoolData.latest.student.demographics.race_ethnicity[item] && <p key={i}>{i + 1} {item}: {schoolData.latest.student.demographics.race_ethnicity[item]}</p>
                ))}
                <h3>***Graph of Choice Data***</h3>
            </div>}
            <button>Save as PDF</button>
            <button>Save as JSON</button>
            <button>Print Page</button>
        </div>
        
     );
}
 
export default Home;