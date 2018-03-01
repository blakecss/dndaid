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
      addPlayerData: {"name": "Test", "race": "Human", "class": "Bard", "classSkills": [], "classEquipment": [], "background": "Acolyte"},
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
    addPlayerLanguages: function() {
      var rl = [];
      if (sr = this.addPlayerData.race) {
        if (jsonRaceData[sr]) {
          rl = jsonRaceData[sr].languages;
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                rl = jsonRaceData[item].subraces[sr].languages;
              }
            }
          }
        }
      }
      var bl = jsonBackgroundData[this.addPlayerData.background].languages || [];
      return rl.concat(bl);
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
      var rt = [];
      var ct = [];
      if (sr = this.addPlayerData.race) {
        if (jsonRaceData[sr]) {
          rt = jsonRaceData[sr].traits || [];
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                rt = jsonRaceData[item].subraces[sr].traits || [];
              }
            }
          }
        }
      }
      if (c = this.addPlayerData.class) {
        ct = jsonClassData[c].features[0]
      }
      if (this.draconicAncestry) {
        rt[0] = 'Draconic Ancestry: ' + this.draconicAncestry;
        rt[2] = 'Damage Resistance: ' + this.draconicAncestry;
      }
      return rt.concat(ct).unique();
    },
    addPlayerProficiencies: function() {
      var rp = [];
      var cp = [];
      var bp = [];
      if (sr = this.addPlayerData.race) {
        if (jsonRaceData[sr]) {
          rp = jsonRaceData[sr].proficiencies || [];
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                rp = jsonRaceData[item].subraces[sr].proficiencies || [];
              }
            }
          }
        }
      }
      if (c = this.addPlayerData.class) {
        cp = jsonClassData[c].proficiencies;
      }
      if (b = this.addPlayerData.background) {
        bp = jsonBackgroundData[b].proficiencies || [];
      }
      if (this.dwarfTools) {
        rp.push(this.dwarfTools);
      }
      return rp.concat(cp).concat(bp).unique();
    },
    raceSkills: function() {
      var rs = [];
      if (sr = this.addPlayerData.race) {
        if (jsonRaceData[sr]) {
          rs = jsonRaceData[sr].skill_proficiencies || [];
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                rs = jsonRaceData[item].subraces[sr].skill_proficiencies || [];
              }
            }
          }
        }
      }
      return rs;
    },
    addPlayerGold: function() {
      var g = 0;
      if (this.addPlayerData.class == 'Barbarian') {
        g = roll('2d4 * 10');
      }
      else if (this.addPlayerData.class == 'Bard') {
        g = roll('5d4 * 10');
      }
      else if (this.addPlayerData.class == 'Cleric') {
        g = roll('5d4 * 10');
      }
      else if (this.addPlayerData.class == 'Druid') {
        g = roll('2d4 * 10');
      }
      else if (this.addPlayerData.class == 'Fighter') {
        g = roll('5d4 * 10');
      }
      else if (this.addPlayerData.class == 'Monk') {
        g = roll('5d4');
      }
      else if (this.addPlayerData.class == 'Paladin') {
        g = roll('5d4 * 10');
      }
      else if (this.addPlayerData.class == 'Ranger') {
        g = roll('5d4 * 10');
      }
      else if (this.addPlayerData.class == 'Rogue') {
        g = roll('4d4 * 10');
      }
      else if (this.addPlayerData.class == 'Sorcerer') {
        g = roll('3d4 * 10');
      }
      else if (this.addPlayerData.class == 'Warlock') {
        g = roll('4d4 * 10');
      }
      else if (this.addPlayerData.class == 'Wizard') {
        g = roll('4d4 * 10');
      }
      return g;
    }
  },
  watch: {
    characterSelect: function(val) {
      if (!val) {
        this.addPlayerScreen = 1;
      }
    },
    addPlayerScreen: function(newVal, oldVal) {
      this.slideDirection = newVal > oldVal ? 'slide-right' : 'slide-left';
      if (newVal == 1) {
        this.addPlayerData = {"name": "Test", "race": "Human", "class": "Bard", "classSkills": [], "classEquipment": [], "background": "Acolyte"};
        this.addPlayerBaseAbilities = {"str": 8, "dex": 8, "con": 8, "int": 8, "wis": 8, "cha": 8};
        this.addCreatureName = [];
        this.dwarfTools = '';
        this.draconicAncestry = '';
        this.skillVersatility = [];
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
        var a = Object.keys(jsonAbilityData)[i];
        saves[a] = jsonClassData[this.addPlayerData.class].saving_throws.includes(a) ? true : false;
      }
      var skills = {};
      for (var i = 0; i < Object.keys(jsonSkillData).length; i++) {
        var s = Object.keys(jsonSkillData)[i];
        skills[s] = this.addPlayerData.classSkills.includes(s) ? true : false;
        if (this.skillVersatility.includes(s)) {
          skills[s] = true;
        }
        if (this.raceSkills.includes(s)) {
          skills[s] = true;
        }
      }
      var spellSlots = {};
      var spellSlotsAvailable = {};
      for (var i = 0; i < 9; i++) {
        spellSlots['level' + (i+1) + 'Slots'] = 0;
        spellSlotsAvailable['level' + (i+1) + 'SlotsAvailable'] = 0;
      }
      var inventory = [];
      for (var i = 0; i < this.addPlayerData.classEquipment.length; i++) {
        var e = this.addPlayerData.classEquipment[i];
        if (Array.isArray(e)) {
          for (var ii = 0; ii < e.length; ii++) {
            inventory.push(e[ii]);
          }
        }
        else {
          inventory.push(e);
        }
      }
      for (var i = 0; i < jsonClassData[this.addPlayerData.class].equipment.length; i++) {
        if (!Array.isArray(jsonClassData[this.addPlayerData.class].equipment[i])) {
          inventory.push(jsonClassData[this.addPlayerData.class].equipment[i]);
        }
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
        languages: this.addPlayerLanguages,
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
        cantrips: [],
        spellsKnown: 0,
        spells: [],
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
        coins: {'cp': 0, 'sp': 0, 'ep': 0, 'gp': this.addPlayerGold, 'pp': 0},
        inventory: inventory
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
          notes: '',
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
              <transition name="fade">\
                <button v-if="addCreatureName.length" @click.prevent="addCreatureName = []"><svg><use xlink:href="sprites.svg#clear"></use></svg></button>\
              </transition>\
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
            <div class="col-xs-4">\
              <h3>Race ({{addPlayerData.race}})</h3>\
              <div v-if="addPlayerData.race == \'Hill Dwarf\' || addPlayerData.race == \'Mountain Dwarf\'">\
                <label>Choose <b>1</b> Tool Proficiency (Tool Proficiency)</label>\
                <fieldset>\
                  <input v-model="dwarfTools" name="dwarfTools" id="r0" value="Smith\'s Tools" type="radio" required />\
                  <label for="r0"> Smith\'s Tools</label>\
                  <input v-model="dwarfTools" name="dwarfTools" id="r1" value="Brewer\'s Supplies" type="radio" required />\
                  <label for="r1">Brewer\'s Supplies</label>\
                  <input v-model="dwarfTools" name="dwarfTools" id="r2" value="Mason\'s Tools" type="radio" required />\
                  <label for="r2">Mason\'s Tools</label>\
                </fieldset>\
              </div>\
              <div v-else-if="addPlayerData.race == \'Dragonborn\'">\
                <label>Choose <b>1</b> Draconic Ancestry (Draconic Ancestry)</label>\
                <fieldset>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r0" value="Black (Acid)" type="radio" required />\
                  <label for="r0">Black (Acid)</label>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r1" value="Blue (Lightning)" type="radio" required />\
                  <label for="r1">Blue (Lightning)</label>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r2" value="Brass (Fire)" type="radio" required />\
                  <label for="r2">Brass (Fire)</label>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r3" value="Bronze (Lightning)" type="radio" required />\
                  <label for="r3">Bronze (Lightning)</label>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r4" value="Copper (Acid)" type="radio" required />\
                  <label for="r4">Copper (Acid)</label>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r5" value="Gold (Fire)" type="radio" required />\
                  <label for="r5">Gold (Fire)</label>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r6" value="Green (Poison)" type="radio" required />\
                  <label for="r6">Green (Poison)</label>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r7" value="Red (Fire)" type="radio" required />\
                  <label for="r7">Red (Fire)</label>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r8" value="Silver (Cold)" type="radio" required />\
                  <label for="r8">Silver (Cold)</label>\
                  <input v-model="draconicAncestry" name="draconicAncestry" id="r9" value="White (Cold)" type="radio" required />\
                  <label for="r9">White (Cold)</label>\
                </fieldset>\
              </div>\
              <div v-else-if="addPlayerData.race == \'Half-Elf\'">\
                <label>Choose <b>2</b> Skill Proficiences (Skill Versatility)</label>\
                <fieldset>\
                  <template v-for="(value, key, index) in skillData">\
                    <input v-model="skillVersatility" name="skillVersatility" :id="\'r\' + index" :value="key" type="checkbox" />\
                    <label :for="\'r\' + index">{{value.full}}</label>\
                  </template>\
                </fieldset>\
                <div class="selection-results">\
                  <input class="capitalize" :value="skillVersatility.join(\', \').replace(/_/g, \' \')" type="text" required />\
                  <transition name="fade">\
                    <button v-if="skillVersatility.length" @click.prevent="skillVersatility = []"><svg><use xlink:href="sprites.svg#clear"></use></svg></button>\
                  </transition>\
                </div>\
              </div>\
              <div v-else>\
                <p>No Choices Required</p>\
              </div>\
            </div>\
            <div class="col-xs-8 row no-padding">\
              <div class="col-xs-12">\
                <h3>Class ({{addPlayerData.class}})</h3>\
              </div>\
              <div class="col-xs-6">\
                <label class="class-label">Choose <b>{{classData[addPlayerData.class].skills_num}}</b> Skill Proficiences</label>\
                <fieldset>\
                  <template v-for="(skill, index) in classData[addPlayerData.class].skills">\
                    <input v-model="addPlayerData.classSkills" name="classSkills" :id="\'s\' + index" :value="skill" type="checkbox" />\
                    <label :for="\'s\' + index" :class="backgroundData[addPlayerData.background].skill_proficiencies.includes(skill) || raceSkills.includes(skill) ? \'disabled\' : \'\'">\
                      <span>{{skillData[skill].full}}</span>\
                      <span class="covered">{{backgroundData[addPlayerData.background].skill_proficiencies.includes(skill) ? addPlayerData.background : raceSkills.includes(skill) ? addPlayerData.race : \'\'}}</span>\
                    </label>\
                  </template>\
                </fieldset>\
                <div class="selection-results">\
                  <input class="capitalize" :value="addPlayerData.classSkills.join(\', \').replace(/_/g, \' \')" type="text" required />\
                  <transition name="fade">\
                    <button v-if="addPlayerData.classSkills.length" @click.prevent="addPlayerData.classSkills = []"><svg><use xlink:href="sprites.svg#clear"></use></svg></button>\
                  </transition>\
                </div>\
              </div>\
              <div class="col-xs-6">\
                <label class="class-label">Choose Equipment</label>\
                <template v-for="(equipments, index) in classData[addPlayerData.class].equipment">\
                  <fieldset v-if="Array.isArray(equipments)">\
                    <template v-for="(equipment, index2) in equipments">\
                      <input v-model="addPlayerData.classEquipment[index]" :name="\'e\' + index" :id="\'e\' + index + \'_\' + index2" :value="equipment" type="radio" required />\
                      <label :for="\'e\' + index + \'_\' + index2">{{Array.isArray(equipment) ? equipment.join(\', \') : equipment}}</label>\
                    </template>\
                  </fieldset>\
                </template>\
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
