const fetch = require('node-fetch');
const jsdom = require("jsdom");
const fs = require('fs');
const parseString = require('xml2js').parseString;
const { JSDOM } = jsdom;
require('dotenv').config();

//getBill("https://api.govinfo.gov/packages/BILLS-117hr1319enr/htm?api_key=process.env.GOVINFO_KEY");
//textAndLink("https://uscode.house.gov/view.xhtml?hl=false&edition=prelim&req=granuleid%3AUSC-2016-title2-section1954&num=0");
getBillHTML("https://www.govinfo.gov/content/pkg/USCODE-2015-title26/html/USCODE-2015-title26-subtitleA-chap1-subchapA-partII-sec11.htm");
//getBill("http://uscode.house.gov/quicksearch/get.plx?title=26&section=280F");
getXMLURL("hr1", 115);

//gets the url leading to the text of the bill provided. Prints the latest version.
//ex HR 3298 from 115th would be ("hr3298", 115)
async function getXMLURL(billid, congress)
{
    let url = `https://api.propublica.org/congress/v1/${congress}/bills/${billid}.json`
    await fetch(url, {
        headers: {"X-API-Key": process.env.PROPUBLICA_KEY}
    })
    .then(res => res.json())
    .then(body => console.log(body.results[0].versions[0].url));
}

//goes to the html display of a bill and writes the text to a file.
async function getBillHTML(url)
{
    await fetch(url)
    .then(res => res.text())
    .then(body => {
        const { window } = new JSDOM(body);
        const wstream = fs.createWriteStream("./bill.txt");
        const w = window.document.querySelectorAll('*').forEach((node) =>
        {
            let name = node.nodeName;
            if(name == "A" || name == "P" || name == "H4" || name == "SPAN" || name == "B" || name == "H3")
            {
                if(name == 'A')
                {
                    wstream.write(`${node.name}`);
                }
                wstream.write(`${node.textContent}\n`);
            }
        });
    });
}

//takes an xml url and runs it through a json parser, before writing to a file.
async function XMLtoJSON(url)
{
    await fetch(url)
    .then(res => res.text())
    .then(body => {
        console.log(body);
        parseString(body, function (err, result) {
            const wstream = fs.createWriteStream("./uscode.txt");
            wstream.write(JSON.stringify(result));
        });
    });
}
