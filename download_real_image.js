const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    {
        // Reliable Unsplash Image (Indian Curry/Paneer)
        url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop',
        filename: 'pbm_final.jpg'
    }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Handle Redirects if necessary (simple version)
                downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to consume ${url} status code ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(filepath));
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

const run = async () => {
    // Ensure directory exists
    const dir = path.join(__dirname, 'frontend', 'public', 'images');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    for (const img of images) {
        try {
            const filepath = path.join(dir, img.filename);
            console.log(`Downloading ${img.filename} from ${img.url}...`);
            await downloadImage(img.url, filepath);
            console.log(`Successfully downloaded ${img.filename}`);
        } catch (error) {
            console.error(`Error downloading ${img.filename}:`, error);
        }
    }
};

run();
