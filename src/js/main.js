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
  // Dice
  else if (/\d+d\d+/.test(odds)) {
    return eval(odds.replace(/\d+d\d+/g, function(match) {
      var d = match.split('d');
      console.log(d[0] + ' ' + d[1]);
      var r = 0;
      for (var i = 0; i < Number(d[0]); i++) {
        r += Math.floor(Math.random() * Number(d[1])) + 1;
      }
      return r;
    }));
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
        itemized += cnt + ' x ' + current + '\n';
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
//=include _world.js

var mainVue = new Vue({
  el: '#main',
  data: {
    slide: 1,
    showSearch: false,
    showMenu: false,
    search: '',
    showLoad: false,
    loadFile: '',
    slideDirection: 'slide-left',
    characters: []
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
    }
  },
  methods: {
    searchBtn: function() {
      this.showSearch = true;
      var s = this.$refs.search;
      setTimeout(function() {
        s.focus();
      }, 10);
    },
    doSearch: function() {
      var s = this.search;
      if (/\d+d\d+/.test(s)) {
        this.search = roll(s);
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
    }
  }
});

var start = 0;
var end = 0;
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
    mainVue.$children[0].$children[0].characters.splice(end, 0, mainVue.$children[0].$children[0].characters.splice(start, 1)[0]);
  }
});
