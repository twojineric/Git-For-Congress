const parseString = require('xml2js').parseString;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const classify = require("./classify.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/getxml', async function(request, response)
{
    console.log("getting XML");
    let url = request.body.url;
    let id = request.body.id;
    let yr = request.body.year;

    await fetch(url)
    .then(res => res.text())
    .then(body => {
        const { window } = new JSDOM(body, {
            contentType: "text/xml"
        });
        const elem = window.document.getElementById(id);
        let xref = elem.getElementsByTagName('external-xref')[0];
        let qte;
        let text = elem.innerHTML;
        //get quoted block and isolate the text
        let quoted_block = elem.getElementsByTagName('quoted-block');
        if(quoted_block[0] !== undefined) //if there is a large quoted block chunk, isolate it here
        {
            qte = '“' + quoted_block[0].textContent + '”';
            text = elem.innerHTML.substring(0, elem.innerHTML.indexOf('<quoted'));
        }
        //remove all other tags except quotes.
        text = text.replace(new RegExp('<quote>', 'g'), '“').replace(new RegExp('</quote>', 'g'), '”').replace( /(<([^>]+)>)/ig, ' ');
        let arr = classify.handleMessage(text.trim());
        let uscode = xref.attributes["parsable-cite"].nodeValue.split('/');  //in the form usc/TITLE#/SECTION#
        let respJSON = {
            txt: text.trim(),
            quote: qte,
            processArr: arr,
            usc: { title: uscode[1], section: uscode[2], year: yr }
        }
        response.send(respJSON);
    });
});

app.post('/getUSC', async function (request, response)
{
    let usc_title = request.body.title;
    let usc_section = request.body.section;
    let year = request.body.year

    if(year > 2020) year = "prelim";
    else year = year - 1;

    let url = `https://uscode.house.gov/view.xhtml?req=(title:${usc_title}%20section:${usc_section}%20edition:${year})`
    console.log("getting US Code " + url);
    await fetch(url)
    .then(res => res.text())
    .then(body => {
        const { window } = new JSDOM(body);
        let finStr = "";
        const w = window.document.querySelectorAll('*');
        for(const node of w)
        {
            let name = node.nodeName;
            if(name == "A" || name == "P" || name == "H4" || name == "SPAN" || name == "H3")
            {
                if(name == 'A')
                {
                    if(node.name == "sourcecredit") break;
                    finStr = finStr + `${node.name}\n`;
                }
                finStr = finStr + `${node.textContent}\n`;
            }
        }
        finStr = finStr + "sourcecredit";
        response.send({file: finStr});
    });
});

app.listen(port, () => {
  console.log(`Express server at http://localhost:${port}`);
});
