const config = {
    // Dynamically detect API URL
    API_URL: window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin,
    UPI_ID: 'shiwamdwivedi@naviaxis'
};

export default config;
