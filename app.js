const PORT = process.env.PORT || 3000;
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();


app.get('/', (req, res) => {
    res.json('Welcome To My Climate Change Api');
});

const articles = [];

const newspapers = [
    {
        name: "theguardian",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base: ""
    },
    {
        name: "thetimes",
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base: ""
    },
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/climate-change",
        base: "https://www.telegraph.co.uk"
    },
    {
        name: "bbc",
        address: "https://www.bbc.co.uk/news/science_and_environment",
        base: "https://www.bbc.co.uk"
    },
    {
        name: "es",
        address: "https://www.standard.co.uk/topic/climate-change",
        base: "https://www.standard.co.uk"
    },
    {
        name: "sun",
        address: "https://www.thesun.co.uk/topic/climate-change-environment/",
        base: ""
    },
    {
        name: "dm",
        address: "https://www.dailymail.co.uk/news/climate_change_global_warning/index.html",
        base: ""
    },
    {
        name: "nyp",
        address: "https://www.nypost.com/tag/climate-change/",
        base: ""
    },
    {
        name: "nyt",
        address: "https://www.nytimes.com/tag/international/section/climate",
        base: ""
    },
    {
        name: "latimes",
        address: "https://www.latimes.com/environment/",
        base: ""
    },
    {
        name: "smh",
        address: "https://www.smh.com.ou/environment/climate-change/",
        base: "https://www.smh.com.ou"
    },
    {
        name: "un",
        address: "https://www.un.org/climatechange/",
        base: "https://www.smh.com.ou"
    },
]

newspapers.forEach((newspaper) => {
    axios.get(newspaper.address).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")', html).each(function(){
            const title = $(this).text();
            const url = $(this).attr("href");

            articles.push({
                title,
                url:  newspaper.base + url,
                source: newspaper.name
            });
        });
    }).catch(err => {
        console.log(err)
    });
});


app.get('/news', (req, res) => {
    res.json(articles);
});

app.get('/news/:newspaperId', (req, res) => {
    const newpaperId = req.params.newspaperId;

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newpaperId)[0].address;
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newpaperId)[0].base;
    axios.get(newspaperAddress).then((response) => {
        const html = response.data;

        const $ = cheerio.load(html);

        const singleArticle = [];

        $('a:contains("climate")', html).each(function(){
            const title = $(this).text();
            const url = $(this).attr('href');

            singleArticle.push({
                title,
                url: newspaperBase + url,
                source: newpaperId
            });
        });
        res.json(singleArticle);

    });
});

app.listen(PORT, () => console.log(`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`))
