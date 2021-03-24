var nodesAdded = 0;
var lenBefore = 0;

function getLink() {            
    clear();
    
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
            element.addEventListener("click",search,false);
            element.myParam=info[i].url;
            element.style.width='150px';
            document.body.appendChild(element);
            document.body.appendChild(br);
        }
    })     
    
    function clear() {
        while(lenBefore != 0 && document.body.childNodes.length > lenBefore) {
            document.body.removeChild(document.body.childNodes[lenBefore]);
        }
    }

    function search(event) {
        var xml = event.currentTarget.myParam;
        
        
        
        /*
        fetch(xml, {mode : 'no-cors'})
        .then(res => res.text())
        .then(function(data) {
            var json = xmlToJson(new DOMParser().parseFromString(data, 'text/xml'));
            console.log(json);
        })

        document.getElementById("p3").innerHTML=xml;
        */
    }
}