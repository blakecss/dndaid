Vue.component('player', {
  props: ['side', 'c'],
  data: function() {
    var spells = {};
    return {
      alignmentData: jsonAlignmentData,
      abilityData: jsonAbilityData,
      skillData: jsonSkillData,
      spellData: jsonSpellData,
      languages: ['Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon']
    }
  },
  filters: {
    mod: function(value) {
      var v = Math.floor((value - 10) / 2);
      return v >= 0 ? '+' + v : v;
    }
  },
  computed: {
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
    armorClass: function() {
      return 10 + mod(this.c.abilities.dex);
    },
    spellAbility: function() {
      if (sca = jsonClassData[this.c.klass].spell_casting_ability) {
        return jsonAbilityData[sca].full + '?';
      }
      else {
        return '';
      }
    },
    // spellSavingDC: function() {
    //   if (this.c.klass) {
    //     var a = jsonClassData[this.c.klass].spell_casting_ability;
    //     if (a) {
    //       this.c.spellSavingDC = 8 + this.c.pb + mod(this.c.abilities[a]);
    //     }
    //     else {
    //       this.c.spellSavingDC = '';
    //     }
    //     return this.c.spellSavingDC;
    //   }
    // },
    // spellAttackMod: function() {
    //   this.c.spellAttackMod = this.c.pb + mod(this.c.abilities[this.c.spellAbility]);
    //   return this.c.spellAttackMod;
    // },
    saves: function() {
      var s = {}
      for (var i = 0; i < Object.keys(jsonAbilityData).length; i++) {
        var a = Object.keys(jsonAbilityData)[i];
        var v = Math.floor((this.c.abilities[a] - 10) / 2);
        if (this.c.saves[a]) {
          v = v + this.c.pb;
        }
        s[a] = v >= 0 ? '+' + v : v;
      }
      return s;
    },
    skills: function() {
      var ss = {}
      for (var i = 0; i < Object.keys(jsonSkillData).length; i++) {
        var s = Object.keys(jsonSkillData)[i];
        var ra = jsonSkillData[s].rel_ability;
        var v = Math.floor((this.c.abilities[ra] - 10) / 2);
        if (this.c.skills[s]) {
          v = v + this.c.pb;
        }
        ss[s] = v >= 0 ? '+' + v : v;
      }
      return ss;
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
    filteredCantrips: function() {
      var cantrips = [];
      for (var i = 0; i < jsonSpellData.length; i++) {
        var s = jsonSpellData[i];
        if (s.level == 'Cantrip' && s.class.includes(this.c.klass)) {
          cantrips.push(s.name);
        }
      }
      return cantrips;
    },
    filteredSpells: function() {
      var spells = [];
      var maxLevel = 0;
      for (var i = 1; i < 10; i++) {
        if (this.c.spellSlots['level' + i + 'Slots'] > 0) {
          maxLevel = i;
        }
      }
      for (var i = 0; i < jsonSpellData.length; i++) {
        var s = jsonSpellData[i];
        if (s.level.charAt(0) <= maxLevel && s.class.includes(this.c.klass)) {
          spells.push(s.name + ' (lvl ' + s.level.charAt(0) + ')');
        }
      }
      return spells;
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
        this.c.spellsKnown = (mod(this.c.abilities.wis) + this.c.level < 1) ? 1 : mod(this.c.abilities.wis) + this.c.level;
      }
      else if (this.c.klass == 'Druid') {
        this.c.spellsKnown = (mod(this.c.abilities.wis) + this.c.level < 1) ? 1 : mod(this.c.abilities.wis) + this.c.level;
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
        this.c.spellsKnown = (mod(this.c.abilities.cha) + Math.floor(this.c.level/2) < 1) ? 1 : mod(this.c.abilities.cha) + Math.floor(this.c.level/2);
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
        this.c.spellsKnown = (mod(this.c.abilities.int) + this.c.level < 1) ? 1 : mod(this.c.abilities.int) + this.c.level;
      }
      return this.c.spellsKnown;
    },
    spellSlots: function() {
      var slots = {};
      for (var i = 1; i < 10; i++) {
        if (i == 1) {
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
        }
        else if (i == 2) {
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
        }
        else if (i == 3) {
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
        }
        else if (i == 4) {
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
        }
        else if (i == 5) {
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
        }
        else if (i == 6) {
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
        }
        else if (i == 7) {
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
        }
        else if (i == 8) {
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
        }
        else if (i == 9) {
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
        }
      }
      return this.c.spellSlots;
    },
    spellSlotsAvailable: function() {
      return 0;
    },
    sliderMax: function() {
      var output = [];
      for (var i = 1; i < 10; i++) {
        var arr = [];
        for (var ii = 0; ii < this.spellSlots['level' + i + 'Slots']; ii++) {
          arr.push(ii);
        }
        output[i-1] = arr;
      }
      return output;
    }
  },
  watch: {
    level: function(newVal, oldVal) {
      // if (newVal != oldVal) {
      //   for (var i = oldVal; i < newVal; i++) {
      //     for (var ii = 0; ii < jsonClassData[this.c.klass].features[i].length; ii++) {
      //       this.c.traits.push(jsonClassData[this.c.klass].features[i][ii]);
      //     }
      //   }
      // }
    }
  },
  template: '<div class="character">\
    <div class="character-header">\
      <div class="class-icon">\
        <svg><use :xlink:href="\'sprites.svg#\' + c.klass.toLowerCase()"></use></svg>\
      </div>\
      <div class="name">\
        <input v-model="c.name" type="text" placeholder="Name" />\
        <p class="subtitle">{{c.subrace}} {{c.klass}} ({{c.background}})</p>\
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
              <select v-model="c.alignment">\
                <option v-for="(value, key) in alignmentData">{{key}}</option>\
              </select>\
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
            <div class="input-group col-xs-4">\
              <label>Age</label>\
              <input v-model="c.age" type="number">\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Height</label>\
              <input v-model="c.height" type="text">\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Weight</label>\
              <input v-model="c.weight" type="text">\
            </div>\
            <div class="input-group col-xs-12">\
              <label>Languages</label>\
              <chips :chips="c.languages" :suggestions="languages"></chips>\
            </div>\
            <div class="input-group col-xs-12">\
              <label class="textarea-label">Notes</label>\
              <textarea v-model="c.notes"></textarea>\
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
            <div class="input-group col-xs-4" :title="armorClass">\
              <label>Armor Class</label>\
              <input v-model="c.armorClass" type="number" />\
            </div>\
            <div class="input-group col-xs-4" title="Dexterity Check">\
              <label>Initiative</label>\
              <input v-model="c.initiative" type="number" />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Hit Die</label>\
              <input v-model="hitDie" type="text" />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Speed</label>\
              <input v-model="c.speed" type="text" />\
            </div>\
            <div class="input-group col-xs-12">\
              <label>Resistances</label>\
              <chips :chips="c.resistances" :suggestions="languages"></chips>\
            </div>\
          </div>\
          <div class="row">\
            <h4>Spellcasting</h4>\
            <div class="input-group col-xs-4" :title="spellAbility">\
              <label>Ability</label>\
              <input v-model="c.spellAbility" type="text" />\
            </div>\
            <div class="input-group col-xs-4" title="Proficiency Bonus + Spellcasting Ability Modifier">\
              <label>Attack Modifier</label>\
              <input v-model="c.spellAttackMod" type="number" />\
            </div>\
            <div class="input-group col-xs-4" title="8 + Proficiency Bonus + Spellcasting Ability Modifier">\
              <label>Saving DC</label>\
              <input v-model="c.spellSavingDC" type="number" />\
            </div>\
            <div class="input-group col-xs-12">\
              <label>Cantrips Known (<span :class="c.cantrips.length > cantripsKnown ? \'warning\' : \'\'">{{c.cantrips.length + \'/\' + cantripsKnown}}</span>)</label>\
              <chips :chips="c.cantrips" :suggestions="filteredCantrips"></chips>\
            </div>\
            <div class="input-group col-xs-12">\
              <label>Spells Known (<span :class="c.spells.length > spellsKnown ? \'warning\' : \'\'">{{c.spells.length + \'/\' + spellsKnown}}</span>)</label>\
              <chips :chips="c.spells" :suggestions="filteredSpells"></chips>\
            </div>\
            <div v-for="slot in 9" class="input-group col-xs-12">\
              <label>Level {{slot}} Slots</label>\
              <div class="slider">\
                <div class="slide">\
                  <input v-model="c.spellSlotsAvailable[\'level\' + slot + \'SlotsAvailable\']" type="range" min="0" :max="spellSlots[\'level\' + slot + \'Slots\']" step="1" />\
                  <div class="slider-ticks">\
                    <div v-for="step in sliderMax[slot-1]" class="slider-tick" :style="{left: step / sliderMax[slot-1].length * 100 + \'%\'}"></div>\
                  </div>\
                  <div class="slider-fill" :style="{width: c.spellSlotsAvailable[\'level\' + slot + \'SlotsAvailable\'] / spellSlots[\'level\' + slot + \'Slots\'] * 100 + \'%\'}"></div>\
                </div>\
                <div class="numbers">\
                  <input v-model="c.spellSlotsAvailable[\'level\' + slot + \'SlotsAvailable\']" type="number" /><span>/</span><input v-model="spellSlots[\'level\' + slot + \'Slots\']" type="number" />\
                </div>\
              </div>\
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
                <div class="prof">{{saves[key]}}<input v-model="c.saves[key]" type="checkbox" /></div>\
              </label>\
            </div>\
          </div>\
          <div class="row">\
            <h4>Skills</h4>\
            <div class="input-group col-xs-2" v-for="(value, key) in skillData">\
              <label>{{value.full}}\
                <div class="prof">{{skills[key]}}<input v-model="c.skills[key]" type="checkbox" /></div>\
              </label>\
            </div>\
          </div>\
          <div class="row">\
            <div class="input-group col-xs-12">\
              <label>Proficiencies</label>\
              <chips :chips="c.proficiencies"></chips>\
            </div>\
          </div>\
          <div class="row">\
            <div class="input-group col-xs-12">\
              <label>Traits</label>\
              <chips :chips="c.traits"></chips>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="character-section">\
        <button @click="c.showInventory = !c.showInventory" class="character-section-header">\
          <h3>Inventory</h3>\
          <svg :class="{open: c.showInventory}"><use xlink:href="sprites.svg#arrow-down"></use></svg>\
        </button>\
        <div v-show="c.showInventory" class="character-section-content">\
          <div class="row">\
            <div class="input-group col-xs">\
              <label>CP</label>\
              <input v-model="c.coins.cp" type="number" />\
            </div>\
            <div class="input-group col-xs">\
              <label>SP</label>\
              <input v-model="c.coins.sp" type="number" />\
            </div>\
            <div class="input-group col-xs">\
              <label>EP</label>\
              <input v-model="c.coins.ep" type="number" />\
            </div>\
            <div class="input-group col-xs">\
              <label>GP</label>\
              <input v-model="c.coins.gp" type="number" />\
            </div>\
            <div class="input-group col-xs">\
              <label>PP</label>\
              <input v-model="c.coins.pp" type="number" />\
            </div>\
          </div>\
          <div class="row">\
            <div class="input-group col-xs-12">\
              <label>Inventory</label>\
              <chips :chips="c.inventory"></chips>\
            </div>\
          </div>\
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
