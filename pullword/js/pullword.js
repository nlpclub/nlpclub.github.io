/**
 * Pullword: A unsupervised method for New Word Detection, as described in
 *            http://www.matrix67.com/blog/archives/5044
 * =============================================================================
 *
 *
 * @author liang@zliu.org
 * @license MIT
 */

 (function (global) {
  'use strict';
  var Pullword = {
    pullword: function(input) {
      var sentences = Unistring.getSentences(input);
      var total = 0;
      var m = {};
      for (var i = 0; i < sentences.length; i++) {
        var ret = Pullword.getNGram(1, 5, sentences[i].text);
        if (ret === false) continue;
        total += ret.cnt;
        for (var k in ret.dict) {
          if (m[k] == undefined) {
            m[k] = ret.dict[k];
          } else {
            m[k].freq += ret.dict[k].freq;
            for (var w in ret.dict[k].left) {
              if (m[k].left[w] == undefined) {
                m[k].left[w] = ret.dict[k].left[w];
              } else {
                m[k].left[w] += ret.dict[k].left[w];
              }
            }
            for (var w in ret.dict[k].right) {
              if (m[k].right[w] == undefined) {
                m[k].right[w] = ret.dict[k].right[w];
              } else {
                m[k].right[w] += ret.dict[k].right[w];
              }
            }
          }
        }
      }
      // process m

      for (var k in m) { // calculate freq
        m[k].freq = m[k].freq / total * k.split(" ").length;
      }
      for (var k in m) { // calculate poly and flex
        var terms = k.split(" ");
        var n = terms.length;
        if (n <= 1) {
          m[k].poly = 1;
        } else {
          var max = 0;
          for (var i = 1; i < n; i++) {
            var sub1 = terms.slice(0, i).join(" ");
            var sub2 = terms.slice(i).join(" ");
            if (m[sub1] == undefined || m[sub2] == undefined) {
              console.log(sub1, sub2);
              continue;
            }
            var s = m[sub1].freq * m[sub2].freq;
            if (s > max) max = s;
          }
          if (max > 0) {
            m[k].poly = m[k].freq / max;
          } else {
            m[k].poly = 1;
          }
        }

        m[k].flex = Math.min(Pullword.entropy(m[k].left),
          Pullword.entropy(m[k].right));
        m[k].score = m[k].freq * m[k].poly * m[k].flex;
      }
      return m;
    },

    entropy: function(m) {
      if (m.length == 0) return 1;
      var total = 0, e = 0, p;
      for (var k in m) {
        total += m[k];
      }
      for (var k in m) {
        if (m[k] != 0) {
          p = m[k] / total;
          e -= p * Math.log(p);
        }
      }
      return e;
    },

    getNGram: function(min, max, s) {
      if (min < 0 || max < 0 || min > max) return false;
      var tokens = Unistring.getWords(s);
      var words = [];
      for (var i = 0; i < tokens.length; i++) {
        words.push(tokens[i].text);
      }
      var dict = {};
      for (var i = 0; i < words.length; i++) {
        for (var j = min; j <= max; j++) {
          if (i+j > words.length) break;
          var k = words.slice(i, i+j).join(" ");
          if (dict[k] == undefined) {
            dict[k] = {freq:0,poly:0,flex:0,score:0,left:{},right:{}};
          }
          dict[k].freq++;
          if (i > 0) {
            if (dict[k].left[words[i-1]] == undefined) {
              dict[k].left[words[i-1]] = 1;
            } else {
              dict[k].left[words[i-1]]++;
            }
          }
          if (i+j < words.length) {
            if (dict[k].right[words[i+j]] == undefined) {
              dict[k].right[words[i+j]] = 1;
            } else {
              dict[k].right[words[i+j]]++;
            }
          }
        }
      }
      return {cnt: words.length, dict: dict};
    },

    getWords: function(input, num) {
      var m = Pullword.pullword(input);
      //console.log(m);
      var list = [];
      for (var k in m) {
        if (m[k].score <= 0) continue;
        list.push([k.split(" ").join(""),
          {score:m[k].score,freq:m[k].freq,poly:m[k].poly,flex:m[k].flex}]);
      }
      list.sort(function(b, a) {
        return a[1].score - b[1].score;
      });
      //console.log(list);
      list = list.slice(0, num);
      return list;
    }
  };

  // exporting
  if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
    module.exports = Pullword;
  }
  else {
    global.Pullword = Pullword;
  }

})(this);
