const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    apps: [
        {
            name: 'kol-letsviet',
            script: 'npm',
            args: 'start',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '300M',
            env: {
                NODE_ENV: process.env.NODE_ENV,
                APP_KEY: process.env.APP_KEY,
                APP_URL: process.env.SITE_URL,
                API_URL: process.env.API_URL
            }
        }
    ]
};
