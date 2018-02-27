Vue.component('creature', {
  props: ['side', 'c'],
  data: function() {
    return {
      alignmentData: jsonAlignmentData,
      abilityData: jsonAbilityData,
      skillData: jsonSkillData,
      languages: ['Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'],
      char: this.c
    }
  },
  filters: {
    mod: function(value) {
      var v = Math.floor((value - 10) / 2);
      return v >= 0 ? '+' + v : v;
    }
  },
  computed: {
    saves: function() {
      var s = {}
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        var a = Object.keys(jsonAbilityData)[i];
        if (this.c.saves[a] == false) {
          var v = Math.floor((this.c.abilities[a] - 10) / 2);
          if (this.c.saves[a]) {
            v = v + this.c.pb;
          }
          s[a] = v >= 0 ? '+' + v : v;
        }
        else {
          s[a] = '+' + this.c.saves[a];
        }
      }
      return s;
    },
    skills: function() {
      var ss = {}
      for (var i = 0; i < Object.keys(jsonSkillData).length; i++) {
        var s = Object.keys(jsonSkillData)[i];
        var ra = jsonSkillData[s].rel_ability;
        if (this.c.skills[s] == false) {
          var v = Math.floor((this.c.abilities[ra] - 10) / 2);
          if (this.c.skills[s]) {
            v = v + this.c.pb;
          }
          ss[s] = v >= 0 ? '+' + v : v;
        }
        else {
          ss[s] = '+' + this.c.skills[s]
        }
      }
      return ss;
    }
  },
  template: '<div class="creature">\
    <div class="character-header">\
      <div class="class-icon">\
        <svg><use xlink:href="sprites.svg#creature"></use></svg>\
      </div>\
      <div class="name">\
        <input v-model="c.name" type="text" />\
        <p class="subtitle">{{c.trueName}} ({{c.race}})</p>\
      </div>\
      <button class="flat-btn" @click="clear()">\
        <svg><use xlink:href="sprites.svg#menu"></use></svg>\
      </button>\
    </div>\
    <div class="character-content">\
      <div class="character-section">\
        <button @click="c.showInfo = !c.showInfo" class="character-section-header">\
          <h3>Info</h3>\
          <svg :class="{open: c.showInfo}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showInfo" class="character-section-content">\
          <div class="row">\
            <div class="input-group col-xs-6">\
            <label>Alignment</label>\
            <input v-model="c.alignment" type="text" />\
            </div>\
            <div class="input-group col-xs-6">\
              <label>Size</label>\
              <select v-model="c.size">\
                <option>Tiny</option>\
                <option>Small</option>\
                <option>Medium</option>\
                <option>Large</option>\
                <option>Huge</option>\
                <option>Gargantuan</option>\
              </select>\
            </div>\
            <div class="input-group col-xs-12">\
              <label>Languages</label>\
              <chips :chips="c.languages" :suggestions="languages"></chips>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="character-section">\
        <button @click="c.showCombat = !c.showCombat" class="character-section-header">\
          <h3>Combat</h3>\
          <svg :class="{open: c.showCombat}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showCombat" class="character-section-content">\
          <div class="row">\
            <div class="input-group col-xs-4">\
              <label>Hit Points</label>\
              <input class="hp" v-model="c.currentHP" type="number" /><span>/</span><input class="hp" v-model="c.maxHP" type="number" />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Armor Class</label>\
              <input v-model="c.armorClass" type="number" />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Initiative</label>\
              <input v-model="c.initiative" type="number" />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Speed</label>\
              <input v-model="c.speed" type="text" />\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="character-section">\
        <button @click="c.showStats = !c.showStats" class="character-section-header">\
          <h3>Stats</h3>\
          <svg :class="{open: c.showStats}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showStats" class="character-section-content">\
          <div class="row">\
            <div class="input-group col-xs-6">\
              <label>Challenge Rating</label>\
              <input v-model="c.challengeRating" type="text" readonly />\
            </div>\
            <div class="input-group col-xs-6">\
              <label>Proficiency Bonus</label>\
              <input v-model="c.pb" type="number" />\
            </div>\
          </div>\
          <div class="row">\
            <h4>Abilities</h4>\
            <div class="input-group col-xs-2" v-for="(value, key) in abilityData">\
              <label>{{value.full}}</label>\
              <input v-model="c.abilities[key]" type="number" />\
              <div class="mod"><span>{{c.abilities[key] | mod}}</span></div>\
            </div>\
          </div>\
          <div class="row">\
            <h4>Saves</h4>\
            <div class="input-group col-xs-2" v-for="(value, key) in abilityData">\
              <label>{{value.full}}\
                <div class="prof">{{saves[key]}}<input v-model="c.saves[key]" type="checkbox" disabled /></div>\
              </label>\
            </div>\
          </div>\
          <div class="row">\
            <h4>Skills</h4>\
            <div class="input-group col-xs-2" v-for="(value, key) in skillData">\
              <label>{{value.full}}\
                <div class="prof">{{skills[key]}}<input v-model="c.skills[key]" type="checkbox" disabled /></div>\
              </label>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div v-if="c.specialAbilities" class="character-section">\
        <button @click="c.showSpecialAbilities = !c.showSpecialAbilities" class="character-section-header">\
          <h3>Special Abilites</h3>\
          <svg :class="{open: c.showSpecialAbilities}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showSpecialAbilities" class="character-section-content">\
          <ul class="row action-list">\
            <li v-for="special in c.specialAbilities" class="col-xs-12">\
              <p><b><i>{{special.name}}: </i></b><span v-html="special.desc"></span></p>\
            </li>\
          </ul>\
        </div>\
      </div>\
      <div class="character-section">\
        <button @click="c.showActions = !c.showActions" class="character-section-header">\
          <h3>Actions</h3>\
          <svg :class="{open: c.showActions}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showActions" class="character-section-content">\
          <ul class="row action-list">\
            <li v-for="action in c.actions" class="col-xs-12">\
              <p><b><i>{{action.name}}: </i></b><span v-html="action.desc"></span></p>\
            </li>\
          </ul>\
        </div>\
      </div>\
      <div v-if="c.legendaryActions" class="character-section">\
        <button @click="c.showLegendaryActions = !c.showLegendaryActions" class="character-section-header">\
          <h3>Legendary Actions</h3>\
          <svg :class="{open: c.showLegendaryActions}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showLegendaryActions" class="character-section-content">\
          <ul class="row action-list">\
            <li v-for="action in c.legendaryActions" class="col-xs-12">\
              <p><b><i>{{action.name}}: </i></b><span v-html="action.desc"></span></p>\
            </li>\
          </ul>\
        </div>\
      </div>\
      <div v-if="c.reactions" class="character-section">\
        <button @click="c.showReactions = !c.showReactions" class="character-section-header">\
          <h3>Reactions</h3>\
          <svg :class="{open: c.showReactions}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showReactions" class="character-section-content">\
          <ul class="row action-list">\
            <li v-for="reaction in c.reactions" class="col-xs-12">\
              <p><b><i>{{reaction.name}}: </i></b><span v-html="reaction.desc"></span></p>\
            </li>\
          </ul>\
        </div>\
      </div>\
    </div>\
  </div>',
  methods: {
    clear: function () {
      this.$emit('clear');
    }
  }
});
