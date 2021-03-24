let json = 0; 
let vals;
document.getElementById('form1').addEventListener('submit', checker);
document.getElementById('inputfile').addEventListener('change', function() {
    var fr = new FileReader();
    fr.onload = function() {
        //document.getElementById('test').textContent = fr.result;
        json = fr.result;
        if(fileName.includes('json'))
            parseSection();
        else
        {
            parseSectionText();
        }
    };
    var fileName = this.files[0].name;
    fr.readAsText(this.files[0]);
});

function parseSectionText()
{
    let object = json;
    let section = vals[0].value;

    let location = 'substructure-location'
    for(let i = 0; i < section.length; i++)
    {
        location += '_' + section.charAt(i);
    }
    let index = object.indexOf(location);
    let nextIndex = object.indexOf('substructure-location', index+1);
    let statement = object.substring(index + location.length, nextIndex);
    document.getElementById('test').textContent = statement;
}
function parseSection()
{
    let object = JSON.parse(json);
    //let section = object['legis-body']['section']['enum'[vals[1].value - 1]];
    
    //format for normal json props
    //var tester = object.bill.$;

    //format for weird array stuff
    //var tester = object.bill['form'][0]['session'][0];

    //let test = JSON.stringify(object);

    let section = vals[0].value;
    //let subsection = vals[1].value;

    /*
    if(subsection != null)
        subsection = subsection.charCodeAt(0) - 97;
    */
    
    let sections = object.bill['legis-body'][0];
    var count = 0;
    for(let i = 0; i < sections['section'].length; i++)
    {
        //console.log(sections['section'][i]['enum'][0]);

        if(sections['section'][i]['enum'] == section + '.')
        {
            var index = i;
        }       
    }

    //console.log(count);
    //console.log(sections['section'].length);
    let tester = object.bill['legis-body'][0]['section'][index];

    /*
    if(tester['subsection'] != null || subsection != null)
    {
        tester = tester['subsection'][subsection];
    }
    */
    document.getElementById('test').textContent = '';

    let values = Object.values(tester);
    
    for(let i = 1; i < values.length; i++)
    {
        if(typeof values[i] != 'object')
            document.getElementById('test').textContent += values[i] + ' ';
        else
        {
            let obj = values[i];
            printingObjects(obj);
        }
    }
}

function printingObjects(testObj)
{
    let testVals = Object.values(testObj);
    let testKeys = Object.keys(testObj);
    for(let i = 0; i < testVals.length; i++)
    {
        if(testKeys[i] == '$')
            continue;
        if(typeof testVals[i] != 'object')
        {
            if(testKeys[i] == 'quote')
                document.getElementById('test').textContent += '"';
            document.getElementById('test').textContent += testVals[i] + ' ';
            if(testKeys[i] == 'quote')
                document.getElementById('test').textContent += '"';
        }
        else
        {
            if(testKeys[i] == 'quote')
                document.getElementById('test').textContent += '"';
            printingObjects(testVals[i]);
            if(testKeys[i] == 'quote')
                document.getElementById('test').textContent += '"';
        }
    }


}

function checker()
{
    event.preventDefault();
    document.getElementById('inputfile').value = null;
    vals = document.getElementById('form1');
}

