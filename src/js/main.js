function roll(odds) {
  // Number
  if (!isNaN(odds)) {
    return Math.floor(Math.random() * odds) + 1;
  }
  // Dice
  else if (/^\d+d\d+$/.test(odds)) {
    var d = odds.split('d');
    var r = 0;
    for (var i = 0; i < Number(d[0]); i++) {
      r += Math.floor(Math.random() * Number(d[1])) + 1;
    }
    return r;
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

Vue.component('character', {
  props: ['side', 'c'],
  data: function() {
    return {
      races: jsonRaceData,
      classes: jsonClassData,
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
  computed: {
    race: function() {
      if (sr = this.c.subrace) {
        if (jsonRaceData[this.c.subrace]) {
          this.c.race = sr;
        }
        else {
          for (var i = 0; i < Object.keys(jsonRaceData).length; i++) {
            var item = Object.keys(jsonRaceData)[i];
            if (jsonRaceData[item].subraces) {
              if (jsonRaceData[item].subraces[sr]) {
                this.c.race = item;
              }
            }
          }
        }
        return this.c.race;
      }
    },
    level: function() {
      if (this.c.exp < 300) {
        this.c.pb = 2;
        this.c.level = 1;
      }
      else if (this.c.exp < 900) {
        this.c.pb = 2;
        this.c.level = 2;
      }
      else if (this.c.exp < 2700) {
        this.c.pb = 2;
        this.c.level = 3;
      }
      else if (this.c.exp < 6500) {
        this.c.pb = 2;
        this.c.level = 4;
      }
      else if (this.c.exp < 14000) {
        this.c.pb = 3;
        this.c.level = 5;
      }
      else if (this.c.exp < 23000) {
        this.c.pb = 3;
        this.c.level = 6;
      }
      else if (this.c.exp < 34000) {
        this.c.pb = 3;
        this.c.level = 7;
      }
      else if (this.c.exp < 48000) {
        this.c.pb = 3;
        this.c.level = 8;
      }
      else if (this.c.exp < 64000) {
        this.c.pb = 4;
        this.c.level = 9;
      }
      else if (this.c.exp < 85000) {
        this.c.pb = 4;
        this.c.level = 10;
      }
      else if (this.c.exp < 100000) {
        this.c.pb = 4;
        this.c.level = 11;
      }
      else if (this.c.exp < 120000) {
        this.c.pb = 4;
        this.c.level = 12;
      }
      else if (this.c.exp < 140000) {
        this.c.pb = 5;
        this.c.level = 13;
      }
      else if (this.c.exp < 165000) {
        this.c.pb = 5;
        this.c.level = 14;
      }
      else if (this.c.exp < 195000) {
        this.c.pb = 5;
        this.c.level = 15;
      }
      else if (this.c.exp < 225000) {
        this.c.pb = 5;
        this.c.level = 16;
      }
      else if (this.c.exp < 265000) {
        this.c.pb = 6;
        this.c.level = 17;
      }
      else if (this.c.exp < 305000) {
        this.c.pb = 6;
        this.c.level = 18;
      }
      else if (this.c.exp < 335000) {
        this.c.pb = 6;
        this.c.level = 19;
      }
      else {
        this.c.pb = 6;
        this.c.level = 20;
      }
      return this.c.level;
    },
    hitDie: function() {
      if (this.c.klass) {
        this.c.hitDie = this.c.level + jsonClassData[this.c.klass].hit_die;
        return this.c.hitDie;
      }
    },
    size: function() {
      if (this.c.race) {
        this.c.size = jsonRaceData[this.c.race].size;
        return this.c.size;
      }
    },
    speed: function() {
      if (this.c.subrace) {
        if (this.c.subrace != this.c.race) {
          this.c.speed = jsonRaceData[this.c.race].subraces[this.c.subrace].speed;
        }
        else {
          this.c.speed = jsonRaceData[this.c.race].speed;
        }
        return this.c.speed;
      }
    },
    spellCastingAbility: function() {
      if (this.c.klass) {
        this.c.spellCastingAbility = jsonClassData[this.c.klass].spell_casting_ability;
        return this.c.spellCastingAbility;
      }
    },
    spellSavingDC: function() {
      if (this.c.klass) {
        var a = jsonClassData[this.c.klass].spell_casting_ability;
        if (a) {
          this.c.spellSavingDC = 8 + this.c.pb + mod(this.c[a.substring(0,3).toLowerCase()]);
        }
        else {
          this.c.spellSavingDC = '';
        }
        return this.c.spellSavingDC;
      }
    },
    cantripsKnown: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.cantripsKnown = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 3) {
          this.c.cantripsKnown = 2;
        }
        else if (this.c.level <= 9) {
          this.c.cantripsKnown = 3;
        }
        else {
          this.c.cantripsKnown = 4;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 3) {
          this.c.cantripsKnown = 3;
        }
        else if (this.c.level <= 9) {
          this.c.cantripsKnown = 4;
        }
        else {
          this.c.cantripsKnown = 5;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 3) {
          this.c.cantripsKnown = 2;
        }
        else if (this.c.level <= 9) {
          this.c.cantripsKnown = 3;
        }
        else {
          this.c.cantripsKnown = 4;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.cantripsKnown = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.cantripsKnown = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        this.c.cantripsKnown = 0;
      }
      else if (this.c.klass == 'Ranger') {
        this.c.cantripsKnown = 0;
      }
      else if (this.c.klass == 'Rogue') {
        this.c.cantripsKnown = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 3) {
          this.c.cantripsKnown = 4;
        }
        else if (this.c.level <= 10) {
          this.c.cantripsKnown = 5;
        }
        else {
          this.c.cantripsKnown = 6;
        }
      }
      else if (this.c.klass == 'Warlock') {
        if (this.c.level <= 3) {
          this.c.cantripsKnown = 2;
        }
        else if (this.c.level <= 9) {
          this.c.cantripsKnown = 3;
        }
        else {
          this.c.cantripsKnown = 4;
        }
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 3) {
          this.c.cantripsKnown = 3;
        }
        else if (this.c.level <= 9) {
          this.c.cantripsKnown = 4;
        }
        else {
          this.c.cantripsKnown = 5;
        }
      }
      return this.c.cantripsKnown;
    },
    spellsKnown: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellsKnown = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 9) {
          this.c.spellsKnown = this.c.level + 3;
        }
        else if (this.c.level <= 10) {
          this.c.spellsKnown = 14;
        }
        else if (this.c.level <= 12) {
          this.c.spellsKnown = 15;
        }
        else if (this.c.level <= 13) {
          this.c.spellsKnown = 16;
        }
        else if (this.c.level <= 14) {
          this.c.spellsKnown = 18;
        }
        else if (this.c.level <= 16) {
          this.c.spellsKnown = 19;
        }
        else if (this.c.level <= 17) {
          this.c.spellsKnown = 20;
        }
        else {
          this.c.spellsKnown = 22;
        }
      }
      else if (this.c.klass == 'Cleric') {
        this.c.spellsKnown = (this.c.abilities.wisdom.mod + this.c.level < 1) ? 1 : this.c.abilies.wisdom.mod + this.c.level;
      }
      else if (this.c.klass == 'Druid') {
        this.c.spellsKnown = (this.c.abilities.wisdom.mod + this.c.level < 1) ? 1 : this.c.abilies.wisdom.mod + this.c.level;
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellsKnown = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellsKnown = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        this.c.spellsKnown = (this.c.abilities.charisma.mod + Math.floor(this.c.level/2) < 1) ? 1 : this.c.abilies.charisma.mod + Math.floor(this.c.level/2);
      }
      else if (this.c.klass == 'Ranger') {
        if (this.c.level <= 1) {
          this.c.spellsKnown = 0;
        }
        else if (this.c.level <= 2) {
          this.c.spellsKnown = 2;
        }
        else if (this.c.level <= 4) {
          this.c.spellsKnown = 3;
        }
        else if (this.c.level <= 6) {
          this.c.spellsKnown = 4;
        }
        else if (this.c.level <= 8) {
          this.c.spellsKnown = 5;
        }
        else if (this.c.level <= 10) {
          this.c.spellsKnown = 6;
        }
        else if (this.c.level <= 12) {
          this.c.spellsKnown = 7;
        }
        else if (this.c.level <= 14) {
          this.c.spellsKnown = 8;
        }
        else if (this.c.level <= 16) {
          this.c.spellsKnown = 9;
        }
        else if (this.c.level <= 18) {
          this.c.spellsKnown = 10;
        }
        else {
          this.c.spellsKnown = 11;
        }
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellsKnown = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 10) {
          this.c.spellsKnown = this.c.level + 1;
        }
        else if (this.c.level <= 12) {
          this.c.spellsKnown = 12;
        }
        else if (this.c.level <= 14) {
          this.c.spellsKnown = 13;
        }
        else if (this.c.level <= 16) {
          this.c.spellsKnown = 14;
        }
        else {
          this.c.spellsKnown = 15;
        }
      }
      else if (this.c.klass == 'Warlock') {
        if (this.c.level <= 8) {
          this.c.spellsKnown = this.c.level + 1;
        }
        else if (this.c.level <= 10) {
          this.c.spellsKnown = 10;
        }
        else if (this.c.level <= 12) {
          this.c.spellsKnown = 11;
        }
        else if (this.c.level <= 14) {
          this.c.spellsKnown = 12;
        }
        else if (this.c.level <= 16) {
          this.c.spellsKnown = 13;
        }
        else if (this.c.level <= 18) {
          this.c.spellsKnown = 14;
        }
        else {
          this.c.spellsKnown = 15;
        }
      }
      else if (this.c.klass == 'Wizard') {
        this.c.spellsKnown = (this.c.abilities.intelligence.mod + this.c.level < 1) ? 1 : this.c.abilies.intelligence.mod + this.c.level;
      }
      return this.c.spellsKnown;
    },
    level1Slots: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellSlots.level1Slots = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 1) {
          this.c.spellSlots.level1Slots = 2;
        }
        else if (this.c.level <= 2) {
          this.c.spellSlots.level1Slots = 3;
        }
        else {
          this.c.spellSlots.level1Slots = 4;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 1) {
          this.c.spellSlots.level1Slots = 2;
        }
        else if (this.c.level <= 2) {
          this.c.spellSlots.level1Slots = 3;
        }
        else {
          this.c.spellSlots.level1Slots = 4;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 1) {
          this.c.spellSlots.level1Slots = 2;
        }
        else if (this.c.level <= 2) {
          this.c.spellSlots.level1Slots = 3;
        }
        else {
          this.c.spellSlots.level1Slots = 4;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellSlots.level1Slots = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellSlots.level1Slots = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        if (this.c.level <= 1) {
          this.c.spellSlots.level1Slots = 0;
        }
        else if (this.c.level <= 2) {
          this.c.spellSlots.level1Slots = 2;
        }
        else if (this.c.level <= 4) {
          this.c.spellSlots.level1Slots = 3;
        }
        else {
          this.c.spellSlots.level1Slots = 4;
        }
      }
      else if (this.c.klass == 'Ranger') {
        if (this.c.level <= 1) {
          this.c.spellSlots.level1Slots = 0;
        }
        else if (this.c.level <= 2) {
          this.c.spellSlots.level1Slots = 2;
        }
        else if (this.c.level <= 4) {
          this.c.spellSlots.level1Slots = 3;
        }
        else {
          this.c.spellSlots.level1Slots = 4;
        }
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellSlots.level1Slots = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 1) {
          this.c.spellSlots.level1Slots = 2;
        }
        else if (this.c.level <= 2) {
          this.c.spellSlots.level1Slots = 3;
        }
        else {
          this.c.spellSlots.level1Slots = 4;
        }
      }
      else if (this.c.klass == 'Warlock') {
        if (this.c.level == 1) {
          this.c.spellSlots.level1Slots = 1;
        }
        else if (this.c.level == 2) {
          this.c.spellSlots.level1Slots = 2;
        }
        else {
          this.c.spellSlots.level1Slots = 0;
        }
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 1) {
          this.c.spellSlots.level1Slots = 2;
        }
        else if (this.c.level <= 2) {
          this.c.spellSlots.level1Slots = 3;
        }
        else {
          this.c.spellSlots.level1Slots = 4;
        }
      }
      return this.c.spellSlots.level1Slots;
    },
    level2Slots: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellSlots.level2Slots = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 2) {
          this.c.spellSlots.level2Slots = 0;
        }
        else if (this.c.level <= 3) {
          this.c.spellSlots.level2Slots = 2;
        }
        else {
          this.c.spellSlots.level2Slots = 3;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 2) {
          this.c.spellSlots.level2Slots = 0;
        }
        else if (this.c.level <= 3) {
          this.c.spellSlots.level2Slots = 2;
        }
        else {
          this.c.spellSlots.level2Slots = 3;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 2) {
          this.c.spellSlots.level2Slots = 0;
        }
        else if (this.c.level <= 3) {
          this.c.spellSlots.level2Slots = 2;
        }
        else {
          this.c.spellSlots.level2Slots = 3;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellSlots.level2Slots = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellSlots.level2Slots = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        if (this.c.level <= 4) {
          this.c.spellSlots.level2Slots = 0;
        }
        else if (this.c.level <= 6) {
          this.c.spellSlots.level2Slots = 2;
        }
        else {
          this.c.spellSlots.level2Slots = 3;
        }
      }
      else if (this.c.klass == 'Ranger') {
        if (this.c.level <= 4) {
          this.c.spellSlots.level2Slots = 0;
        }
        else if (this.c.level <= 6) {
          this.c.spellSlots.level2Slots = 2;
        }
        else {
          this.c.spellSlots.level2Slots = 3;
        }
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellSlots.level2Slots = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 2) {
          this.c.spellSlots.level2Slots = 0;
        }
        else if (this.c.level <= 3) {
          this.c.spellSlots.level2Slots = 2;
        }
        else {
          this.c.spellSlots.level2Slots = 3;
        }
      }
      else if (this.c.klass == 'Warlock') {
        if (this.c.level == 3) {
          this.c.spellSlots.level2Slots = 2;
        }
        else if (this.c.level == 4) {
          this.c.spellSlots.level2Slots = 2;
        }
        else {
          this.c.spellSlots.level2Slots = 0;
        }
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 2) {
          this.c.spellSlots.level2Slots = 0;
        }
        else if (this.c.level <= 3) {
          this.c.spellSlots.level2Slots = 2;
        }
        else {
          this.c.spellSlots.level2Slots = 3;
        }
      }
      return this.c.spellSlots.level2Slots;
    },
    level3Slots: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellSlots.level3Slots = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 4) {
          this.c.spellSlots.level3Slots = 0;
        }
        else if (this.c.level <= 5) {
          this.c.spellSlots.level3Slots = 2;
        }
        else {
          this.c.spellSlots.level3Slots = 3;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 4) {
          this.c.spellSlots.level3Slots = 0;
        }
        else if (this.c.level <= 5) {
          this.c.spellSlots.level3Slots = 2;
        }
        else {
          this.c.spellSlots.level3Slots = 3;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 4) {
          this.c.spellSlots.level3Slots = 0;
        }
        else if (this.c.level <= 5) {
          this.c.spellSlots.level3Slots = 2;
        }
        else {
          this.c.spellSlots.level3Slots = 3;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellSlots.level3Slots = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellSlots.level3Slots = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        if (this.c.level <= 8) {
          this.c.spellSlots.level3Slots = 0;
        }
        else if (this.c.level <= 10) {
          this.c.spellSlots.level3Slots = 2;
        }
        else {
          this.c.spellSlots.level3Slots = 3;
        }
      }
      else if (this.c.klass == 'Ranger') {
        if (this.c.level <= 8) {
          this.c.spellSlots.level3Slots = 0;
        }
        else if (this.c.level <= 10) {
          this.c.spellSlots.level3Slots = 2;
        }
        else {
          this.c.spellSlots.level3Slots = 3;
        }
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellSlots.level3Slots = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 4) {
          this.c.spellSlots.level3Slots = 0;
        }
        else if (this.c.level <= 5) {
          this.c.spellSlots.level3Slots = 2;
        }
        else {
          this.c.spellSlots.level3Slots = 3;
        }
      }
      else if (this.c.klass == 'Warlock') {
        if (this.c.level == 5) {
          this.c.spellSlots.level3Slots = 2;
        }
        else if (this.c.level == 6) {
          this.c.spellSlots.level3Slots = 2;
        }
        else {
          this.c.spellSlots.level3Slots = 0;
        }
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 4) {
          this.c.spellSlots.level3Slots = 0;
        }
        else if (this.c.level <= 5) {
          this.c.spellSlots.level3Slots = 2;
        }
        else {
          this.c.spellSlots.level3Slots = 3;
        }
      }
      return this.c.spellSlots.level3Slots;
    },
    level4Slots: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellSlots.level4Slots = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 6) {
          this.c.spellSlots.level4Slots = 0;
        }
        else if (this.c.level <= 7) {
          this.c.spellSlots.level4Slots = 1;
        }
        else if (this.c.level <= 8) {
          this.c.spellSlots.level4Slots = 2;
        }
        else {
          this.c.spellSlots.level4Slots = 3;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 6) {
          this.c.spellSlots.level4Slots = 0;
        }
        else if (this.c.level <= 7) {
          this.c.spellSlots.level4Slots = 1;
        }
        else if (this.c.level <= 8) {
          this.c.spellSlots.level4Slots = 2;
        }
        else {
          this.c.spellSlots.level4Slots = 3;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 6) {
          this.c.spellSlots.level4Slots = 0;
        }
        else if (this.c.level <= 7) {
          this.c.spellSlots.level4Slots = 1;
        }
        else if (this.c.level <= 8) {
          this.c.spellSlots.level4Slots = 2;
        }
        else {
          this.c.spellSlots.level4Slots = 3;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellSlots.level4Slots = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellSlots.level4Slots = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        if (this.c.level <= 12) {
          this.c.spellSlots.level4Slots = 0;
        }
        else if (this.c.level <= 14) {
          this.c.spellSlots.level4Slots = 1;
        }
        else if (this.c.level <= 16) {
          this.c.spellSlots.level4Slots = 2;
        }
        else {
          this.c.spellSlots.level4Slots = 3;
        }
      }
      else if (this.c.klass == 'Ranger') {
        if (this.c.level <= 12) {
          this.c.spellSlots.level4Slots = 0;
        }
        else if (this.c.level <= 14) {
          this.c.spellSlots.level4Slots = 1;
        }
        else if (this.c.level <= 16) {
          this.c.spellSlots.level4Slots = 2;
        }
        else {
          this.c.spellSlots.level4Slots = 3;
        }
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellSlots.level4Slots = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 6) {
          this.c.spellSlots.level4Slots = 0;
        }
        else if (this.c.level <= 7) {
          this.c.spellSlots.level4Slots = 1;
        }
        else if (this.c.level <= 8) {
          this.c.spellSlots.level4Slots = 2;
        }
        else {
          this.c.spellSlots.level4Slots = 3;
        }
      }
      else if (this.c.klass == 'Warlock') {
        if (this.c.level == 7) {
          this.c.spellSlots.level4Slots = 2;
        }
        else if (this.c.level == 8) {
          this.c.spellSlots.level4Slots = 2;
        }
        else {
          this.c.spellSlots.level4Slots = 0;
        }
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 6) {
          this.c.spellSlots.level4Slots = 0;
        }
        else if (this.c.level <= 7) {
          this.c.spellSlots.level4Slots = 1;
        }
        else if (this.c.level <= 8) {
          this.c.spellSlots.level4Slots = 2;
        }
        else {
          this.c.spellSlots.level4Slots = 3;
        }
      }
      return this.c.spellSlots.level4Slots;
    },
    level5Slots: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellSlots.level5Slots = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 8) {
          this.c.spellSlots.level5Slots = 0;
        }
        else if (this.c.level <= 9) {
          this.c.spellSlots.level5Slots = 1;
        }
        else if (this.c.level <= 17) {
          this.c.spellSlots.level5Slots = 2;
        }
        else {
          this.c.spellSlots.level5Slots = 3;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 8) {
          this.c.spellSlots.level5Slots = 0;
        }
        else if (this.c.level <= 9) {
          this.c.spellSlots.level5Slots = 1;
        }
        else if (this.c.level <= 17) {
          this.c.spellSlots.level5Slots = 2;
        }
        else {
          this.c.spellSlots.level5Slots = 3;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 8) {
          this.c.spellSlots.level5Slots = 0;
        }
        else if (this.c.level <= 9) {
          this.c.spellSlots.level5Slots = 1;
        }
        else if (this.c.level <= 17) {
          this.c.spellSlots.level5Slots = 2;
        }
        else {
          this.c.spellSlots.level5Slots = 3;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellSlots.level5Slots = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellSlots.level5Slots = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        if (this.c.level <= 16) {
          this.c.spellSlots.level5Slots = 0;
        }
        else if (this.c.level <= 18) {
          this.c.spellSlots.level5Slots = 1;
        }
        else {
          this.c.spellSlots.level5Slots = 2;
        }
      }
      else if (this.c.klass == 'Ranger') {
        if (this.c.level <= 16) {
          this.c.spellSlots.level5Slots = 0;
        }
        else if (this.c.level <= 18) {
          this.c.spellSlots.level5Slots = 1;
        }
        else {
          this.c.spellSlots.level5Slots = 2;
        }
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellSlots.level5Slots = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 8) {
          this.c.spellSlots.level5Slots = 0;
        }
        else if (this.c.level <= 9) {
          this.c.spellSlots.level5Slots = 1;
        }
        else if (this.c.level <= 17) {
          this.c.spellSlots.level5Slots = 2;
        }
        else {
          this.c.spellSlots.level5Slots = 3;
        }
      }
      else if (this.c.klass == 'Warlock') {
        if (this.c.level <= 8) {
          this.c.spellSlots.level5Slots = 0;
        }
        if (this.c.level >= 9 && this.c.level <= 10) {
          this.c.spellSlots.level5Slots = 2;
        }
        else if (this.c.level >= 11 && this.c.level <= 16) {
          this.c.spellSlots.level5Slots = 3;
        }
        else {
          this.c.spellSlots.level5Slots = 4;
        }
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 8) {
          this.c.spellSlots.level5Slots = 0;
        }
        else if (this.c.level <= 9) {
          this.c.spellSlots.level5Slots = 1;
        }
        else if (this.c.level <= 17) {
          this.c.spellSlots.level5Slots = 2;
        }
        else {
          this.c.spellSlots.level5Slots = 3;
        }
      }
      return this.c.spellSlots.level5Slots;
    },
    level6Slots: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellSlots.level6Slots = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 10) {
          this.c.spellSlots.level6Slots = 0;
        }
        else if (this.c.level <= 18) {
          this.c.spellSlots.level6Slots = 1;
        }
        else {
          this.c.spellSlots.level6Slots = 2;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 10) {
          this.c.spellSlots.level6Slots = 0;
        }
        else if (this.c.level <= 18) {
          this.c.spellSlots.level6Slots = 1;
        }
        else {
          this.c.spellSlots.level6Slots = 2;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 10) {
          this.c.spellSlots.level6Slots = 0;
        }
        else if (this.c.level <= 18) {
          this.c.spellSlots.level6Slots = 1;
        }
        else {
          this.c.spellSlots.level6Slots = 2;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellSlots.level6Slots = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellSlots.level6Slots = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        this.c.spellSlots.level6Slots = 0;
      }
      else if (this.c.klass == 'Ranger') {
        this.c.spellSlots.level6Slots = 0;
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellSlots.level6Slots = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 10) {
          this.c.spellSlots.level6Slots = 0;
        }
        else if (this.c.level <= 18) {
          this.c.spellSlots.level6Slots = 1;
        }
        else {
          this.c.spellSlots.level6Slots = 2;
        }
      }
      else if (this.c.klass == 'Warlock') {
        this.c.spellSlots.level6Slots = 0;
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 10) {
          this.c.spellSlots.level6Slots = 0;
        }
        else if (this.c.level <= 18) {
          this.c.spellSlots.level6Slots = 1;
        }
        else {
          this.c.spellSlots.level6Slots = 2;
        }
      }
      return this.c.spellSlots.level6Slots;
    },
    level7Slots: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellSlots.level7Slots = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 12) {
          this.c.spellSlots.level7Slots = 0;
        }
        else if (this.c.level <= 19) {
          this.c.spellSlots.level7Slots = 1;
        }
        else {
          this.c.spellSlots.level7Slots = 2;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 12) {
          this.c.spellSlots.level7Slots = 0;
        }
        else if (this.c.level <= 19) {
          this.c.spellSlots.level7Slots = 1;
        }
        else {
          this.c.spellSlots.level7Slots = 2;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 12) {
          this.c.spellSlots.level7Slots = 0;
        }
        else if (this.c.level <= 19) {
          this.c.spellSlots.level7Slots = 1;
        }
        else {
          this.c.spellSlots.level7Slots = 2;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellSlots.level7Slots = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellSlots.level7Slots = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        this.c.spellSlots.level7Slots = 0;
      }
      else if (this.c.klass == 'Ranger') {
        this.c.spellSlots.level7Slots = 0;
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellSlots.level7Slots = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 12) {
          this.c.spellSlots.level7Slots = 0;
        }
        else if (this.c.level <= 19) {
          this.c.spellSlots.level7Slots = 1;
        }
        else {
          this.c.spellSlots.level7Slots = 2;
        }
      }
      else if (this.c.klass == 'Warlock') {
        this.c.spellSlots.level7Slots = 0;
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 12) {
          this.c.spellSlots.level7Slots = 0;
        }
        else if (this.c.level <= 19) {
          this.c.spellSlots.level7Slots = 1;
        }
        else {
          this.c.spellSlots.level7Slots = 2;
        }
      }
      return this.c.spellSlots.level7Slots;
    },
    level8Slots: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellSlots.level8Slots = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 14) {
          this.c.spellSlots.level8Slots = 0;
        }
        else {
          this.c.spellSlots.level8Slots = 1;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 14) {
          this.c.spellSlots.level8Slots = 0;
        }
        else {
          this.c.spellSlots.level8Slots = 1;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 14) {
          this.c.spellSlots.level8Slots = 0;
        }
        else {
          this.c.spellSlots.level8Slots = 1;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellSlots.level8Slots = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellSlots.level8Slots = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        this.c.spellSlots.level8Slots = 0;
      }
      else if (this.c.klass == 'Ranger') {
        this.c.spellSlots.level8Slots = 0;
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellSlots.level8Slots = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 14) {
          this.c.spellSlots.level8Slots = 0;
        }
        else {
          this.c.spellSlots.level8Slots = 1;
        }
      }
      else if (this.c.klass == 'Warlock') {
        this.c.spellSlots.level8Slots = 0;
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 14) {
          this.c.spellSlots.level8Slots = 0;
        }
        else {
          this.c.spellSlots.level8Slots = 1;
        }
      }
      return this.c.spellSlots.level8Slots;
    },
    level9Slots: function() {
      if (this.c.klass == 'Barbarian') {
        this.c.spellSlots.level9Slots = 0;
      }
      else if (this.c.klass == 'Bard') {
        if (this.c.level <= 16) {
          this.c.spellSlots.level9Slots = 0;
        }
        else {
          this.c.spellSlots.level9Slots = 1;
        }
      }
      else if (this.c.klass == 'Cleric') {
        if (this.c.level <= 16) {
          this.c.spellSlots.level9Slots = 0;
        }
        else {
          this.c.spellSlots.level9Slots = 1;
        }
      }
      else if (this.c.klass == 'Druid') {
        if (this.c.level <= 16) {
          this.c.spellSlots.level9Slots = 0;
        }
        else {
          this.c.spellSlots.level9Slots = 1;
        }
      }
      else if (this.c.klass == 'Fighter') {
        this.c.spellSlots.level9Slots = 0;
        // Eldritch Knight gets spells
      }
      else if (this.c.klass == 'Monk') {
        this.c.spellSlots.level9Slots = 0;
        // Monk has ki
      }
      else if (this.c.klass == 'Paladin') {
        this.c.spellSlots.level9Slots = 0;
      }
      else if (this.c.klass == 'Ranger') {
        this.c.spellSlots.level9Slots = 0;
      }
      else if (this.c.klass == 'Rogue') {
        this.c.spellSlots.level9Slots = 0;
        // Arcane Trickster gets spells
      }
      else if (this.c.klass == 'Sorcerer') {
        if (this.c.level <= 16) {
          this.c.spellSlots.level9Slots = 0;
        }
        else {
          this.c.spellSlots.level9Slots = 1;
        }
      }
      else if (this.c.klass == 'Warlock') {
        this.c.spellSlots.level9Slots = 0;
      }
      else if (this.c.klass == 'Wizard') {
        if (this.c.level <= 16) {
          this.c.spellSlots.level9Slots = 0;
        }
        else {
          this.c.spellSlots.level9Slots = 1;
        }
      }
      return this.c.spellSlots.level9Slots;
    },
  },
  template: '<div class="character">\
    <div class="character-header">\
      <input v-model="c.name" type="text" />\
      <button @click="clear()">\
        <svg><use xlink:href="sprites.svg#close"></use></svg>\
      </button>\
    </div>\
    <div class="character-content">\
      <div class="character-section">\
        <button @click="expand()" class="character-section-header">\
          <h3>Info</h3>\
          <svg><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div class="character-section-content">\
          <div class="row">\
            <div class="input-group col-xs-6">\
              <label>R</label>\
              <select v-model="c.subrace">\
                <template v-for="(value, key) in races">\
                  <optgroup v-if="value.subraces" :label="key">\
                    <option v-for="(value2, key2) in value.subraces">{{key2}}</option>\
                  </optgroup>\
                  <option v-else>{{key}}</option>\
                </template>\
              </select>\
            </div>\
            <div class="input-group col-xs-6">\
              <label>C</label>\
              <select v-model="c.klass">\
                <option v-for="(value, key) in classes">{{key}}</option>\
              </select>\
            </div>\
          </div>\
          <div class="row">\
            <div class="input-group col-xs-12">\
              <label>Background</label>\
              <input v-model="c.background" type="text" required>\
            </div>\
          </div>\
          <div class="row">\
            <div class="input-group col-xs-6">\
              <label>Alignment</label>\
              <select v-model="c.alignment">\
                <option v-for="alignment in alignments">{{alignment}}</option>\
              </select>\
            </div>\
            <div class="input-group col-xs-6">\
              <label>Size</label>\
              <input v-model="size" type="text" readonly />\
            </div>\
          </div>\
        </div>\
      </div>\
      class="character-section">\
        <div class="character-section-header">\
          <h3>Combat</h3>\
        </div>\
        <div class="character-section-content">\
          <div class="row">\
            <div class="input-group col-xs-4">\
              <label>Hit Points</label>\
              <input class="hp" v-model="c.currentHP" type="number" /><span>/</span><input class="hp" v-model="c.maxHP" type="number" />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Hit Die</label>\
              <input v-model="hitDie" type="text" readonly />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Armor Class</label>\
              <input v-model="c.armorClass" type="number" readonly />\
            </div>\
          </div>\
          <div class="row">\
            <div class="input-group col-xs-4">\
              <label>Spellcasting Ability</label>\
              <input v-model="c.spellAbility" type="text" readonly />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Spellcasting Attack Mod</label>\
              <input v-model="c.spellAttackMod" type="number" readonly />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Spellcasting Save DC</label>\
              <input v-model="c.spellDC" type="number" readonly />\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="character-section">\
        <div class="character-section-header">\
          <h3>Stats</h3>\
        </div>\
        <div class="character-section-content">\
          <div class="row">\
            <div class="input-group col-xs-4">\
              <label>Exp</label>\
              <input v-model="c.exp" type="number" />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Level</label>\
              <input v-model="level" type="number" readonly />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Proficiency Bonus</label>\
              <input v-model="c.pb" type="number" readonly />\
            </div>\
          </div>\
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
        <div class="character-section-header">\
          <h3>Inventory</h3>\
        </div>\
        <div class="character-section-content">\
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

