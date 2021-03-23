let json = 0; 
let vals;
document.getElementById('form1').addEventListener('submit', checker);
document.getElementById('inputfile').addEventListener('change', function() {
    var fr = new FileReader();
    fr.onload = function() {
        //document.getElementById('test').textContent = fr.result;
        json = fr.result;
        parseSection();
    };

    fr.readAsText(this.files[0]);
});


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
    
    let tester = object.bill['legis-body'][0]['section'][section-1];

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

