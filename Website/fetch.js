var lenBefore = 0;
var lenBefore2 = 0;
var lenBefore3 = 0;
var outNode;

function getLink() {            
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
        console.log(data);

        if(data.results == null) {
            document.getElementById("p1").innerHTML="Input Valid Bill ex. HR 116, 115";
            document.getElementById("p2").innerHTML="";
            return;
        }

        var info = data.results[0].versions;
        var i;
        var element;
        var link;
        document.getElementById("p2").innerHTML="<b>"+data.results[0].bill + 
            " Congress " + data.results[0].congress+"<b>";

        // Create buttons
        for(i = 0; i < info.length; i++) {
            var br = document.createElement("br");
            element = document.createElement("button");
            link = document.createTextNode(info[i].status);
            element.appendChild(link);
            element.title = info[i].status;
            element.addEventListener("click",searchSetup,false);
            element.myParam=info[i].url;
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

    // Create input box fields and submit button
    async function searchSetup(event) {
        var xml = event.currentTarget.myParam;
        var jXml;
        clear(lenBefore2);
        lenBefore2 = document.body.childNodes.length;

        let j = { url: xml };
                console.log(j);
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
                    e.textContent = JSON.stringify(body.file.bill);
                    jXml = e.textContent;
                });

        document.body.appendChild(document.createElement("br"));
        var para1 = document.createElement("p");
        para1.innerHTML = "<b>Input Section Number</b>";
        document.body.appendChild(para1);

        var input1 = document.createElement("input");
        input1.type = "text";
        input1.id = "inp1";
        input1.placeholder = "1";
        document.body.appendChild(input1);
        document.body.appendChild(document.createElement("br"));

        var button1 = document.createElement("button");
        button1.appendChild(document.createTextNode("Submit"));
        button1.title = "Submit";
        button1.myParam = jXml;
        button1.addEventListener("click",search,false);
        document.body.append(button1);
    }

    function search() {
        clear(lenBefore3);
        vals = document.getElementById("inp1").value;
        json = event.currentTarget.myParam;
        lenBefore3 = document.body.childNodes.length;

        var para1 = document.createElement("p");
        para1.innerHTML = `<b>Section ${vals}:</b>`;
        document.body.appendChild(para1);

        outNode = document.createElement("p");
        parseSection();
        document.body.appendChild(outNode);  
    }
}