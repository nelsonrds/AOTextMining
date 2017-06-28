$( "#btn2" ).click(function() {
    $.ajax({
        url: "/Twitter/getDataFromWords",
        type: "POST",
        data: {word: $('#word').val()},
        success: function(data) {
            netInput(data);
        }
    });

    function netInput(data) {

        var idIncremented = 1;
        var finalArray = [];
        var finalEdges = [];

        var items = data.map(function(obj) {
            var newString = obj.text.split(/\s+/);
            newString.map(function(obj2, index) {
                if (checkWord(obj2)) {

                    var resultofAddPipe = addPipe(obj2,index,idIncremented);
                    if (!(Object.keys(resultofAddPipe).length === 0 && resultofAddPipe.constructor === Object)) {
                        finalEdges.push(resultofAddPipe);
                    } 

                    var auxObj = {};
                    auxObj.id = idIncremented;
                    auxObj.label = obj2;
                    finalArray.push(auxObj);

                    idIncremented++
                }
            })
        });

        var nodes = new vis.DataSet(finalArray);
        var edges = new vis.DataSet(finalEdges);

        // create a network
        var container = document.getElementById('mynetwork');
        var data = {
            nodes: nodes,
            edges: edges
        };
        
        var options = {};
        var network = new vis.Network(container, data, options);
    }
});

function checkWord(word) {
    words = ["por", "da", "a", "de", "por", "to", ".", "and","se", "e", "PM","o", ":", "na", "que", "el"]
    result = true;

    words.map(function(w1) {
        if (w1==word) {
            result=false
        }
    });
    return result;
}

function addPipe(word,index,idIncremented) {
    var objAux = {};
    if (index!=0) {
        objAux.from = idIncremented-1;
        objAux.to = idIncremented;
    }
    return objAux;
}