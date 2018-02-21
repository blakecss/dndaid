Vue.component('creature', {
  props: ['side', 'c'],
  data: function() {
    return {
      alignments: jsonAlignmentData,
      abilities: jsonAbilityData,
      skills: jsonSkillData,
      char: this.c
    }
  },
  filters: {
    mod: function(value) {
      return mod(value);
    }
  },
  template: '<div class="character">\
    <div class="character-header">\
      <div class="class-icon">\
      </div>\
      <div class="name">\
        <input v-model="c.name" type="text" />\
        <p class="subtitle">{{c.name}}</p>\
      </div>\
      <button class="menu-icon" @click="clear()">\
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
              <select v-model="c.alignment">\
                <option v-for="alignment in alignments">{{alignment}}</option>\
              </select>\
            </div>\
          </div>\
          <div class="row">\
            <div class="input-group col-xs-6">\
              <label>Size</label>\
              <input v-model="c.size" type="text" readonly />\
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
              <label>Hit Die</label>\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Armor Class</label>\
              <input v-model="c.armorClass" type="number" readonly />\
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
          <h4>Abilities</h4>\
          <div class="row">\
            <div class="input-group col-xs-2" v-for="(value, key) in abilities">\
              <label>{{key}}</label>\
              <input v-model="c[value.abbr.toLowerCase()]" type="number" />\
            </div>\
          </div>\
          <h4>Skills</h4>\
          <div class="row">\
            <div class="input-group col-xs-2" v-for="(value, key) in skills">\
              <label>{{key}}</label>\
              <input v-model="c[value.abbr.toLowerCase()]" type="number" />\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="character-section">\
        <button @click="c.showSpecialAbilities = !c.showSpecialAbilites" class="character-section-header">\
          <h3>Special Abilites</h3>\
          <svg :class="{open: c.showSpecialAbilites}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showSpecialAbilites" class="character-section-content">\
          <ul class="row">\
            <li v-for="special in c.specialAbilities" class="col-xs-12">\
              <p><b><i>{{special.name}}: </i></b>{{special.desc}}</p>\
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
          <ul class="row">\
            <li v-for="action in c.actions" class="col-xs-12">\
              <p><b><i>{{action.name}}: </i></b>{{action.desc}}</p>\
            </li>\
          </ul>\
        </div>\
      </div>\
      <div class="character-section">\
        <button @click="c.showLegendaryActions = !c.showLegendaryActions" class="character-section-header">\
          <h3>Actions</h3>\
          <svg :class="{open: c.showLegendaryActions}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showLegendaryActions" class="character-section-content">\
          <ul class="row">\
            <li v-for="action in c.legendaryActions" class="col-xs-12">\
              <p><b><i>{{action.name}}: </i></b>{{action.desc}}</p>\
            </li>\
          </ul>\
        </div>\
      </div>\
      <div class="character-section">\
        <button @click="c.showReactions = !c.showReactions" class="character-section-header">\
          <h3>Reactions</h3>\
          <svg :class="{open: c.showReactions}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showReactions" class="character-section-content">\
          <ul class="row">\
            <li v-for="reaction in c.reactions" class="col-xs-12">\
              <p><b><i>{{reaction.name}}: </i></b>{{reaction.desc}}</p>\
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
