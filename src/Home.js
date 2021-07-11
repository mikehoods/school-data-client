import useFetch from './useFetch';
import Programs from './graphs/Programs';
import Race_Ethnicity from './graphs/Race_Ethnicity';
import Demographics from './graphs/Demographics';
import { useState, useEffect } from 'react';

const Home = () => {
    const { data, isLoading, error } = useFetch('https://api.data.gov/ed/collegescorecard/v1/schools/?school.operating=1&id=240444&api_key=297S7932ybwihdF333i2X9RqrCYSABid2X3YqwpF')

    const [name, setName] = useState(null);
    const [alias, setAlias] = useState(null);
    const [website, setWebsite] = useState(null);
    const [city, setCity] = useState(null);
    const [state, setState] = useState(null);
    const [zip, setZip] = useState(null);
    const [students, setStudents] = useState(null);
    const [programs, setPrograms] = useState(null);
    const [raceEthnicity, setRaceEthnicity] = useState(null);
    const [demographics, setDemographics] = useState(null);

    useEffect(() => {
        if (data) {
            setName(data.school.name)
            setAlias(data.school.alias)
            setWebsite(data.school.school_url)
            setCity(data.school.city)
            setState(data.school.state)
            setZip(data.school.zip)
            setStudents(data.latest.student.size)
            setPrograms(data.latest.academics.program_percentage)
            setRaceEthnicity(data.latest.student.demographics.race_ethnicity)
            //restructured for d3 graphing
            setDemographics([
                                { 'name': 'men', 'percentage': data.latest.student.demographics.men },
                                { 'name': 'women', 'percentage': data.latest.student.demographics.women },
                                { 'name': 'first generation', 'percentage': data.latest.student.demographics.first_generation }
                            ])
        }
    }, [data])
    
    return (
        <div className="wrapper">
            {data && <div className="main-div">
                <h1>{name}</h1>
                {alias && <h2>{alias}</h2>}
                <h3>{website}</h3>
                <h3>{city}, {state} {zip}</h3>
                <p>Total No. of Students: {students}</p>

                <Programs programs={programs} />

                <Race_Ethnicity raceEthnicity={raceEthnicity} />

                <Demographics demographics={demographics} />

            </div>}
            <div className='button-div'>
                <button>Save as PDF</button>
                <button>Save as JSON</button>
                <button>Print Page</button>
            </div>   
        </div>
        
     );
}
 
export default Home;