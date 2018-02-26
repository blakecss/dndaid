Vue.component('player', {
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
    spellAbility: function() {
      if (this.c.klass) {
        this.c.spellAbility = jsonClassData[this.c.klass].spell_casting_ability;
        return this.c.spellAbility;
      }
    },
    spellSavingDC: function() {
      if (this.c.klass) {
        var a = jsonClassData[this.c.klass].spell_casting_ability;
        if (a) {
          this.c.spellSavingDC = 8 + this.c.pb + mod(this.c.abilities[a]);
        }
        else {
          this.c.spellSavingDC = '';
        }
        return this.c.spellSavingDC;
      }
    },
    spellAttackMod: function() {
      return 0;
    },
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
        this.c.spellsKnown = (mod(this.c.abilities.Wisdom) + this.c.level < 1) ? 1 : mod(this.c.abilities.Wisdom) + this.c.level;
      }
      else if (this.c.klass == 'Druid') {
        this.c.spellsKnown = (mod(this.c.abilities.Wisdom) + this.c.level < 1) ? 1 : mod(this.c.abilities.Wisdom) + this.c.level;
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
        this.c.spellsKnown = (mod(this.c.abilities.Charisma) + Math.floor(this.c.level/2) < 1) ? 1 : mod(this.c.abilities.Charisma) + Math.floor(this.c.level/2);
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
        this.c.spellsKnown = (mod(this.c.abilities.Intelligence) + this.c.level < 1) ? 1 : mod(this.c.abilities.Intelligence) + this.c.level;
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
    }
  },
  template: '<div class="character">\
    <div class="character-header">\
      <div class="class-icon">\
        <svg><use :xlink:href="\'sprites.svg#\' + c.klass.toLowerCase()"></use></svg>\
      </div>\
      <div class="name">\
        <input v-model="c.name" type="text" placeholder="Name" />\
        <p class="subtitle">{{c.subrace}} {{c.klass}}</p>\
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
            <div class="input-group col-xs-4">\
              <label>Alignment</label>\
              <select v-model="c.alignment">\
                <option v-for="(value, key) in alignmentData">{{key}}</option>\
              </select>\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Background</label>\
              <input v-model="c.background" type="text" required>\
            </div>\
            <div class="input-group col-xs-4">\
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
              <input v-model="c.armorClass" type="number" readonly />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Initiative</label>\
              <input v-model="c.initiative" type="number" />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Hit Die</label>\
              <input v-model="hitDie" type="text" readonly />\
            </div>\
          </div>\
          <div class="row">\
            <h4>Spellcasting</h4>\
            <div class="input-group col-xs-4">\
              <label>Ability</label>\
              <input v-model="spellAbility" type="text" readonly />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Attack Modifier</label>\
              <input v-model="spellAttackMod" type="number" readonly />\
            </div>\
            <div class="input-group col-xs-4">\
              <label>Saving DC</label>\
              <input v-model="spellSavingDC" type="number" readonly />\
            </div>\
            <div v-for="slot in [1, 2, 3, 4, 5, 6, 7, 8, 9]" v-if="spellSlots[\'level\' + slot + \'Slots\']" class="col-xs-12">\
              <label>Level {{slot}} Slots</label>\
              <input v-model="c.spellSlotsAvailable[\'level\' + slot + \'SlotsAvailable\']" type="range" min="0" :max="spellSlots[\'level\' + slot + \'Slots\']" step="1" />\
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
              <label>{{key}}\
                <div class="prof">{{saves[key]}}<input v-model="c.saves[key]" type="checkbox" /></div>\
              </label>\
            </div>\
          </div>\
          <div class="row">\
            <h4>Skills</h4>\
            <div class="input-group col-xs-2" v-for="(value, key) in skillData">\
              <label>{{key}}\
                <div class="prof">{{skills[key]}}<input v-model="c.skills[key]" type="checkbox" /></div>\
              </label>\
            </div>\
          </div>\
          <div class="row">\
            <h4>Perks</h4>\
            <div class="input-group col-xs-6">\
              <label>Proficiencies</label>\
              <chips :chips="c.proficiencies"></chips>\
            </div>\
            <div class="input-group col-xs-6">\
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
