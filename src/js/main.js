Array.prototype.unique = function() {
  var a = this.concat();
  for (var i=0; i<a.length; ++i) {
    for (var j=i+1; j<a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }
  return a;
};

function roll(odds) {
  // Number
  if (!isNaN(odds)) {
    return Math.floor(Math.random() * odds) + 1;
  }
  // Dice Odds
  else if (Array.isArray(odds[0])) {
    var r = Math.floor(Math.random() * odds[odds.length - 1][1]) + 1;
    for (var i = 0; i < odds.length; i++) {
      if (r >= odds[i][0] && r <= odds[i][1]) {
        if (typeof odds[i][2] === 'function') {
          return odds[i][2]();
        }
        else {
          return odds[i][2];
        }
      }
    }
  }
  // Dice
  else if (/\d+d\d+/.test(odds)) {
    return eval(odds.replace(/\d+d\d+/g, function(match) {
      var d = match.split('d');
      var r = 0;
      for (var i = 0; i < Number(d[0]); i++) {
        r += Math.floor(Math.random() * Number(d[1])) + 1;
      }
      return r;
    }));
  }
  // Array
  else {
    var r = Math.floor(Math.random() * odds.length);
    if (typeof odds[r] === 'function') {
      return odds[r]();
    }
    else {
      return odds[r];
    }
  }
}

function itemize(arr) {
  var itemized = '';
  arr.sort();
  var current = null;
  var cnt = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] != current) {
      if (cnt > 0) {
        itemized += cnt + ' x ' + current + '<br>';
      }
      current = arr[i];
      cnt = 1;
    } else {
      cnt++;
    }
  }
  if (cnt > 0) {
    itemized += cnt + ' x ' + current;
  }
  return itemized;
}

function mod(value) {
  return Math.floor((value - 10) / 2);
}

//=include _town.js
//=include _dungeon.js
//=include _treasure.js
//=include _chips.js
//=include _character-preview.js
//=include _add-character.js
//=include _player.js
//=include _creature.js
//=include _characters.js
//=include _spellbook.js
//=include _world.js

