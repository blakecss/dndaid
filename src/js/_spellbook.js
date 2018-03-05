Vue.component('spellbook', {
  // props: ['characters'],
  data: function() {
    return {
      spellData: jsonSpellData,
      classData: [].concat.apply([], jsonSpellData.map(function(v) {
        v = v.class.split(',');
        v = v.map(function(vv) {
          return vv.trim();
        });
        return v;
      })).unique().sort(),
      levelData: jsonSpellData.map(function(v) {
        return v.level;
      }).unique().sort(),
      schoolData: jsonSpellData.map(function(v) {
        return v.school;
      }).unique().sort(),
      filterClass: [],
      filterLevel: [],
      filterSchool: []
    }
  },
  filters: {
    mod: function(value) {
      var v = Math.floor((value - 10) / 2);
      return v >= 0 ? '+' + v : v;
    }
  },
  computed: {
    filteredSpells: function() {
      var t = this;
      return jsonSpellData.filter(function(v) {
        if (t.filterClass.length) {
          for (var i = 0; i < t.filterClass.length; i++) {
            if (v.class.includes(t.filterClass[i])) {
              return true;
            }
          }
        }
        if (t.filterLevel.length && t.filterLevel.includes(v.level)) {
          return true;
        }
        if (t.filterSchool.length && t.filterSchool.includes(v.school)) {
          return true;
        }
        if (t.filterClass.length || t.filterLevel.length || t.filterSchool.length) {
          return false;
        }
        return true;
      });
    }
  },
  template: '<div id="spellbook">\
    <div class="container row">\
      <aside class="col-md-3">\
        <div class="spell-filters">\
          <div>\
            <h4>Class</h4>\
            <ul>\
              <li v-for="klass in classData">\
                <input v-model="filterClass" :id="klass" :value="klass" type="checkbox" />\
                <label :for="klass">{{klass}}</label>\
              </li>\
            </ul>\
          </div>\
          <div>\
            <h4>Level</h4>\
            <ul>\
              <li v-for="level in levelData">\
                <input v-model="filterLevel" :id="level" :value="level" type="checkbox" />\
                <label :for="level">{{level}}</label>\
              </li>\
            </ul>\
          </div>\
          <div>\
            <h4>School</h4>\
            <ul>\
              <li v-for="school in schoolData">\
                <input v-model="filterSchool" :id="school" :value="school" type="checkbox" />\
                <label :for="school">{{school}}</label>\
              </li>\
            </ul>\
          </div>\
        </div>\
      </aside>\
      <main class="spells col-xl-8 col-xl-offset-1 col-md-9">\
        <div v-for="spell in filteredSpells">\
          <div class="card spell-card">\
            <div>\
              <h3>{{spell.name}}</h3>\
              <p class="subtitle">{{spell.level}} {{spell.school}} ({{spell.class}})</p>\
            </div>\
            <div>\
              <span v-html="spell.desc"></span>\
              <span v-if="spell.higher_level" class="higher-level" v-html="spell.higher_level"></span>\
            </div>\
            <div>\
              <div class="row no-padding">\
                <div class="col-sm-6">\
                  <p><b>Casting Time: </b>{{spell.casting_time}}</p>\
                  <p><b>Range: </b>{{spell.range}}</p>\
                  <p><b>Ritual: </b>\
                    <svg v-if="spell.ritual" class="yes"><title>Yes</title><use xlink:href="sprites.svg#checkmark"></use></svg>\
                    <svg v-else class="no"><title>No</title><use xlink:href="sprites.svg#close"></use></svg>\
                  </p>\
                </div>\
                <div class="col-sm-6">\
                  <p><b>Duration: </b>{{spell.duration}}</p>\
                  <p><b>Components: </b>{{spell.components}}</p>\
                  <p v-if="spell.material"><b>Material: </b>{{spell.material}}</p>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      </main>\
    </div>\
  </div>'
});
