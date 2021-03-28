let json,vals,section,sentence,origSentence;


function parseSectionText()
{
    let object = json;

    // Any delimiters work and 1st and 3rd characters are case insensitive
    section = vals.trim().split(",").join("_").split(" ").join("_");
    if(section.length > 5) {
        section = section.charAt(0).toLowerCase() + section.substring(1,4) 
            + section.charAt(4).toUpperCase() + section.slice(5);
    }
    else if(section.length == 5) {
        section = section.charAt(0).toLowerCase() + section.substring(1,4) 
            + section.charAt(4).toUpperCase();
    }
    else if(section.length > 1) {
        section = section.charAt(0).toLowerCase() + section.slice(1);
    }
    else if(section.length == 1) {
        section = section.toLowerCase();
    }

    let location = 'substructure-location' + "_" + section;


    let origLoc = location;
    let index = object.indexOf(location);
    if(index == -1) {
        return "Invalid Section Input";
    }

    let nextIndex = object.indexOf(location, index+1);
    let statement = '';
    while(object.indexOf(origLoc, index+1) != -1 && object.charAt(object.indexOf(origLoc, index+1) + origLoc.length) == '_')
    {
        statement += json.substring(index + location.length, nextIndex);
        index = nextIndex;
        location = object.substring(index, object.indexOf('(', index+1));
        nextIndex = object.indexOf(origLoc, index+1);
    }
    

    nextIndex = json.indexOf('substructure-location', index+1);
    if(nextIndex == -1)
    {
        nextIndex = object.indexOf('sourcecredit');
    }
    
    statement += json.substring(index + location.length, nextIndex);

    return statement.trim();
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
    
    findSection(sections, section);

    /*
    if(sections['title'])
    {
        for(let i = 0; i < sections['title'].length; i++)
        {
            let titleSections = sections['title'][i];
            for(let j = 0; j < titleSections['section'].length; j++)
            {
                if(titleSections['section'][j]['enum'] == section + '.')
                {
                    var index = j;
                    var titleNum = i;
                }    
            }   
        }
    }
    else
    {
        for(let i = 0; i < sections['section'].length; i++)
        {
            //console.log(sections['section'][i]['enum'][0]);

            if(sections['section'][i]['enum'] == section + '.')
            {
                var index = i;
            }       
        }
    }
*/

    //console.log(count);
    //console.log(sections['section'].length);
    let tester;
    if(sections['title'])
    {
        tester = object.bill['legis-body'][0]['title'][titleNum]['section'][index];
    }
    else
    {
        let tester = object.bill['legis-body'][0]['section'][index];
    }

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

function findSection()
{
    //let sentence = vals[1].value.toLowerCase();
    //let origSentence = vals[1].value;

    let startInd = sentence.indexOf('(');
    let endInd = sentence.indexOf(')');
    let currentInd = startInd;

    while(endInd < sentence.length)
    {
        if(sentence.charAt(endInd+1) == '(')
        {
            currentInd = endInd+1;
            endInd = sentence.indexOf(')', currentInd);
        }
        else
        {
            break;
        }
    }
    let code = origSentence.substring(startInd, endInd);

    code = code.replaceAll('(', '');
    code = code.replaceAll(')', '_');
    
    return code;
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
