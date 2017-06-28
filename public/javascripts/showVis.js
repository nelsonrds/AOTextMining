$( "#btn1" ).click(function() {
  
  $.ajax({
    url: "/Twitter/getDataFromWords",
    type: "POST",
    data: {word: $('#word').val()},
    success: function(data) {
      visInput(data);
    }
  });

  function visInput(data) {
    var idIncremented = 1;
    var items = data.map(function(obj) {
      var auxObj = {};
      auxObj.id = idIncremented;
      auxObj.content = "<img src="+obj.user.img+">    "
      auxObj.content += obj.text;
      //console.log(auxObj.content);
      auxObj.start = obj.date;
      idIncremented++;
      return auxObj;
    })

    $('#visualization').html('');
    
    var container = document.getElementById('visualization');
    var options = {autoResize: true};
    var timeline = new vis.Timeline(container, items, options);
    
  }
});