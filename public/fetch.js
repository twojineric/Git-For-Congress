var lenBefore = 0;
var lenBefore2 = 0;
var lenBefore3 = 0;
var warning = true;
var ident,commandArr;

async function getLink() {            
    lenBefore2 = 0;
    lenBefore3 = 0;
    clear(lenBefore);
    
    // Get Input Values
    var h1, h2;
    h1 = document.getElementById("head1").value.trim();
    h1 = h1.toLowerCase();
    h1 = h1.split(" ").join("");
    h2 = document.getElementById("head2").value.trim();
    
    // URL Manipulation to get the id
    document.getElementById("head1").addEventListener("input",warnTrue);
    document.getElementById("head2").addEventListener("input",warnTrue);
    document.getElementById("head3").addEventListener("input",warnTrue);
    var h3 = document.getElementById("head3").value.trim();
    if(h1 == "" || h2 == "" || h3 == "") {
        alert("Please fill all the input fields");
        return;
    }
    var pound = h3.indexOf("#");
    var bill = h3.indexOf("/"+h2);
    var cong = h3.indexOf("/"+h1.replace(/\D/g, "")+"/");
    if(pound ==  -1 || bill == -1 || cong == -1) {
        if(warning) {
            alert("Bill and/or congress don't match URL");
            warning = false;
            return;
        }        
    }
    ident = h3.substring(pound+1);

    // Concatenate URL and Inputs
    var url = "https://api.propublica.org/congress/v1/";
    url = url.concat(h2, "/bills/");
    url = url.concat(h1,".json");
    
    lenBefore = document.body.childNodes.length;    

    await fetch(url, {
        headers: {"X-API-Key": "4FGVYsQBIq2xC5fjWcNSMH3QszIi3y6S6BpHjD08"}
    })
    .then(res => res.json())
    .then(function(data) {
        console.log(data);

        if(data.results == null) {
            document.getElementById("p1").innerHTML="Input Valid Bill ex. hr1, 115, " + exURL;
            document.getElementById("p2").innerHTML="";
            return;
        }

        var info = data.results[0].versions;
        var i;
        var element;
        var link;
        let year = data.results[0].latest_major_action_date.split('-')[0];
        document.getElementById("p2").innerHTML="<b>"+data.results[0].bill +
            " Congress " + data.results[0].congress + " - " + year +"<b>";

        // Create buttons
        for(i = 0; i < info.length; i++) {
            var br = document.createElement("br");
            element = document.createElement("button");
            link = document.createTextNode(info[i].status);
            element.appendChild(link);
            element.title = info[i].status;
            element.addEventListener("click",searchSetup,false);
            element.myParam=info[i].url;
            element.yr=year;
            element.id = "elem1";
            element.style.width="150px";
            document.body.appendChild(element);
            document.body.appendChild(br);
        }
    })  
    
    function clear(length) {
        while(length != 0 && document.body.childNodes.length > length) {
            document.body.removeChild(document.body.childNodes[length]);
        }
    }

    function warnTrue() {
        warning = true;
    }

    // Create input box fields and submit button
    async function searchSetup()
    {
        var xml = document.getElementById("elem1").myParam;
        var jXml,uscText;
        clear(lenBefore2);
        lenBefore2 = document.body.childNodes.length;

        element = document.createElement("p");
        
        let j = {
            url: xml,
            id: ident,
            year: document.getElementById("elem1").yr
        };
        await fetch("http://localhost:3000/getxml", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(j)
        })
        .then(resp => resp.json())
        .then(async body => {
            let e = document.createElement('p');
            e.textContent = body.txt;
            jXml = e.textContent;
            if(body.processArr != null) {
                var tempBill = body.processArr[1].substring(3).trim();
                if(body.quote != null) {
                    tempBill = tempBill.concat(":" 
                        + body.quote.substring(1,body.quote.length-1).trim());
                }
                commandArr = [body.processArr[0], tempBill, body.processArr[2], body.processArr[3]];
                console.log(commandArr);
            }
            else {
                alert("Unable to classify changes so no changes will be made to the section.");
            }

            await fetch("http://localhost:3000/getUSC", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body.usc)
            })
            .then(resp => resp.json())
            .then(body => {
                uscText = body.file;
            })
        });

        document.body.appendChild(document.createElement("br"));
        var para1 = document.createElement("p");
        para1.innerHTML = "<b>Input Section with Spaces</b> ex. b 1 a";
        document.body.appendChild(para1);

        var input1 = document.createElement("input");
        input1.type = "text";
        input1.id = "inp1";
        input1.placeholder = "Section";
        document.body.appendChild(input1);
        document.body.appendChild(document.createElement("br"));        

        var button1 = document.createElement("button");
        button1.appendChild(document.createTextNode("Submit"));
        button1.title = "Submit";
        button1.id = "but1";
        button1.myParam = uscText;
        button1.addEventListener("click",search,false);
        document.body.append(button1);
    }

    function search() {
        clear(lenBefore3);
        vals = document.getElementById("inp1").value;
        json = document.getElementById("but1").myParam;
        console.log(json);
        lenBefore3 = document.body.childNodes.length;

        var para1 = document.createElement("p");
        var outNode = document.createElement("pre");
        outNode.innerHTML = parseSectionText();       
        
        var command,target,replaceWith,temp;
        if(commandArr != null) {
            command = commandArr[0];
        }
        else {
            command = -1;
        }

        if(outNode.innerHTML != "Invalid Section Input") {
            para1.innerHTML = `<b>Section ${section}:</b>`;
            document.body.appendChild(para1);
        }
        else {
            command = -1;
        }

        if(command == 0) {
            // Strike and Insert
            replaceWith = commandArr[2];
            target = commandArr[3];
            temp = target;
            temp = temp.strike();
            temp = temp + " " + replaceWith;
            outNode.innerHTML = outNode.innerHTML.replaceAll(target,temp).trim();
        }
        else if (command == 1) {
            // Strike a Section
            origSentence = commandArr[2];
            sentence = origSentence.toLowerCase();
            vals = findSection();
            target = parseSectionText();            
            temp = target.strike();
            outNode.innerHTML = outNode.innerHTML.replace(target,temp).trim();
        }
        else if (command == 2) {
            // Strike a String
            target = commandArr[2];
            replaceWith = target.strike();
            outNode.innerHTML = outNode.innerHTML.replaceAll(target,replaceWith).trim();
        }
        else if (command == 3) {
            // Amend an entire section
            origSentence = commandArr[1];
            sentence = origSentence.toLowerCase();
            vals = findSection();
            target = parseSectionText();
            temp = commandArr[1].substring(commandArr[1].indexOf(":")+1).trim();
            temp = "*Amended*<br>" + temp;
            outNode.innerHTML = outNode.innerHTML.replace(target,temp).trim();
            
        }
        else if (command == 4) {
            // Append new no target
            origSentence = commandArr[1];
            sentence = origSentence.toLowerCase();
            vals = findSection();
            target = parseSectionText();
            replaceWith = commandArr[1].substring(commandArr[1].indexOf(":")+1).trim();
            replaceWith = target + "<br><b>*New Addition*</b><br>"+replaceWith + "<br>";
            outNode.innerHTML = outNode.innerHTML.replace(target,replaceWith).trim();
        }
        else if(command == 5) {
            // Append new target
            origSentence = commandArr[1].substring(commandArr[1].indexOf(")")+1);
            sentence = origSentence.toLowerCase();            
            vals = findSection();
            target = parseSectionText();
            if(outNode.innerHTML == target) {
                replaceWith = commandArr[1].substring(commandArr[1].indexOf(":")+1).trim();
                outNode.innerHTML = outNode.innerHTML.concat("<br><b>*New Addition*</b><br>"+replaceWith).trim();
            }
        }

        document.body.appendChild(outNode);  
    }
}