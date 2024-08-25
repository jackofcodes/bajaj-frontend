import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState({});
    const [error, setError] = useState('');
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);

    const handleJsonInput = (e) => {
        setJsonInput(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            setError('');
            console.log('Input JSON:', jsonInput); // Log the JSON input
            const parsedJson = JSON.parse(jsonInput);
            console.log('Parsed JSON:', parsedJson); // Log the parsed JSON

            if (!parsedJson || !Array.isArray(parsedJson.data)) {
                throw new Error('Invalid JSON structure. The "data" field must be an array.');
            }

            const res = await axios.post('https://my-backend-aamir-cc9e2170a203.herokuapp.com/bfhl' , parsedJson);
            setResponse(res.data);
            setFilterOptions(['Alphabets', 'Numbers', 'Highest lowercase alphabet']);
        } catch (err) {
            setError(`Error: ${err.message}`);
        }
    };

    const handleFilterChange = (e) => {
        setSelectedFilters(Array.from(e.target.selectedOptions, option => option.value));
    };

    const filterResponse = () => {
        if (!response || !response.is_success) return {};

        const filteredData = {};

        if (selectedFilters.includes('Alphabets')) {
            filteredData.alphabets = response.alphabets;
        }
        if (selectedFilters.includes('Numbers')) {
            filteredData.numbers = response.numbers;
        }
        if (selectedFilters.includes('Highest lowercase alphabet')) {
            filteredData.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
        }

        return filteredData;
    };

    return (
        <div className="App">
            <h1>Your Roll Number</h1> {/* Replace with your roll number */}
            <textarea
                value={jsonInput}
                onChange={handleJsonInput}
                placeholder='Enter JSON'
                rows={5}
                cols={40}
            />
            <button onClick={handleSubmit}>Submit</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {filterOptions.length > 0 && (
                <div>
                    <h2>Select Filters:</h2>
                    <select multiple onChange={handleFilterChange}>
                        {filterOptions.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {Object.keys(response).length > 0 && (
                <div>
                    <h2>Filtered Response:</h2>
                    <pre>{JSON.stringify(filterResponse(), null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
