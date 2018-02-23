Vue.component('characters', {
  data: function() {
    return {
      left: '',
      right: '',
      characterSelect: false,
      addPlayerScreen: 1,
      addPlayerRace: 'Human',
      addPlayerClass: 'Wizard',
      addPlayerBackground: 'Acolyte',
      addPlayerName: 'test',
      addPlayerBaseAbilities: {"Strength": 8, "Dexterity": 8, "Constitution": 8, "Intelligence": 8, "Wisdom": 8, "Charisma": 8},
      addPlayerInventory: [],
      addCreatureName: '',
      characterDelete: false,
      characters: [],
      abilityData: jsonAbilityData,
      raceData: jsonRaceData,
      classData: jsonClassData,
      backgroundData: jsonBackgroundData,
      creatureData: jsonCreatureData,
      slideDirection: 'slide-left'
    }
  },
  filters: {
    mod: function(value) {
      var v = Math.floor((value - 10) / 2);
      return v >= 0 ? '+' + v : v;
    }
  },
  computed: {
    race: function() {
      var r = '';
      if (sr = this.addPlayerRace) {
        if (jsonRaceData[sr]) {
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
      var s = '';
      if (this.addPlayerRace) {
        return this.addPlayerRace == this.race ? jsonRaceData[this.race].size : jsonRaceData[this.race].subraces[this.addPlayerRace].size;
      }
    },
    speed: function() {
      var s = '';
      if (this.addPlayerRace) {
        return this.addPlayerRace == this.race ? jsonRaceData[this.race].speed : jsonRaceData[this.race].subraces[this.addPlayerRace].speed;
      }
    },
    spellAbility: function() {
      if (this.addPlayerClass) {
        return jsonClassData[this.addPlayerClass].spell_casting_ability;
      }
    },
    addPlayerPerks: function() {
      var p = '';
      if (sr = this.addPlayerRace) {
        if (jsonRaceData[sr]) {
          p = jsonRaceData[sr].perks;
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                p = jsonRaceData[item].subraces[sr].perks;
              }
            }
          }
        }
        return p;
      }
    },
    addPlayerAbilities: function() {
      var as = {};
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        var a = Object.keys(jsonAbilityData)[i];
        as[a] = this.addPlayerBaseAbilities[a] + (this.addPlayerPerks[a] || 0);
      }
      return as;
    }
  },
  watch: {
    characterSelect: function(val) {
      if (!val) {
        this.addPlayerScreen = 1;
        this.addPlayerRace = '';
        this.addPlayerClass = '';
        this.addPlayerBackground = '';
        this.addPlayerName = '';
        this.addCreatureName = '';
        this.addPlayerBaseAbilities = {"Strength": 8, "Dexterity": 8, "Constitution": 8, "Intelligence": 8, "Wisdom": 8, "Charisma": 8};
        this.addPlayerInventory = [];
      }
    },
    addPlayerScreen: function(newVal, oldVal) {
      this.slideDirection = newVal > oldVal ? 'slide-right' : 'slide-left';
    }
  },
  methods: {
    addPlayer: function() {
      var abilities = {};
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        abilities[Object.keys(jsonAbilityData)[i]] = 0;
      }
      var saves = {};
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        saves[Object.keys(jsonAbilityData)[i]] = false;
      }
      var skills = {};
      for (var i = 0; i < Object.keys(jsonSkillData).length; i++) {
        skills[Object.keys(jsonSkillData)[i]] = false;
      }
      var spellSlots = {};
      var spellSlotsAvailable = {};
      for (var i = 0; i < 9; i++) {
        spellSlots['level' + (i+1) + 'Slots'] = 0;
        spellSlotsAvailable['level' + (i+1) + 'SlotsAvailable'] = 0;
      }
      this.characters.push({
        id: Math.random().toString(36).substr(2,9),
        name: this.addPlayerName,
        type: 'player',
        showInfo: true,
        race: this.race,
        subrace: this.addPlayerRace,
        klass: this.addPlayerClass,
        background: this.addPlayerBackground,
        alignment: '',
        languages: ["Common", "Other"],
        size: this.size,
        speed: this.speed,
        showCombat: true,
        currentHP: 0,
        maxHP: 0,
        hitDie: '',
        armorClass: 0,
        spellAbility: this.spellAbility,
        spellAttackMod: 0,
        spellSavingDC: 0,
        cantripsKnown: 0,
        spellsKnown: 0,
        spellSlots: spellSlots,
        spellSlotsAvailable: spellSlotsAvailable,
        showStats: true,
        exp: 0,
        level: 0,
        pb: 2,
        abilities: this.addPlayerAbilities,
        saves: saves,
        skills: skills,
        proficiencies: [],
        traits: [],
        showInventory: true,
        inventory: []
      });
      this.characterSelect = false;
    },
    addCreature: function() {
      var abilities = {};
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        abilities[Object.keys(jsonAbilityData)[i]] = 0;
      }
      var saves = {};
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        saves[Object.keys(jsonAbilityData)[i]] = false;
      }
      var skills = {};
      for (var i = 0; i < Object.keys(jsonSkillData).length; i++) {
        skills[Object.keys(jsonSkillData)[i]] = false;
      }
      var c = this.creatureData[this.addCreatureName];
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
        spellSlots: '',
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
      this.characterSelect = false;
    },
    leftBtn: function(i) {
      this.characters[i].left = true;
      this.left = this.characters[i];
    },
    rightBtn: function(i) {
      this.characters[i].right = true;
      this.right = this.characters[i];
    },
    duplicateBtn: function(i) {
      var dupe = Vue.util.extend({}, this.characters[i]);
      dupe.id = Math.random().toString(36).substr(2,9);
      this.characters.splice(i + 1, 0, dupe);
    },
    deleteBtn: function(i) {
      this.characterDelete = i + 1;
    },
    deleteCharacter: function(i) {
      if (this.left.id == this.characters[i - 1].id) {
        this.left = '';
      }
      if (this.right.id == this.characters[i - 1].id) {
        this.right = '';
      }
      this.characters.splice(i - 1, 1);
      this.characterDelete = false;
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
        <transition name="fade">\
          <component v-if="left" :is="left.type" :c="left" @clear="clearLeft()"></component>\
          <div v-else class="character-placeholder">\
            <p>Click on a character to inspect</p>\
          </div>\
        </transition>\
      </div>\
      <div class="col-sm-6">\
        <transition name="fade">\
          <component v-if="right" :is="right.type" :c="right" @clear="clearRight()"></component>\
          <div v-else class="character-placeholder">\
            <p>Click on a character to inspect</p>\
          </div>\
        </transition>\
      </div>\
    </main>\
    <aside class="character-list">\
      <transition-group class="sortable" name="list-slide" tag="ul">\
        <li v-for="(character, index) in characters" :key="character.id">\
          <div class="info">\
            <div class="class-icon">\
              <svg v-if="character.type == \'player\'"><use :xlink:href="\'sprites.svg#\' + character.klass.toLowerCase()"></use></svg>\
              <svg v-if="character.type == \'creature\'"><use xlink:href="sprites.svg#creature"></use></svg>\
            </div>\
            <p class="name">{{character.name}}</p>\
            <svg class="reorder"><use xlink:href="sprites.svg#reorder"></use></svg>\
          </div>\
          <div class="stats">\
            <div>\
              <svg><use xlink:href="sprites.svg#health"></use></svg>\
              <input v-model.number="character.currentHP" type="number" />\
            </div>\
            <div>\
              <svg><use xlink:href="sprites.svg#armor"></use></svg>\
              <input v-model.number="character.armorClass" type="number" readonly />\
            </div>\
            <div>\
              <svg><use xlink:href="sprites.svg#initiative"></use></svg><input v-model.number="character.initiative" type="number" />\
            </div>\
          </div>\
          <div class="tools">\
            <button class="flat-btn" @click="leftBtn(index)">\
              <svg><use xlink:href="sprites.svg#arrow-left"></use></svg>\
            </button>\
            <button class="flat-btn" @click="rightBtn(index)">\
              <svg><use xlink:href="sprites.svg#arrow-right"></use></svg>\
            </button>\
            <button class="flat-btn" @click="duplicateBtn(index)">\
              <svg><use xlink:href="sprites.svg#duplicate"></use></svg>\
            </button>\
            <button class="flat-btn" @click="deleteBtn(index)">\
              <svg><use xlink:href="sprites.svg#trash"></use></svg>\
            </button>\
          </div>\
        </li>\
      </transition-group>\
      <button class="add-character" @click="characterSelect = true">\
        <svg><use xlink:href="sprites.svg#plus"></use></svg>\
      </button>\
    </aside>\
    <transition name="fade">\
      <div v-if="characterSelect" id="character-creator" class="modal-bg">\
        <div class="modal">\
          <div class="modal-header">\
            <div @click="addPlayerScreen = 1" class="step" :class="[addPlayerScreen == 1 ? \'current\' : \'\', addPlayerScreen > 1 ? \'complete\' : \'\']">\
              <div class="step-icon">\
                <svg v-if="addPlayerScreen > 1"><use xlink:href="sprites.svg#checkmark"></use></svg>\
                <div v-else>1</div>\
              </div>\
              <h3>Choose type</h3>\
            </div>\
            <div class="line"></div>\
            <div @click="addPlayerScreen = 2" class="step" :class="[addPlayerScreen == 2 ? \'current\' : \'\', addPlayerScreen > 2 ? \'complete\' : \'\']">\
              <div class="step-icon">\
                <svg v-if="addPlayerScreen > 2"><use xlink:href="sprites.svg#checkmark"></use></svg>\
                <div v-else>2</div>\
              </div>\
              <h3>Choose advantages</h3>\
            </div>\
            <div class="line"></div>\
            <div @click="addPlayerScreen = 3" class="step" :class="[addPlayerScreen == 3 ? \'current\' : \'\', addPlayerScreen > 3 ? \'complete\' : \'\']">\
              <div class="step-icon">\
                <svg v-if="addPlayerScreen > 3"><use xlink:href="sprites.svg#checkmark"></use></svg>\
                <div v-else>3</div>\
              </div>\
              <h3>Choose abilities</h3>\
            </div>\
          </div>\
          <transition-group :name="slideDirection" tag="div" class="step-slides">\
            <div v-if="addPlayerScreen == 1" class="row no-padding" key="1">\
              <form @submit.prevent="addCreature()" class="col-xs-6 no-padding">\
                <div class="modal-content">\
                  <h2>Creature</h2>\
                  <select v-model="addCreatureName" required>\
                    <option value="" disabled>Creature</option>\
                    <option v-for="(value, key) in creatureData">{{key}}</option>\
                  </select>\
                </div>\
                <div class="modal-footer">\
                  <button @click.prevent="characterSelect = false">Cancel</button>\
                  <input type="submit" value="Create Creature" />\
                </div>\
              </form>\
              <form @submit.prevent="addPlayerScreen = 2" class="col-xs-6 no-padding">\
                <div class="modal-content">\
                  <h2>Player</h2>\
                  <select v-model="addPlayerRace" required>\
                    <option value="" disabled>Race</option>\
                    <template v-for="(value, key) in raceData">\
                      <optgroup v-if="value.subraces" :label="key">\
                        <option v-for="(value2, key2) in value.subraces">{{key2}}</option>\
                      </optgroup>\
                      <option v-else>{{key}}</option>\
                    </template>\
                  </select>\
                  <select v-model="addPlayerClass" required>\
                    <option value="" disabled>Class</option>\
                    <option v-for="(value, key) in classData">{{key}}</option>\
                  </select>\
                  <select v-model="addPlayerBackground" required>\
                    <option value="" disabled>Background</option>\
                    <option v-for="(value, key) in backgroundData">{{key}}</option>\
                  </select>\
                  <input v-model="addPlayerName" type="text" placeholder="Name" required />\
                </div>\
                <div class="modal-footer">\
                  <button @click.prevent="characterSelect = false">Cancel</button>\
                  <input type="submit" value="Continue" />\
                </div>\
              </form>\
            </div>\
            <form v-if="addPlayerScreen == 2" @submit.prevent="addPlayerScreen = 3" key="2">\
              <div class="modal-content">\
                <div class="row no-padding">\
                  <div class="col-xs-6">\
                    <h2>Step 2</h2>\
                    <div v-if="addPlayerRace == \'Hill Dwarf\' || addPlayerRace == \'Mountain Dwarf\'">\
                      <label><input value="Smith\'s Tools" type="radio" />Smith\'s Tools</label>\
                      <label><input value="Brewer\'s Supplies" type="radio" />Brewer\'s Supplies</label>\
                      <label><input value="Mason\'s Tools" type="radio" />Mason\'s Tools</label>\
                    </div>\
                  </div>\
                  <div class="col-xs-6">\
                  </div>\
                </div>\
              </div>\
              <div class="modal-footer">\
                <button @click.prevent="characterSelect = false">Cancel</button>\
                <input type="submit" value="Continue" />\
              </div>\
            </form>\
            <form v-if="addPlayerScreen == 3" @submit.prevent="addPlayer()" key="3">\
              <div class="modal-content">\
                <h2>Step 3</h2>\
                <div class="inputs">\
                  <div v-for="(value, key) in abilityData" class="stat">\
                    <h4 class="subtitle">{{key.substring(0,3).toUpperCase()}}</h4>\
                    <input v-model.number="addPlayerBaseAbilities[key]" class="base" type="number" />\
                    <div class="perk">+{{addPlayerPerks[key] || 0}}</div>\
                    <div class="total">{{addPlayerAbilities[key]}}<span class="mod"> ({{addPlayerAbilities[key] | mod}})</span></div>\
                  </div>\
                </div>\
              </div>\
              <div class="modal-footer">\
                <button @click.prevent="characterSelect = false">Cancel</button>\
                <input type="submit" value="Create Player" />\
              </div>\
            </form>\
          </transition-group>\
        </div>\
      </div>\
    </transition>\
    <transition name="fade">\
      <div v-if="characterDelete" class="modal-bg">\
        <div class="modal">\
          <div class="modal-content">\
            <p>Delete character?</p>\
          </div>\
          <div class="modal-footer">\
            <button @click="characterDelete = false">Cancel</button>\
            <button @click="deleteCharacter(characterDelete)">Delete</button>\
          </div>\
        </div>\
      </div>\
    </transition>\
  </div>'
});
