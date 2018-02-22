Vue.component('characters', {
  data: function() {
    return {
      left: '',
      right: '',
      characterSelect: false,
      addPlayerScreen: 1,
      addPlayerRace: '',
      addPlayerClass: '',
      addPlayerName: '',
      addCreatureName: '',
      characterDelete: false,
      characters: [],
      races: jsonRaceData,
      classes: jsonClassData,
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
    },
    spellAbility: function() {
      if (this.addPlayerClass) {
        return jsonClassData[this.addPlayerClass].spell_casting_ability;
      }
    }
  },
  watch: {
    characterSelect: function(val) {
      if (!val) {
        this.addPlayerScreen = 1;
        this.addPlayerRace = '';
        this.addPlayerClass = '';
        this.addPlayerName = '';
        this.addCreatureName = '';
      }
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
        saves[Object.keys(jsonAbilityData)[i]] = {};
        saves[Object.keys(jsonAbilityData)[i]].value = 0;
        saves[Object.keys(jsonAbilityData)[i]].prof = false;
      }
      var skills = {};
      for (var i = 0; i < Object.keys(jsonSkillData).length; i++) {
        skills[Object.keys(jsonSkillData)[i]] = {};
        skills[Object.keys(jsonSkillData)[i]].value = 0;
        skills[Object.keys(jsonSkillData)[i]].prof = false;
      }
      var spellSlots = {};
      for (var i = 0; i < 9; i++) {
        spellSlots['level' + (i+1) + 'Slots'] = 0;
      }
      this.characters.push({
        id: Math.random().toString(36).substr(2,9),
        name: this.addPlayerName,
        type: 'player',
        showInfo: true,
        race: this.race,
        subrace: this.addPlayerRace,
        klass: this.addPlayerClass,
        background: '',
        alignment: '',
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
      this.characterSelect = false;
    },
    addCreature: function() {
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
          <transition-group name="slides" tag="div" class="step-slides">\
            <div v-if="addPlayerScreen == 1" class="row no-padding" key="1">\
              <form @submit.prevent="addCreature()" class="col-xs-6 no-padding">\
                <div class="modal-content">\
                  <h2>Creature</h2>\
                  <select v-model="addCreatureName" required>\
                    <option value="" disabled>Creature</option>\
                    <option v-for="(value, key) in creatures">{{key}}</option>\
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
                    <template v-for="(value, key) in races">\
                      <optgroup v-if="value.subraces" :label="key">\
                        <option v-for="(value2, key2) in value.subraces">{{key2}}</option>\
                      </optgroup>\
                      <option v-else>{{key}}</option>\
                    </template>\
                  </select>\
                  <select v-model="addPlayerClass" required>\
                    <option value="" disabled>Class</option>\
                    <template v-for="(value, key) in classes">\
                      <option>{{key}}</option>\
                    </template>\
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
                <h2>Step 2</h2>\
              </div>\
              <div class="modal-footer">\
                <button @click.prevent="characterSelect = false">Cancel</button>\
                <input type="submit" value="Continue" />\
              </div>\
            </form>\
            <form v-if="addPlayerScreen == 3" @submit.prevent="addPlayer()" key="3">\
              <div class="modal-content">\
                <h2>Step 3</h2>\
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
