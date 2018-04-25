$(document).ready(function() {
    $("#input").focus();
    var input = GetQueryString("input");
    if (input != null) {
        $('#input').val(input);
        Run();
    }
    $('#submit').click(function() {
        Run();
    });
    $("#input").on('keypress', function(e) {
        if (e.ctrlKey && e.which == 13) {
            Run();
        }
    });
});

function Run() {
  $('#editor_holder').html("<h4>loading...</h4>");
  $("#visual").html("<h4>loading...</h4>");
  var input = $('#input').val().trim();
  var m = pullword(input);
  //console.log(m);
  var list = [];
  for (var k in m) {
    list.push([k.split(" ").join(""),
      {score:m[k].score,freq:m[k].freq,poly:m[k].poly,flex:m[k].flex}]);
  }
  list.sort(function(b, a) {
    return a[1].score - b[1].score;
  });
  //console.log(list);
  list = list.slice(0, 100);
  $('#editor_holder').jsonview(list);
  visual(list);
}

function td(v) {
  return '<td>'+v.toFixed(5)+'</td>';
}

function visual(docs) {
    var html = '<table class="table"><tr><th>word</th><th>score</th><th>freq</th><th>poly</th><th>flex</th></tr>';
    for (var i = 0; i < docs.length; ++i) {
        html += '<tr><td>'+docs[i][0]+'</td>'+td(docs[i][1].score)+td(docs[i][1].freq)+td(docs[i][1].poly)+td(docs[i][1].flex)+'</tr>';
    }
    html += '</table>';
    $("#visual").html(html);
}
