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
  var list = getWords(input, 100);
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
