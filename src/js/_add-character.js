Vue.component('add-character', {
  props: ['characterSelect', 'characters'],
  data: function() {
    var sortedCreatures = [];
    for (var i = 0; i < Object.keys(jsonCreatureData).length; i++) {
      var key = Object.keys(jsonCreatureData)[i];
      sortedCreatures.push({"name": key, "challenge_rating": jsonCreatureData[key].challenge_rating});
    }
    return {
      addPlayerScreen: 1,
      addPlayerData: {"name": "Test", "race": "Human", "class": "Wizard", "background": "Acolyte", "languages": "", "inventory": ''},
      addPlayerBaseAbilities: {"str": 8, "dex": 8, "con": 8, "int": 8, "wis": 8, "cha": 8},
      addCreatureName: [],
      raceData: jsonRaceData,
      classData: jsonClassData,
      abilityData: jsonAbilityData,
      skillData: jsonSkillData,
      backgroundData: jsonBackgroundData,
      sortBy: 'name',
      filterBy: '',
      creatureData: sortedCreatures,
      slideDirection: 'slide-left',
      dwarfTools: '',
      draconicAncestry: '',
      skillVersatility: [],
      classSkills: []
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
      if (sr = this.addPlayerData.race) {
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
      if (r = this.addPlayerData.race) {
        return r == this.race ? jsonRaceData[this.race].size : jsonRaceData[this.race].subraces[r].size;
      }
    },
    speed: function() {
      if (r = this.addPlayerData.race) {
        return r == this.race ? jsonRaceData[this.race].speed : jsonRaceData[this.race].subraces[r].speed;
      }
    },
    addPlayerPerks: function() {
      var p = '';
      if (sr = this.addPlayerData.race) {
        if (jsonRaceData[sr]) {
          p = jsonRaceData[sr].ability_perks;
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                p = jsonRaceData[item].subraces[sr].ability_perks;
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
    },
    addPlayerTraits: function() {
      var t = [];
      if (sr = this.addPlayerData.race) {
        if (jsonRaceData[sr]) {
          t = jsonRaceData[sr].traits;
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                t = jsonRaceData[item].subraces[sr].traits;
              }
            }
          }
        }
        return t;
      }
    },
    addPlayerProficiencies: function() {
      var p1 = [];
      var p2 = [];
      if (sr = this.addPlayerData.race) {
        if (jsonRaceData[sr]) {
          p1 = jsonRaceData[sr].proficiencies || [];
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                p1 = jsonRaceData[item].subraces[sr].proficiencies || [];
              }
            }
          }
        }
      }
      if (c = this.addPlayerData.class) {
        p2 = jsonClassData[c].proficiencies;
      }
      return p1.concat(p2).unique();
    }
  },
  watch: {
    characterSelect: function(val) {
      if (!val) {
        this.addPlayerScreen = 1;
        this.addPlayerData = {"name": "Test", "race": "Human", "class": "Wizard", "background": "Acolyte", "languages": "", "inventory": ''};
        this.addCreatureName = [];
        this.addPlayerBaseAbilities = {"str": 8, "dex": 8, "con": 8, "int": 8, "wis": 8, "cha": 8};
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
        name: this.addPlayerData.name,
        type: 'player',
        showInfo: true,
        race: this.race,
        subrace: this.addPlayerData.race,
        klass: this.addPlayerData.class,
        background: this.addPlayerData.background,
        alignment: '',
        size: this.size,
        languages: ["Common", "Other"],
        notes: '',
        speed: this.speed,
        showCombat: true,
        currentHP: 0,
        maxHP: 0,
        armorClass: 0,
        initiative: 0,
        hitDie: '',
        spellAbility: '',
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
        proficiencies: this.addPlayerProficiencies,
        traits: this.addPlayerTraits,
        showInventory: true,
        coins: {'cp': 0, 'sp': 0, 'ep': 0, 'gp': 0, 'pp': 0},
        inventory: []
      });
      this.$emit('close');
    },
    addCreature: function() {
      for (var ii = 0; ii < this.addCreatureName.length; ii++) {
        var c = jsonCreatureData[this.addCreatureName[ii]];
        var abilities = {};
        for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
          abilities[Object.keys(jsonAbilityData)[i]] = 0;
        }
        var saves = {};
        for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
          var s = Object.keys(jsonAbilityData)[i];
          if (c.saves && c.saves[s]) {
            saves[s] = c.saves[s];
          }
          else {
            saves[s] = false;
          }
        }
        var skills = {};
        for (var i = 0; i < Object.keys(jsonSkillData).length; i++) {
          var s = Object.keys(jsonSkillData)[i];
          if (c.skills && c.skills[s]) {
            skills[s] = c.skills[s];
          }
          else {
            skills[s] = false;
          }
        }
        var cr = c.challenge_rating.split(' ')[0];
        var pb = '';
        if (cr <= 4 || cr == '1/8' || cr == '1/4' || cr == '1/2') {
          pb = 2;
        }
        else if (cr <= 8) {
          pb = 3;
        }
        else if (cr <= 12) {
          pb = 4;
        }
        else if (cr <= 16) {
          pb = 5;
        }
        else if (cr <= 20) {
          pb = 6;
        }
        else if (cr <= 24) {
          pb = 7;
        }
        else if (cr <= 28) {
          pb = 8;
        }
        else {
          pb = 9;
        }
        this.characters.push({
          id: Math.random().toString(36).substr(2,9),
          left: false,
          right: false,
          name: this.addCreatureName[ii],
          trueName: this.addCreatureName[ii],
          type: 'creature',
          showInfo: true,
          race: c.type,
          alignment: c.alignment,
          size: c.size,
          languages: c.languages.split(','),
          speed: c.speed,
          showCombat: true,
          currentHP: c.maxHP,
          maxHP: c.maxHP,
          armorClass: c.armor_class,
          initiative: 0,
          showStats: true,
          challengeRating: c.challenge_rating,
          pb: pb,
          abilities: c.abilities,
          saves: saves,
          skills: skills,
          showSpecialAbilities: true,
          specialAbilities: c.special_abilities,
          showActions: true,
          actions: c.actions,
          showLegendaryActions: true,
          legendaryActions: c.legendary_actions,
          showReactions: true,
          reactions: c.reactions
        });
        this.$emit('close');
      }
    },
    sortCreatures: function() {
      if (this.sortBy == 'cr') {
        this.creatureData.sort(function(a, b) {
          var aa = a.challenge_rating.split(' ')[0];
          var bb = b.challenge_rating.split(' ')[0];
          aa = aa == '1/8' ? 0.125 : aa == '1/4' ? 0.25 : aa == '1/2' ? 0.5 : aa;
          bb = bb == '1/8' ? 0.125 : bb == '1/4' ? 0.25 : bb == '1/2' ? 0.5 : bb;
          return aa - bb;
        });
      }
      else {
        this.creatureData.sort(function(a, b) {
          return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        });
      }
    },
    close: function() {
      this.$emit('close');
    }
  },
  template: '<div class="modal">\
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
            <div class="filter-sort">\
              <input v-model="filterBy" class="creature-filter" type="text" placeholder="Filter" />\
              <div class="creature-sort">\
                <label>Sort by</label>\
                <select v-model="sortBy" @change="sortCreatures()">\
                  <option value="name">Name</option>\
                  <option value="cr">Challenge</option>\
                </select>\
              </div>\
            </div>\
            <fieldset id="creature-selector">\
              <template v-for="creature in creatureData">\
                <div v-show="creature.name.toLowerCase().includes(filterBy.toLowerCase())">\
                  <input v-model="addCreatureName" :id="creature.name" name="addCreatureName" :value="creature.name" type="checkbox" />\
                  <label :for="creature.name">\
                    <p class="creature-name">{{creature.name}}</p>\
                    <p class="subtitle">{{creature.challenge_rating}}</p>\
                  </label>\
                </div>\
              </template>\
            </fieldset>\
            <div class="selection-results">\
              <input :value="addCreatureName.join(\', \')" type="text" required />\
              <button @click.prevent="addCreatureName = []"><svg><use xlink:href="sprites.svg#close"></use></svg></button>\
            </div>\
          </div>\
          <div class="modal-footer">\
            <button @click.prevent="close()">Cancel</button>\
            <input type="submit" value="Create Creature" />\
          </div>\
        </form>\
        <form @submit.prevent="addPlayerScreen = 2" class="col-xs-6 no-padding">\
          <div class="modal-content">\
            <select v-model="addPlayerData.race" required>\
              <option value="" disabled>Race</option>\
              <template v-for="(value, key) in raceData">\
                <optgroup v-if="value.subraces" :label="key">\
                  <option v-for="(value2, key2) in value.subraces">{{key2}}</option>\
                </optgroup>\
                <option v-else>{{key}}</option>\
              </template>\
            </select>\
            <select v-model="addPlayerData.class" required>\
              <option value="" disabled>Class</option>\
              <option v-for="(value, key) in classData">{{key}}</option>\
            </select>\
            <select v-model="addPlayerData.background" required>\
              <option value="" disabled>Background</option>\
              <option v-for="(value, key) in backgroundData">{{key}}</option>\
            </select>\
            <input v-model="addPlayerData.name" type="text" placeholder="Name" required />\
          </div>\
          <div class="modal-footer">\
            <button @click.prevent="close()">Cancel</button>\
            <input type="submit" value="Continue" />\
          </div>\
        </form>\
      </div>\
      <form v-if="addPlayerScreen == 2" @submit.prevent="addPlayerScreen = 3" key="2">\
        <div class="modal-content">\
          <div class="row no-padding">\
            <div v-if="addPlayerData.race == \'Hill Dwarf\' || addPlayerData.race == \'Mountain Dwarf\'" class="col-xs-6">\
              <label>Choose <b>1</b> Tool Proficiency (Dwarf Trait: Tool Proficiency)</label>\
              <fieldset>\
                <input v-model="dwarfTools" name="dwarfTools" id="1" value="Smith\'s Tools" type="radio" required /><label for="1"> Smith\'s Tools</label>\
                <input v-model="dwarfTools" name="dwarfTools" id="2" value="Brewer\'s Supplies" type="radio" required /><label for="2">Brewer\'s Supplies</label>\
                <input v-model="dwarfTools" name="dwarfTools" id="3" value="Mason\'s Tools" type="radio" required /><label for="3">Mason\'s Tools</label>\
              </fieldset>\
            </div>\
            <div v-if="addPlayerData.race == \'Dragonborn\'" class="col-xs-6">\
              <label>Choose <b>1</b> Draconic Ancestry (Dragonborn Trait: Draconic Ancestry)</label>\
              <fieldset>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="1" value="Black (Acid)" type="radio" required /><label for="1">Black (Acid)</label>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="2" value="Blue (Lightning)" type="radio" required /><label for="2">Blue (Lightning)</label>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="3" value="Brass (Fire)" type="radio" required /><label for="3">Brass (Fire)</label>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="4" value="Bronze (Lightning)" type="radio" required /><label for="4">Bronze (Lightning)</label>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="5" value="Copper (Acid)" type="radio" required /><label for="5">Copper (Acid)</label>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="6" value="Gold (Fire)" type="radio" required /><label for="6">Gold (Fire)</label>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="7" value="Green (Poison)" type="radio" required /><label for="7">Green (Poison)</label>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="8" value="Red (Fire)" type="radio" required /><label for="8">Red (Fire)</label>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="9" value="Silver (Cold)" type="radio" required /><label for="9">Silver (Cold)</label>\
                <input v-model="draconicAncestry" name="draconicAncestry" id="10" value="White (Cold)" type="radio" required /><label for="10">White (Cold)</label>\
              </fieldset>\
            </div>\
            <div v-if="addPlayerData.race == \'Half-Elf\'" class="col-xs-6">\
              <label>Choose <b>2</b> Skill Proficiences (Half-Elf Trait: Skill Versatility)</label>\
              <fieldset>\
                <template v-for="(value, key) in skillData">\
                  <input v-model="skillVersatility" name="skillVersatility" :id="key" :value="key" type="checkbox" /><label :for="key">{{value.full}}</label>\
                </template>\
              </fieldset>\
              <div class="selection-results">\
                <input class="capitalize" :value="skillVersatility.join(\', \').replace(/_/g, \' \')" type="text" required />\
                <button @click.prevent="skillVersatility = []"><svg><use xlink:href="sprites.svg#close"></use></svg></button>\
              </div>\
            </div>\
            <div v-if="addPlayerData.class == \'Barbarian\'" class="col-xs-6">\
              <label>Choose <b>2</b> Skill Proficiences (Barbarian)</label>\
              <fieldset>\
                <template v-for="skill in classData[addPlayerData.class].skills">\
                  <input v-model="classSkills" name="classSkills" :id="skill" :value="skill" type="checkbox" /><label :for="skill">{{skill}}</label>\
                </template>\
              </fieldset>\
              <div class="selection-results">\
                <input class="capitalize" :value="classSkills.join(\', \').replace(/_/g, \' \')" type="text" required />\
                <button @click.prevent="classSkills = []"><svg><use xlink:href="sprites.svg#close"></use></svg></button>\
              </div>\
            </div>\
          </div>\
        </div>\
        <div class="modal-footer">\
          <button @click.prevent="close()">Cancel</button>\
          <input type="submit" value="Continue" />\
        </div>\
      </form>\
      <form v-if="addPlayerScreen == 3" @submit.prevent="addPlayer()" key="3">\
        <div class="modal-content">\
          <h2>Step 3</h2>\
          <div class="inputs">\
            <div v-for="(value, key) in abilityData" class="stat">\
              <h4 class="subtitle">{{key.toUpperCase()}}</h4>\
              <input v-model.number="addPlayerBaseAbilities[key]" class="base" type="number" />\
              <div class="perk">+{{addPlayerPerks[key] || 0}}</div>\
              <div class="total">{{addPlayerAbilities[key]}}<span class="mod"> ({{addPlayerAbilities[key] | mod}})</span></div>\
            </div>\
          </div>\
        </div>\
        <div class="modal-footer">\
          <button @click.prevent="close()">Cancel</button>\
          <input type="submit" value="Create Player" />\
        </div>\
      </form>\
    </transition-group>\
  </div>'
});
