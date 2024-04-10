const CONFIG = {

    JWT_SECRET: process.env.JWT_SECRET || "https://secureinbox.me",

    DATABASE: {
     
        URL: process.env.DATABASE_URL || "postgresql://postgres:sagarpass@localhost:5432/bikerent?schema=public",
    }
};

module.exports = CONFIG;
