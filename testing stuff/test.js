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
    let object = json.toLowerCase();
    let section = vals[0].value;

    let location = 'substructure-location';
    for(let i = 0; i < section.length; i++)
    {
        location += '_' + section.charAt(i).toLowerCase();
        /*
        if(i > 0)
            location += '_' + section.charAt(i).toUpperCase();
        else if(i == 0)
            location += '_' + section.charAt(i).toLowerCase();
        else
            location += '_' + section.charAt(i);
        */
    }

    let origLoc = location;
    let index = object.indexOf(location);
    

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

    document.getElementById('test').innerHTML = statement;
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

function findSection(testObj, secNumber)
{
    let currentSection = testObj;
    let finalSection;

    let currentKeys = Object.keys(testObj);
    let currentVals = Object.values(testObj);
    let check = false;

    let returnVal = 0;

    for(let i = 0; i < currentKey.length; i++)
    {
        if(currentKey[i] = 'section')
        {
            currentSection = currentSection[currentKey[i]][i];
            returnVal[currentKey[i]] = curentKey[i];
            for(let j = 0; j < currentSection['section'].length; j++)
            {
                if(currentSection['section'][j]['enum'] == secNumber)
                {
                    
                    return returnVal['sectionNum'] = secNumber;
                }
            }
        }
        else
        {

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