var mainVue = new Vue({
  el: '#main',
  data: {
    slide: 1,
    showSearch: false,
    showMenu: false,
    search: '',
    savedSearch: '',
    focus: 0,
    focused: false,
    suggestions: [],
    loadFile: '',
    slideDirection: 'slide-left',
    characters: [],
    modal: false,
    definitions: jsonDefinitionData.concat(jsonInventoryData).concat(jsonSpellData)
  },
  computed: {
    saveData: function() {
      return encodeURIComponent(JSON.stringify(this.characters));
    },
    saveFile: function() {
      var d = new Date();
      return (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + '.json';
    }
  },
  watch: {
    slide: function(newVal, oldVal) {
      if (newVal > oldVal) {
        this.slideDirection = 'slide-right';
      }
      else {
        this.slideDirection = 'slide-left';
      }
    },
    showSearch: function(newVal) {
      if (newVal == false) {
        this.suggestions = [];
        this.search = '';
      }
    },
    modal: function(newVal) {
      if (newVal) {
        document.body.classList.add('no-scroll');
      }
      else {
        document.body.classList.remove('no-scroll');
      }
    }
  },
  mounted: function() {
    var start = 0;
    var end = 0;
    var characters = this.characters;
    jQuery('.sortable').sortable({
      axis: 'y',
      handle: '.reorder',
      placeholder: 'sortable-placeholder',
      forcePlaceholderSize: true,
      start: function(e, ui) {
        start = ui.item.index();
      },
      stop: function(e, ui) {
        end = ui.item.index();
        characters.splice(end, 0, characters.splice(start, 1)[0]);
      }
    });
  },
  updated: function() {
    if (this.modal && this.modal.name != this.modal.searchName) {
      var hs = document.querySelectorAll('.modal-content h3, .modal-content h4');
      for (var i = 0; i < hs.length; i++) {
        if (hs[i].innerHTML == this.modal.searchName) {
          hs[i].scrollIntoView();
        }
      }
    }
  },
  methods: {
    searchBtn: function() {
      if (this.showSearch) {
        this.doSearch();
        return;
      }
      this.showSearch = true;
      var s = this.$refs.search;
      setTimeout(function() {
        s.focus();
      }, 10);
    },
    getSuggestions: function() {
      this.suggestions = [];
      this.savedSearch = this.search;
      this.focus = 0;
      if (!this.search) {
        return;
      }
      var search = this.search.toLowerCase();
      for (var i = 0; i < this.definitions.length; i++) {
        var def = this.definitions[i];
        if (def.name.toLowerCase().includes(search)) {
          var d = Vue.util.extend({}, def);
          d.searchName = d.name;
          d.searchType = d.type;
          if (def.name.toLowerCase() == search) {
            this.suggestions.unshift(d);
          }
          else {
            this.suggestions.push(d);
          }
        }
        if (def.sections && def.sections.join(',').toLowerCase().includes(search)) {
          for (var ii = 0; ii < def.sections.length; ii++) {
            if (def.sections[ii].toLowerCase().includes(search)) {
              var d = Vue.util.extend({}, def);
              d.searchName = d.sections[ii];
              d.searchType = d.name;
              if (def.sections[ii].toLowerCase() == search) {
                this.suggestions.unshift(d);
              }
              else {
                this.suggestions.push(d);
              }
            }
          }
        }
      }
    },
    doSearch: function() {
      var s = this.search;
      if (/\d+d\d+/.test(s)) {
        this.search = roll(s);
      }
      else if (this.focus) {
        this.modal = this.suggestions[this.focus-1];
      }
      else {
        this.modal = this.suggestions[0];
      }
    },
    suggestionClick: function(i) {
      this.modal = this.suggestions[i];
      this.search = this.suggestions[i].searchName;
      this.focus = i + 1;
    },
    focusUp: function() {
      this.focus--;
      var cel = this.$el.querySelector('.search-bar .suggestions');
      var el = this.$el.querySelector('.search-bar .suggestions li:nth-child(' + this.focus + ') button');
      if (this.focus < 0) {
        this.focus = this.suggestions.length;
        setTimeout(function() {
          cel.scrollTo(0, cel.scrollHeight - cel.offsetHeight);
        }, 10);
      }
      if (this.focus == 0) {
        this.search = this.savedSearch;
      }
      else {
        this.search = this.suggestions[this.focus-1].searchName;
        if (el && el.offsetTop < cel.scrollTop) {
          cel.scrollTo(0, el.offsetTop);
        }
      }
    },
    focusDown: function() {
      this.focus++;
      var cel = this.$el.querySelector('.search-bar .suggestions');
      var el = this.$el.querySelector('.search-bar .suggestions li:nth-child(' + this.focus + ') button');
      if (this.focus > this.suggestions.length) {
        this.focus = 0;
        cel.scrollTo(0, 0);
      }
      if (this.focus == 0) {
        this.search = this.savedSearch;
      }
      else {
        this.search = this.suggestions[this.focus-1].searchName;
        if (el && el.offsetTop + el.offsetHeight > cel.offsetHeight + cel.scrollTop) {
          cel.scrollTo(0, (el.offsetTop + el.offsetHeight) - cel.offsetHeight);
        }
      }
    },
    loadBtn: function() {
      this.showLoad = true;
      this.showMenu = false;
    },
    load: function() {
      this.showMenu = false;
      var c = this;
      var f = this.$refs.uploader.files[0];
      var reader = new FileReader();
      reader.onload = function(event) {
        c.characters = JSON.parse(event.target.result);
        c.showLoad = false;
      };
      reader.readAsText(f);
    },
    help: function() {
      this.modal = {
        "name": "",
        "type": "",
        "desc": "<h4>Dice Rolls</h4><p>You can type any dice roll into the search bar to roll it.<br /><i>Ex. 1d6, 2d20 + 5, 4d8 * 100</i></p>"
      }
    }
  }
});
