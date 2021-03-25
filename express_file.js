const parseString = require('xml2js').parseString;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/getxml', async function(request, response) {
    let url = request.body.url;
    let id = request.body.id;

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
        if(quoted_block[0] !== undefined)
        {
            qte = '“' + quoted_block[0].textContent + '”';
            text = elem.innerHTML.substring(0, elem.innerHTML.indexOf('<quoted'));
        }

        text = text.replace(new RegExp('<quote>', 'g'), '“').replace(new RegExp('</quote>', 'g'), '”').replace( /(<([^>]+)>)/ig, ' ');
        if(qte) text = text + qte;

        let respJSON = {
            txt: text,
            usc: xref.attributes["parsable-cite"].nodeValue
        }
        response.send(respJSON);
    });
});

app.listen(port, () => {
  console.log(`Express server at http://localhost:${port}`);
});