Vue.component('characters', {
  data: function() {
    return {
      left: '',
      right: '',
      characterSelect: false,
      characters: []
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
        race: '',
        subrace: '',
        klass: '',
        subclass: '',
        background: '',
        alignment: '',
        size: '',
        currentHP: 0,
        maxHP: 0,
        armorClass: 0,
        spellAbility: '',
        spellAttackMod: 0,
        spellSavingDC: 0,
        speed: 0,
        exp: 0,
        pb: 2,
        cantripsKnown: 0,
        spellsKnown: 0,
        spellSlots: spellSlots,
        abilities: abilities,
        saves: saves,
        skills: skills
      });
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
    <aside class="characterList">\
      <ul class="sortable">\
        <li v-for="(character, index) in characters" :key="character.id">\
          <p>{{character.name}}</p>\
          <button @click="leftBtn(index)">Left</button>\
          <button @click="rightBtn(index)">Right</button>\
        </li>\
      </ul>\
      <button @click="addCharacter()">Add Character</button>\
    </aside>\
    <main class="comparisons row">\
      <div class="col-sm-6">\
        <transition name="modal">\
          <character v-if="left" id="compare-left" :c="left" @clear="clearLeft()"></character>\
          <div v-else class="characterPlaceholder"></div>\
        </transition>\
      </div>\
      <div class="col-sm-6">\
        <transition name="modal">\
          <character v-if="right" id="compare-right" :c="right" @clear="clearRight()"></character>\
          <div v-else class="characterPlaceholder"></div>\
        </transition>\
      </div>\
    </main>\
    <transition name="modal">\
      <div v-if="characterSelect" class="modal">\
        <div class="modal-header">\
        </div>\
        <div class="modal-content">\
          <button @click="addPlayer()">Add Player</button>\
          <button @click="addCreature()">Add Creature</button>\
        </div>\
      </div>\
    </transition>\
  </div>'
});

var world = new Vue({
  el: '#world',
  data: {

  }
});

var mainVue = new Vue({
  el: '#main',
  data: {
    slide: 'characters',
    search: ''
  }
});

var start = 0;
var end = 0;
jQuery('.sortable').sortable({
  axis: 'y',
  // handle: '.sortable-handle',
  // cursor: 'ns-resize',
  placeholder: 'sortable-placeholder',
  forcePlaceholderSize: true,
  start: function(e, ui) {
    start = ui.item.index();
  },
  stop: function(e, ui) {
    end = ui.item.index();
    mainVue.characters.splice(end, 0, mainVue.characters.splice(start, 1)[0]);
  }
});
