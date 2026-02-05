const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    { url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop', filename: 'veg_thali.jpg' },
    { url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop', filename: 'dal_chawal.jpg' },
    { url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1000&auto=format&fit=crop', filename: 'seasonal_sabzi.jpg' },
    { url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop', filename: 'pbm_special.jpg' },
    { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop', filename: 'veg_burger.jpg' },
    { url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop', filename: 'veg_pizza.jpg' },
    { url: 'https://images.unsplash.com/photo-1625223007374-ee5061124aa5?q=80&w=1000&auto=format&fit=crop', filename: 'steamed_momos.jpg' },
    { url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop', filename: 'idli_sambar.jpg' },
    { url: 'https://images.unsplash.com/photo-1546833999-23f269a92a54?q=80&w=1000&auto=format&fit=crop', filename: 'dal_makhani_village.jpg' },
    { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop', filename: 'green_salad.jpg' },
    { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop', filename: 'diet_meal_box.jpg' },
    { url: 'https://images.unsplash.com/photo-1606331102148-18e32cb63941?q=80&w=1000&auto=format&fit=crop', filename: 'spring_rolls_village.jpg' },
    { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop', filename: 'chocolate_cake.jpg' },
    { url: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=1000&auto=format&fit=crop', filename: 'masala_chai.jpg' },
    { url: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=1000&auto=format&fit=crop', filename: 'mango_lassi.jpg' },
    { url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=1000&auto=format&fit=crop', filename: 'chocolate_milkshake.jpg' },
    { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop', filename: 'tiffin_service.jpg' },
    { url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop', filename: 'party_order.jpg' }
];

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
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
    const dir = path.join(__dirname, 'frontend', 'public', 'images');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    for (const img of images) {
        try {
            const filepath = path.join(dir, img.filename);
            console.log(`Downloading ${img.filename}...`);
            await downloadImage(img.url, filepath);
            console.log(`Successfully downloaded ${img.filename}`);
        } catch (error) {
            console.error(`Error downloading ${img.filename}:`, error);
        }
    }
    console.log('All downloads completed.');
};

run();
