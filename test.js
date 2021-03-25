const fetch = require('node-fetch');
const jsdom = require("jsdom");
const fs = require('fs');
const parseString = require('xml2js').parseString;
const { JSDOM } = jsdom;
require('dotenv').config();


getBillHTML("https://www.congress.gov/117/bills/s499/BILLS-117s499is.xml", "id2FA6EB19677248028AA76CDAC5FB9822");
uscToTXT("https://uscode.house.gov/view.xhtml?hl=false&edition=2016&req=granuleid%3AUSC-prelim-title26-section11&num=0");


//goes to the html display of a bill and writes the text to a file.
async function getBillHTML(url, id)
{
    await fetch(url)
    .then(res => res.text())
    .then(body => {
        const { window } = new JSDOM(body, {
            contentType: "text/xml"
        });
        const elem = window.document.getElementById(id);
        let xref = elem.getElementsByTagName('external-xref')[0];

        console.log(elem.outerHTML);
        console.log(xref.attributes["parsable-cite"].nodeValue);
    });
}

async function uscToTXT(url)
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
                    if(node.name == "sourcecredit") return wstream.close();
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
