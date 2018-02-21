Vue.component('characters', {
  data: function() {
    return {
      left: '',
      right: '',
      characterSelect: false,
      addPlayerRace: '',
      addCreatureName: '',
      characters: [],
      races: jsonRaceData,
      creatures: jsonCreatureData
    }
  },
  computed: {
    race: function() {
      var r = '';
      if (sr = this.addPlayerRace) {
        if (jsonRaceData[this.addPlayerRace]) {
          r = sr;
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                r = item;
              }
            }
          }
        }
        return r;
      }
    },
    size: function() {
      if (this.race) {
        return jsonRaceData[this.race].size;
      }
    },
    speed: function() {
      var s = '';
      if (this.addPlayerRace) {
        if (this.addPlayerRace != this.race) {
          s = jsonRaceData[this.race].subraces[this.addPlayerRace].speed;
        }
        else {
          s = jsonRaceData[this.race].speed;
        }
        return s;
      }
    }
  },
  methods: {
    addCharacter: function() {
      this.characterSelect = true;
    },
    addPlayer: function() {
      this.characterSelect = false;
      var abilities = {};
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        abilities[Object.keys(jsonAbilityData)[i]] = {};
        abilities[Object.keys(jsonAbilityData)[i]].value = 0;
        abilities[Object.keys(jsonAbilityData)[i]].mod = -5;
      }
      var saves = {};
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        saves[Object.keys(jsonAbilityData)[i]] = {};
        saves[Object.keys(jsonAbilityData)[i]].mod = -5;
        saves[Object.keys(jsonAbilityData)[i]].prof = false;
      }
      var skills = {};
      for (var i = 0; i < Object.keys(jsonSkillData).length; i++) {
        skills[Object.keys(jsonSkillData)[i]] = {};
        skills[Object.keys(jsonSkillData)[i]].mod = -5;
        skills[Object.keys(jsonSkillData)[i]].prof = false;
      }
      var spellSlots = {};
      for (var i = 0; i < 9; i++) {
        spellSlots['level' + (i+1) + 'Slots'] = 0;
      }
      this.characters.push({
        id: Math.random().toString(36).substr(2,9),
        name: 'Namely' + Math.random(),
        type: 'player',
        showInfo: true,
        race: this.race,
        subrace: this.addPlayerRace,
        klass: '',
        background: '',
        alignment: '',
        size: this.size,
        speed: this.speed,
        showCombat: true,
        currentHP: 0,
        maxHP: 0,
        hitDie: '',
        armorClass: 0,
        spellAbility: '',
        spellAttackMod: 0,
        spellSavingDC: 0,
        speed: 0,
        showStats: true,
        exp: 0,
        level: 0,
        pb: 2,
        abilities: abilities,
        saves: saves,
        skills: skills,
        showSpells: true,
        cantripsKnown: 0,
        spellsKnown: 0,
        spellSlots: spellSlots,
        showInventory: true
      });
      this.addPlayerRace = '';
    },
    addCreature: function() {
      this.characterSelect = false;
      var abilities = {};
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        abilities[Object.keys(jsonAbilityData)[i]] = {};
        abilities[Object.keys(jsonAbilityData)[i]].value = 0;
        abilities[Object.keys(jsonAbilityData)[i]].mod = -5;
      }
      var saves = {};
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        saves[Object.keys(jsonAbilityData)[i]] = {};
        saves[Object.keys(jsonAbilityData)[i]].mod = -5;
        saves[Object.keys(jsonAbilityData)[i]].prof = false;
      }
      var skills = {};
      for (var i = 0; i < Object.keys(jsonSkillData).length; i++) {
        skills[Object.keys(jsonSkillData)[i]] = {};
        skills[Object.keys(jsonSkillData)[i]].mod = -5;
        skills[Object.keys(jsonSkillData)[i]].prof = false;
      }
      var c = this.creatures[this.addCreatureName];
      this.characters.push({
        id: Math.random().toString(36).substr(2,9),
        name: this.addCreatureName,
        type: 'creature',
        showInfo: true,
        race: c.type + (c.subtype ? ' (' + c.subtype + ')' : ''),
        alignment: c.alignment,
        size: c.size,
        speed: c.speed,
        showCombat: true,
        currentHP: c.maxHP,
        maxHP: c.maxHP,
        armorClass: c.armor_class,
        showStats: true,
        abilities: abilities,
        saves: saves,
        skills: skills,
        showSpecialAbilites: true,
        specialAbilities: c.special_abilities,
        showActions: true,
        actions: c.actions,
        showLegendaryActions: true,
        legendaryActions: c.legendary_actions,
        showReactions: true,
        reactions: c.reactions
      });
      this.addCreatureName = '';
    },
    leftBtn: function(i) {
      this.characters[i].left = true;
      this.left = this.characters[i];
    },
    rightBtn: function(i) {
      this.characters[i].right = true;
      this.right = this.characters[i];
    },
    clearLeft: function() {
      this.left = '';
    },
    clearRight: function() {
      this.right = '';
    }
  },
  template: '<div id="characters">\
    <main class="comparisons row">\
      <div class="col-sm-6">\
        <transition name="modal">\
          <component v-if="left" :is="left.type" :c="left" @clear="clearLeft()"></component>\
          <div v-else class="character-placeholder">\
            <p>Click on a character to inspect</p>\
          </div>\
        </transition>\
      </div>\
      <div class="col-sm-6">\
        <transition name="modal">\
          <component v-if="right" :is="right.type" :c="right" @clear="clearRight()"></component>\
          <div v-else class="character-placeholder">\
            <p>Click on a character to inspect</p>\
          </div>\
        </transition>\
      </div>\
    </main>\
    <aside class="character-list">\
      <ul class="sortable">\
        <li v-for="(character, index) in characters" :key="character.id">\
          <div class="info">\
            <svg class="reorder"><use xlink:href="sprites.svg#reorder"></use></svg>\
            <p class="name">{{character.name}}</p>\
          </div>\
          <div class="stats">\
            <div>\
              <svg><use xlink:href="sprites.svg#health"></use></svg>\
              <input v-model="character.currentHP" type="number" />\
            </div>\
            <div>\
              <svg><use xlink:href="sprites.svg#armor"></use></svg>\
              <input v-model="character.armorClass" type="number" readonly />\
            </div>\
            <div>\
              <svg><use xlink:href="sprites.svg#initiative"></use></svg><input v-model="character.initiative" type="number" />\
            </div>\
          </div>\
          <div class="tools">\
            <button @click="leftBtn(index)">\
              <svg><use xlink:href="sprites.svg#arrow-left"></use></svg>\
            </button>\
            <button @click="rightBtn(index)">\
              <svg><use xlink:href="sprites.svg#arrow-right"></use></svg>\
            </button>\
          </div>\
        </li>\
      </ul>\
      <button class="add-character" @click="addCharacter()">\
        <svg><use xlink:href="sprites.svg#plus"></use></svg>\
      </button>\
    </aside>\
    <transition name="modal">\
      <div v-if="characterSelect" class="modal">\
        <div class="modal-header">\
        </div>\
        <div class="modal-content">\
          <h3>Add Player</h3>\
          <select @change="addPlayer()" v-model="addPlayerRace">\
            <template v-for="(value, key) in races">\
              <optgroup v-if="value.subraces" :label="key">\
                <option v-for="(value2, key2) in value.subraces">{{key2}}</option>\
              </optgroup>\
              <option v-else>{{key}}</option>\
            </template>\
          </select>\
          <h3>Add Creature</h3>\
          <select @change="addCreature()" v-model="addCreatureName">\
            <option v-for="(value, key) in creatures">{{key}}</option>\
          </select>\
          <button @click="characterSelect = false">Cancel</button>\
        </div>\
      </div>\
    </transition>\
  </div>'
});
