var lenBefore = 0;
var lenBefore2 = 0;
var lenBefore3 = 0;
var outNode;

function getLink() {
    lenBefore2 = 0;
    lenBefore3 = 0;
    clear(lenBefore);

    // Get Input Values
    var h1, h2;
    h1 = document.getElementById("head1").value.trim();
    h1 = h1.toLowerCase();
    h1 = h1.split(" ").join("");
    h2 = document.getElementById("head2").value.trim();

    // Concatenate URL and Inputs
    var url = "https://api.propublica.org/congress/v1/";
    url = url.concat(h2, "/bills/");
    url = url.concat(h1,".json");
    document.getElementById("p1").innerHTML="<b>Input1:</b> "+h1
        +" <b>Input2:</b> "+h2+" <b>URL:</b> "+url+"<br>";

    lenBefore = document.body.childNodes.length;

    fetch(url, {
        headers: {"X-API-Key": API_KEY}
    })
    .then(res => res.json())
    .then(function(data) {
        //console.log(data);
        if(data.results == null) {
            document.getElementById("p1").innerHTML="Input Valid Bill ex. hr115, 115";
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

    let h3 = document.getElementById('head3').value.trim();

    // Create input box fields and submit button
    async function searchSetup(event)
    {
        var xml = document.getElementById("elem1").myParam;
        var jXml;
        clear(lenBefore2);
        lenBefore2 = document.body.childNodes.length;

        element = document.createElement("p");
        document.body.appendChild(element);

        let j = {
            url: xml,
            id: h3,
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
        .then(body => {
            let e = document.createElement('p');
            e.textContent = body.txt;
            jXml = e.textContent;
            document.body.appendChild(e);

            fetch("http://localhost:3000/getUSC", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body.usc)
            })
            .then(resp => resp.json())
            .then(body => {
                let usc = document.createElement('p');
                usc.textContent = "USC TEXT: \n" + body.file;
                document.body.appendChild(usc);
            })
        });

        document.body.appendChild(document.createElement("br"));
        var para1 = document.createElement("p");
        para1.innerHTML = "<b>Input Section Number</b>";
        document.body.appendChild(para1);

        var input1 = document.createElement("input");
        input1.type = "text";
        input1.id = "inp1";

        // Change this back to 1
        input1.placeholder = "Command";
        document.body.appendChild(input1);
        document.body.appendChild(document.createElement("br"));


        // User input
        var input2 = document.createElement("input");
        input2.type = "text";
        input2.id = "inp2";
        input2.placeholder = "Target";
        document.body.appendChild(input2);
        document.body.appendChild(document.createElement("br"));

        var input3 = document.createElement("input");
        input3.type = "text";
        input3.id = "inp3";
        input3.placeholder = "Replacement";
        document.body.appendChild(input3);
        document.body.appendChild(document.createElement("br"));

        var input4 = document.createElement("input");
        input4.type = "text";
        input4.id = "inp4";
        input4.placeholder = "Dump Text Here";
        document.body.appendChild(input4);
        document.body.appendChild(document.createElement("br"));
        // May delete later


        var button1 = document.createElement("button");
        button1.appendChild(document.createTextNode("Submit"));
        button1.title = "Submit";
        button1.id = "but1";
        button1.myParam = jXml;
        button1.addEventListener("click",search,false);
        document.body.append(button1);
    }

    function search() {
        clear(lenBefore3);
        vals = document.getElementById("inp1").value;
        json = document.getElementById("but1").myParam;
        lenBefore3 = document.body.childNodes.length;

        var para1 = document.createElement("p");
        para1.innerHTML = `<b>Section ${vals}:</b>`;
        document.body.appendChild(para1);
        outNode = document.createElement("p");

        /*
        Uncomment this later
        // updateVariables();
        parseSection();
        */


        var command,target,replaceWith,temp;

        // Take User Input
        command = document.getElementById("inp1").value;
        target = document.getElementById("inp2").value;
        replaceWith = document.getElementById("inp3").value;
        outNode.innerHTML = document.getElementById("inp4").value;
        // May Remove Later

        if(command == 1) {
            // Strike and Insert
            temp = target;
            temp = temp.strike();
            temp = temp + " " + replaceWith;
            outNode.innerHTML = outNode.innerHTML.replaceAll(target,temp);
        }
        else if (command == 2) {
            // Strike a Section
            // Iain's Function to return a section
            temp = "output";
            temp.strike();
            outNode.innerHTML = outNode.innerHTML.replaceAll(target,temp);
        }

        else if (command == 3) {
            // Strike a String
            replaceWith = target.strike();
            outNode.innerHTML = outNode.innerHTML.replaceAll(target,replaceWith);
        }
        else if (command == 4) {
            // Amend an entire section
        }
        else if (command == 5) {
            // Append new no target
        }
        else if (command == 6) {
            // Append new with target
        }

        document.body.appendChild(outNode);
    }
}
