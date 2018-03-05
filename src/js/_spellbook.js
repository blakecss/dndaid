Vue.component('spellbook', {
  // props: ['characters'],
  data: function() {
    return {
      spellData: jsonSpellData,
      classData: jsonClassData,
      levelData: Object.values(jsonSpellData).map(function(v) {
        return v.level;
      }).unique().sort(),
      filterClass: [],
      filterLevel: []
    }
  },
  filters: {
    mod: function(value) {
      var v = Math.floor((value - 10) / 2);
      return v >= 0 ? '+' + v : v;
    }
  },
  methods: {

  },
  template: '<div id="spellbook">\
    <main class="comparisons row">\
      <div class="col-xs-12">\
        <div v-for="(value, key) in spellData">\
        </div>\
      </div>\
    </main>\
    <aside class="spell-filters">\
      <div>\
        <h4>Class</h4>\
        <template v-for="(value, key) in classData">\
          <input v-model="filterClass" :id="key" type="checkbox" />\
          <label :for="key">{{key}}</label>\
        </template>\
      </div>\
      <div>\
        <h4>Level</h4>\
        <template v-for="level in levelData">\
          <input v-model="filterLevel" :id="level" type="checkbox" />\
          <label :for="level">{{level}}</label>\
        </template>\
      </div>\
    </aside>\
  </div>'
});
