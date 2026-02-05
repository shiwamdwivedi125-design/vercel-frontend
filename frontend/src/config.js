const config = {
    // Dynamically detect API URL
    API_URL: import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin),
    UPI_ID: 'shiwamdwivedi@naviaxis'
};

export default config;
