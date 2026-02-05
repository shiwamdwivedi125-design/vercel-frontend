const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    {
        url: 'https://placehold.co/600x400/orange/white?text=Masala+Dosa',
        filename: 'Masala_Dosa.jpg'
    },
    {
        url: 'https://placehold.co/600x400/brown/white?text=Gulab+Jamun',
        filename: 'Gulab_Jamun.jpg'
    },
    {
        url: 'https://placehold.co/600x400/blue/white?text=Gopal+Dairy',
        filename: 'gopal_dairy.jpg'
    }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
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
    for (const img of images) {
        try {
            const filepath = path.join(__dirname, 'frontend', 'public', 'images', img.filename);
            console.log(`Downloading ${img.filename}...`);
            await downloadImage(img.url, filepath);
            console.log(`Successfully downloaded ${img.filename}`);
        } catch (error) {
            console.error(`Error downloading ${img.filename}:`, error);
        }
    }
};

run();
