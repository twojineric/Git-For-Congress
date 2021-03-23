var nodesAdded = 0;
var lenBefore = 0;

function getLink() {            
    clear();
    nodesAdded = 0;
    
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
        nodesAdded = info.length;
        document.getElementById("p2").innerHTML="<b>"+data.results[0].bill + 
            " Congress " + data.results[0].congress+"<b>";

        // Create hyperlinks
        for(i = 0; i < info.length; i++) {
            var br = document.createElement("br");
            element = document.createElement("a");
            link = document.createTextNode(info[i].status);
            element.appendChild(link);
            element.title = info[i].status;
            element.href = info[i].url;
            element.target = "_blank";
            element.appendChild(br);
            document.body.appendChild(element);
        }
    })     
    
    function clear() {
        var i;
        for(i = 0; i < nodesAdded; i++) {
            document.body.removeChild(document.body.childNodes[lenBefore]);
        }
    }
}