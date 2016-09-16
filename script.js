
var app = angular.module('DNDApp', ['ngMaterial', 'ngMessages', 'ngSanitize', 'ui.sortable']);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue', {
      'default': '500',
      'hue-1': '100',
      'hue-2': '700',
      'hue-3': 'A100'
    })
    .accentPalette('orange');
});

app.controller('charactersController', ['$scope', 'filterFilter', '$mdDialog', '$mdToast', function charactersController($scope, filterFilter, $mdDialog, $mdToast) {
  $scope.dieNum = 1;
  $scope.dieSides = 20;
  $scope.dieAdd = 0;
  $scope.rollResult = '?';
  $scope.sortableOptions = {
    'handle': '.handle',
    'placeholder': 'placeholder',
    'tolerance': 'pointer',
    'ui-floating': true
  };
  $scope.characters = [];
  $scope.idCounter = 0;
  $scope.races = [{name:'Hill Dwarf'}, {name:'Mountain Dwarf'}, {name:'High Elf'}, {name:'Wood Elf'}, {name:'Dark Elf'}, {name:'Lightfoot Halfling'}, {name:'Stout Halfling'}, {name:'Human'}, {name:'Dragonborn'}, {name:'Forest Gnome'}, {name:'Rock Gnome'}, {name:'Half-Elf'}, {name:'Half-Orc'}, {name:'Tiefling'}];
  $scope.classes = [{name:'Barbarian'}, {name:'Bard'}, {name:'Cleric'}, {name:'Druid'}, {name:'Fighter'}, {name:'Monk'}, {name:'Paladin'}, {name:'Ranger'}, {name:'Rogue'}, {name:'Sorcerer'}, {name:'Warlock'}, {name:'Wizard'}];
  $scope.abilities = [{name:'strength', abbr:'str'}, {name:'dexterity', abbr:'dex'}, {name:'constitution', abbr:'con'}, {name:'intelligence', abbr:'int'}, {name:'wisdom', abbr:'wis'}, {name:'charisma', abbr:'cha'}];
  $scope.skills = [{name:'acrobatics', abbr:'acro', relAbility:'dex'}, {name:'animal handling', abbr:'anim', relAbility:'wis'}, {name:'arcana', abbr:'arca', relAbility:'int'}, {name:'athletics', abbr:'athl', relAbility:'str'}, {name:'deception', abbr:'dece', relAbility:'cha'}, {name:'history', abbr:'hist', relAbility:'int'}, {name:'insight', abbr:'insi', relAbility:'wis'}, {name:'intimidation', abbr:'inti', relAbility:'cha'}, {name:'investigation', abbr:'inve', relAbility:'int'}, {name:'medicine', abbr:'medi', relAbility:'wis'}, {name:'nature', abbr:'natu', relAbility:'int'}, {name:'perception', abbr:'perc', relAbility:'wis'}, {name:'performance', abbr:'perf', relAbility:'cha'}, {name:'persuasion', abbr:'pers', relAbility:'cha'}, {name:'religion', abbr:'reli', relAbility:'int'}, {name:'sleight of hand', abbr:'slei', relAbility:'dex'}, {name:'stealth', abbr:'stea', relAbility:'dex'}, {name:'survival', abbr:'surv', relAbility:'wis'}];
  $scope.spells = jsonSpellData;
  $scope.monsters = jsonMonsterData;
  $scope.inventory = jsonInventoryData;

  $scope.numToArray = function(num) {
    return new Array(num);
  };

  // Character add/remove
  $scope.addPlayer = function() {
    $scope.idCounter++;
    $scope.characters.push({id: $scope.idCounter, type: "player", preset: ''});
  };
  $scope.addMonster = function(monster) {
    $scope.idCounter++;
    $scope.characters.push({id: $scope.idCounter, type: "monster", presets: monster});
    $mdDialog.hide();
  };
  $scope.deleteChar = function(id, name) {
    var confirm = $mdDialog.confirm().title('Delete ' + (!name ? ('character ' + id) : name) + '?').cancel('Cancel').ok('Delete');
    $mdDialog.show(confirm).then(function() {
      var i = $scope.characters.findIndex(c => c.id==id);
      $scope.characters.splice(i, 1);
    });
  };

  // Spell search
  $scope.showSpell = function(s) {
    if (s) {
      $mdDialog.show({
        autoWrap: false,
        scope: $scope,
        preserveScope: true,
        templateUrl: 'templates/spellDialog.html'
      });
    }
  };
  $scope.spellSearch = function(query) {
    if (query=='') {
      return $scope.spells;
    } else {
      return filterFilter($scope.spells, {name: query});
    }
  };
  $scope.findSpell = function(query) {
    if (!query) {
      return '';
    } else {
      return filterFilter($scope.spells, {name: query});
    }
  }

  // Item search
  $scope.showItem = function(s) {
    if (s) {
      $mdDialog.show({
        autoWrap: false,
        scope: $scope,
        preserveScope: true,
        templateUrl: 'templates/itemDialog.html'
      });
    }
  };
  $scope.itemSearch = function(query) {
    if (query=='') {
      return $scope.inventory;
    } else {
      return filterFilter($scope.inventory, {name: query});
    }
  };

  // Dice Roller
  $scope.showDice = function() {
    $mdToast.show({
      scope: $scope,
      preserveScope: true,
      templateUrl: 'templates/dice.html',
      hideDelay: 0,
      position: 'top right'
    });
  };
  $scope.closeDice = function() {
    $mdToast.hide();
  };
  $scope.rollDice = function() {
    var highest = $scope.dieNum * $scope.dieSides;
    $scope.rollResult = (Math.floor((Math.random() * highest) + 1)) + $scope.dieAdd;
  };


  // Monster search
  $scope.selectMonster = function() {
    $mdDialog.show({
      autoWrap: false,
      scope: $scope,
      preserveScope: true,
      controller: function DialogController($scope, filterFilter, $mdDialog) {
        $scope.monsterSearch = function(query) {
          if (query=='') {
            return $scope.monsters;
          } else {
            return filterFilter($scope.monsters, {name: query});
          }
        };
      },
      templateUrl: 'templates/monsterDialog.html'
    });
  };
  $scope.closeDialog = function() {
    $mdDialog.cancel();
  }
}]);



app.controller('characterController', ['$scope', function characterController($scope) {
  $scope.charID = $scope.$parent.idCounter;
  $scope.char = {};
  var loading = false;

  if (loading) {
    // load variables
  } else {
    // Initialize stats
    $scope.char.speed = 0;
    $scope.char.curHP = $scope.char.maxHP = 0;
    $scope.char.cantripsKnown = $scope.char.lvl1Slots = $scope.char.lvl2Slots = $scope.char.lvl3Slots = $scope.char.lvl4Slots = $scope.char.lvl5Slots = $scope.char.lvl6Slots = $scope.char.lvl7Slots = $scope.char.lvl8Slots = $scope.char.lvl9Slots = 0;
    $scope.char.exp = 0;
    $scope.char.level = 1;
    $scope.char.pb = 2;
    $scope.char.abilities = {'str': 0, 'dex': 0, 'con': 0, 'int': 0, 'wis': 0, 'cha': 0};
    $scope.char.mods = {'str': -5, 'dex': -5, 'con': -5, 'int': -5, 'wis': -5, 'cha': -5}
    $scope.char.saveMods = {'str': -5, 'dex': -5, 'con': -5, 'int': -5, 'wis': -5, 'cha': -5};
    $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': false, 'wis': false, 'cha': false};
    $scope.char.skillMods = {'acro': -5, 'anim': -5, 'arca': -5, 'athl': -5, 'dece': -5, 'hist': -5, 'insi': -5, 'inti': -5, 'inve': -5, 'medi': -5, 'natu': -5, 'perc': -5, 'perf': -5, 'pers': -5, 'reli': -5, 'slei': -5, 'stea': -5, 'surv': -5};
    $scope.char.skillRels = {'acro': 'dex', 'anim': 'wis', 'arca': 'int', 'athl': 'str', 'dece': 'cha', 'hist': 'int', 'insi': 'wis', 'inti': 'cha', 'inve': 'int', 'medi': 'wis', 'natu': 'int', 'perc': 'wis', 'perf': 'cha', 'pers': 'cha', 'reli': 'int', 'slei': 'dex', 'stea': 'dex', 'surv': 'wis'};
    $scope.char.skillProfs = {'acro': false, 'anim': false, 'arca': false, 'athl': false, 'dece': false, 'hist': false, 'insi': false, 'inti': false, 'inve': false, 'medi': false, 'natu': false, 'perc': false, 'perf': false, 'pers': false, 'reli': false, 'slei': false, 'stea': false, 'surv': false};
    $scope.char.pp = $scope.char.gp = $scope.char.ep = $scope.char.sp = $scope.char.cp = 0;
  }

  // Race watchers
  $scope.$watch('char.race', function(newVal, oldVal) {
    if (newVal=='Hill Dwarf') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 25;
    } else if (newVal=='Mountain Dwarf') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 25;
    } else if (newVal=='High Elf') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 30;
    } else if (newVal=='Wood Elf') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 35;
    } else if (newVal=='Dark Elf') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 30;
    } else if (newVal=='Lightfoot Halfling') {
      $scope.char.size = 'Small';
      $scope.char.speed = 25;
    } else if (newVal=='Stout Halfling') {
      $scope.char.size = 'Small';
      $scope.char.speed = 25;
    } else if (newVal=='Human') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 30;
    } else if (newVal=='Dragonborn') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 30;
    } else if (newVal=='Forest Gnome') {
      $scope.char.size = 'Small';
      $scope.char.speed = 25;
    } else if (newVal=='Rock Gnome') {
      $scope.char.size = 'Small';
      $scope.char.speed = 25;
    } else if (newVal=='Half-Elf') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 30;
    } else if (newVal=='Half-Orc') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 30;
    } else if (newVal=='Tiefling') {
      $scope.char.size = 'Medium';
      $scope.char.speed = 30;
    }
  });

  // Class watchers
  $scope.$watch('char.class', function(newVal, oldVal) {
    if (newVal=='Barbarian') {
      $scope.char.saveProfs = {'str': true, 'dex': false, 'con': true, 'int': false, 'wis': false, 'cha': false};
    } else if (newVal=='Bard') {
      $scope.char.saveProfs = {'str': false, 'dex': true, 'con': false, 'int': false, 'wis': false, 'cha': true};
    } else if (newVal=='Cleric') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': false, 'wis': true, 'cha': true};
    } else if (newVal=='Druid') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': true, 'wis': true, 'cha': false};
    } else if (newVal=='Fighter') {
      $scope.char.saveProfs = {'str': true, 'dex': false, 'con': true, 'int': false, 'wis': false, 'cha': false};
    } else if (newVal=='Monk') {
      $scope.char.saveProfs = {'str': true, 'dex': true, 'con': false, 'int': false, 'wis': false, 'cha': false};
    } else if (newVal=='Paladin') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': false, 'wis': true, 'cha': true};
    } else if (newVal=='Ranger') {
      $scope.char.saveProfs = {'str': true, 'dex': true, 'con': false, 'int': false, 'wis': false, 'cha': false};
    } else if (newVal=='Rogue') {
      $scope.char.saveProfs = {'str': false, 'dex': true, 'con': false, 'int': true, 'wis': false, 'cha': false};
    } else if (newVal=='Sorcerer') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': true, 'int': false, 'wis': false, 'cha': true};
    } else if (newVal=='Warlock') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': false, 'wis': true, 'cha': true};
    } else if (newVal=='Wizard') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': true, 'wis': true, 'cha': false};
    }
  });

  // Spell watchers
  $scope.$watch('[char.level, char.class, char.mods.int, char.mods.wis, char.mods.cha]', function(newVal, oldVal) {
    if (newVal[1]=='Barbarian') { // Done
      $scope.char.hitDice = newVal[0]+'d12';
      $scope.char.spellcastingAbility = '';
      $scope.char.cantripsKnown = $scope.char.spellsKnown = $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
    }
    else if (newVal[1]=='Bard') { // Done
      $scope.char.hitDice = newVal[0]+'d8';
      $scope.char.spellcastingAbility = 'cha';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[4];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[4];
      if (newVal[0]==1) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 4;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==2) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 5;
        $scope.char.level1Slots = 3;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 6;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==4) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 7;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==5) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 8;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==6) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 9;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 10;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==8) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 11;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 2;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==9) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 12;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 1;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==10) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 14;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 15;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 16;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==14) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 18;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==15 || newVal[0]==16) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 19;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 0;
      } else if (newVal[0]==17) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 20;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==18) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 22;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==19) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 22;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 22;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 2;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      }
    }
    else if (newVal[1]=='Cleric') { // Wis mod
      $scope.char.hitDice = newVal[0]+'d8';
      $scope.char.spellcastingAbility = 'wis';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[3];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[3];
      $scope.char.spellsKnown = newVal[3] + newVal[0] < 1 ? 1 : newVal[3] + newVal[0];
      if (newVal[0]==1) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==2) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 3;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==4) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==5) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==6) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==8) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 2;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==9) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 1;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==10) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13 || newVal[0]==14) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==15 || newVal[0]==16) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 0;
      } else if (newVal[0]==17) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==18) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==19) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 2;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      }
    }
    else if (newVal[1]=='Druid') { // Wis mod
      $scope.char.hitDice = newVal[0]+'d8';
      $scope.char.spellcastingAbility = 'wis';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[3];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[3];
      $scope.char.spellsKnown = newVal[3] + newVal[0] < 1 ? 1 : newVal[3] + newVal[0];
      if (newVal[0]==1) {
        $scope.char.cantripsKnown = 2;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==2) {
        $scope.char.cantripsKnown = 2;
        $scope.char.level1Slots = 3;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3) {
        $scope.char.cantripsKnown = 2;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==4) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==5) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==6) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==8) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 2;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==9) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 1;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==10) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13 || newVal[0]==14) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==15 || newVal[0]==16) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 0;
      } else if (newVal[0]==17) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==18) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==19) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots =3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 2;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      }
    }
    else if (newVal[1]=='Fighter') { // Done
      $scope.char.hitDice = newVal[0]+'d10';
      $scope.char.spellcastingAbility = 'int';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[2];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[2];
      if (newVal[0]==1 || newVal[0]==2) {
        $scope.char.cantripsKnown = $scope.char.spellsKnown = $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 3;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==4 || newVal[0]==5 || newVal[0]==6) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 4;
        $scope.char.level1Slots = 3;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==8 || newVal[0]==9) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 6;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==10) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 7;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 8;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 9;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==14 || newVal[0]==15) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 10;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==16 || newVal[0]==17 || newVal[0]==18) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 11;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==19) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 12;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 13;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      }
    }
    else if (newVal[1]=='Monk') { // Done
      $scope.char.hitDice = newVal[0]+'d8';
      $scope.char.spellcastingAbility = '';
      $scope.char.cantripsKnown = $scope.char.spellsKnown = $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
    }
    else if (newVal[1]=='Paladin') { // Cha mod
      $scope.char.hitDice = newVal[0]+'d10';
      $scope.char.spellcastingAbility = 'cha';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[4];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[4];
      $scope.char.spellsKnown = newVal[4] + Math.floor(newVal[0]/2) < 1 ? 1 : newVal[4] + Math.floor(newVal[0]/2);
      if (newVal[0]==1) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==2) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3 || newVal[0]==4) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 3;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==5 || newVal[0]==6) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7 || newVal[0]==8) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==9 || newVal[0]==10) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13 || newVal[0]==14) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==15 || newVal[0]==16) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 2;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==17 || newVal[0]==18) {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 1;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else {
        $scope.char.cantripsKnown = 0;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      }
    }
    else if (newVal[1]=='Ranger') { // Done
      $scope.char.hitDice = newVal[0]+'d10';
      $scope.char.spellcastingAbility = 'wis';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[3];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[3];
      if (newVal[0]==1) {
        $scope.char.cantripsKnown = $scope.char.spellsKnown = $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      }  else if (newVal[0]==2) {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 2;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3 || newVal[0]==4) {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 3;
        $scope.char.level1Slots = 3;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==5 || newVal[0]==6) {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7 || newVal[0]==8) {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==9 || newVal[0]==10) {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 6;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 7;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13 || newVal[0]==14) {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 8;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==15 || newVal[0]==16) {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 9;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 2;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==17 || newVal[0]==18) {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 10;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 1;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else {
        $scope.char.cantripsKnown = 0;
        $scope.char.spellsKnown = 11;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      }
    }
    else if (newVal[1]=='Rogue') { // Done
      $scope.char.hitDice = newVal[0]+'d8';
      $scope.char.spellcastingAbility = 'int';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[2];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[2];
      if (newVal[0]==1 || newVal[0]==2) {
        $scope.char.cantripsKnown = $scope.char.spellsKnown = $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 3;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==4 || newVal[0]==5 || newVal[0]==6) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 4;
        $scope.char.level1Slots = 3;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==8 || newVal[0]==9) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 6;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==10) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 7;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 8;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 9;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==14 || newVal[0]==15) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 10;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==16 || newVal[0]==17 || newVal[0]==18) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 11;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==19) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 12;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 13;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      }
    }
    else if (newVal[1]=='Sorcerer') { // Done
      $scope.char.hitDice = newVal[0]+'d6';
      $scope.char.spellcastingAbility = 'cha';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[4];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[4];
      if (newVal[0]==1) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 2;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==2) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 3;
        $scope.char.level1Slots = 3;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==4) {
        $scope.char.cantripsKnown = 5;
        $scope.char.spellsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==5) {
        $scope.char.cantripsKnown = 5;
        $scope.char.spellsKnown = 6;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==6) {
        $scope.char.cantripsKnown = 5;
        $scope.char.spellsKnown = 7;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7) {
        $scope.char.cantripsKnown = 5;
        $scope.char.spellsKnown = 8;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==8) {
        $scope.char.cantripsKnown = 5;
        $scope.char.spellsKnown = 9;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 2;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==9) {
        $scope.char.cantripsKnown = 5;
        $scope.char.spellsKnown = 10;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 1;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==10) {
        $scope.char.cantripsKnown = 5;
        $scope.char.spellsKnown = 11;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 6;
        $scope.char.spellsKnown = 12;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13 || newVal[0]==14) {
        $scope.char.cantripsKnown = 6;
        $scope.char.spellsKnown = 13;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==15 || newVal[0]==16) {
        $scope.char.cantripsKnown = 6;
        $scope.char.spellsKnown = 14;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 0;
      } else if (newVal[0]==17) {
        $scope.char.cantripsKnown = 6;
        $scope.char.spellsKnown = 15;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==18) {
        $scope.char.cantripsKnown = 6;
        $scope.char.spellsKnown = 15;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==19) {
        $scope.char.cantripsKnown = 6;
        $scope.char.spellsKnown = 15;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else {
        $scope.char.cantripsKnown = 6;
        $scope.char.spellsKnown = 15;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 2;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      }
    }
    else if (newVal[1]=='Warlock') { // Done
      $scope.char.hitDice = newVal[0]+'d8';
      $scope.char.spellcastingAbility = 'cha';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[4];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[4];
      if (newVal[0]==1) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 2;
        $scope.char.level1Slots = 1;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==2) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 3;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3) {
        $scope.char.cantripsKnown = 2;
        $scope.char.spellsKnown = 4;
        $scope.char.level1Slots = 0;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==4) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 5;
        $scope.char.level1Slots = 0;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==5) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 6;
        $scope.char.level1Slots = $scope.char.level2Slots = 0;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==6) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 7;
        $scope.char.level1Slots = $scope.char.level2Slots = 0;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 8;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = 0;
        $scope.char.level4Slots = 2;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==8) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 9;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = 0;
        $scope.char.level4Slots = 2;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==9) {
        $scope.char.cantripsKnown = 3;
        $scope.char.spellsKnown = 10;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = 0;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==10) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 10;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = 0;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 11;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = 0;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13 || newVal[0]==14) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 12;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = 0;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==15 || newVal[0]==16) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 13;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = 0;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==17 || newVal[0]==18) {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 14;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = 0;
        $scope.char.level5Slots = 4;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else {
        $scope.char.cantripsKnown = 4;
        $scope.char.spellsKnown = 15;
        $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = 0;
        $scope.char.level5Slots = 4;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      }
    }
    else if (newVal[1]=='Wizard') { // Int mod
      $scope.char.hitDice = newVal[0]+'d6';
      $scope.char.spellcastingAbility = 'int';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[2];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[2];
      $scope.char.spellsKnown = newVal[2] + newVal[0] < 1 ? 1 : newVal[2] + newVal[0];
      if (newVal[0]==1) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 2;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==2) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 3;
        $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==3) {
        $scope.char.cantripsKnown = 3;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 2;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==4) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==5) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 2;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==6) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==7) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 1;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==8) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 2;
        $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==9) {
        $scope.char.cantripsKnown = 4;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 1;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==10) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==11 || newVal[0]==12) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==13 || newVal[0]==14) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = $scope.char.level9Slots = 0;
      } else if (newVal[0]==15 || newVal[0]==16) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 0;
      } else if (newVal[0]==17) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 2;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==18) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 1;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else if (newVal[0]==19) {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 1;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      } else {
        $scope.char.cantripsKnown = 5;
        $scope.char.level1Slots = 4;
        $scope.char.level2Slots = 3;
        $scope.char.level3Slots = 3;
        $scope.char.level4Slots = 3;
        $scope.char.level5Slots = 3;
        $scope.char.level6Slots = 2;
        $scope.char.level7Slots = 2;
        $scope.char.level8Slots = 1;
        $scope.char.level9Slots = 1;
      }
    }
  });

  // Experience watchers
  $scope.$watch('char.exp', function(newVal, oldVal) {
    if (newVal >= 335000) {
      $scope.char.level = 20;
      $scope.char.pb = 6;
    } else if (newVal < 335000 && newVal >= 305000) {
      $scope.char.level = 19;
      $scope.char.pb = 6;
    } else if (newVal < 305000 && newVal >= 265000) {
      $scope.char.level = 18;
      $scope.char.pb = 6;
    } else if (newVal < 265000 && newVal >= 225000) {
      $scope.char.level = 17;
      $scope.char.pb = 6;
    } else if (newVal < 225000 && newVal >= 195000) {
      $scope.char.level = 16;
      $scope.char.pb = 5;
    } else if (newVal < 195000 && newVal >= 165000) {
      $scope.char.level = 15;
      $scope.char.pb = 5;
    } else if (newVal < 165000 && newVal >= 140000) {
      $scope.char.level = 14;
      $scope.char.pb = 5;
    } else if (newVal < 140000 && newVal >= 120000) {
      $scope.char.level = 13;
      $scope.char.pb = 5;
    } else if (newVal < 120000 && newVal >= 100000) {
      $scope.char.level = 12;
      $scope.char.pb = 4;
    } else if (newVal < 100000 && newVal >= 85000) {
      $scope.char.level = 11;
      $scope.char.pb = 4;
    } else if (newVal < 85000 && newVal >= 64000) {
      $scope.char.level = 10;
      $scope.char.pb = 4;
    } else if (newVal < 64000 && newVal >= 48000) {
      $scope.char.level = 9;
      $scope.char.pb = 4;
    } else if (newVal < 48000 && newVal >= 34000) {
      $scope.char.level = 8;
      $scope.char.pb = 3;
    } else if (newVal < 34000 && newVal >= 23000) {
      $scope.char.level = 7;
      $scope.char.pb = 3;
    } else if (newVal < 23000 && newVal >= 14000) {
      $scope.char.level = 6;
      $scope.char.pb = 3;
    } else if (newVal < 14000 && newVal >= 6500) {
      $scope.char.level = 5;
      $scope.char.pb = 3;
    } else if (newVal < 6500 && newVal >= 2700) {
      $scope.char.level = 4;
      $scope.char.pb = 2;
    } else if (newVal < 2700 && newVal >= 900) {
      $scope.char.level = 3;
      $scope.char.pb = 2;
    } else if (newVal < 900 && newVal >= 300) {
      $scope.char.level = 2;
      $scope.char.pb = 2;
    } else {
      $scope.char.level = 1;
      $scope.char.pb = 2;
    }
  });

  // Ability mod watchers
  $scope.$watch('char.abilities', function(newVals, oldVals) {
    for (var key in newVals) {
      $scope.char.mods[key] = Math.floor((newVals[key] - 10) / 2);
    }
  }, true);

  // Saving throw mod watchers
  $scope.$watch('[char.mods, char.saveProfs, char.pb]', function(newVals, oldVals) {
    for (var key in newVals[0]) {
      var mod = newVals[0][key];
      var saveP = newVals[1][key];
      $scope.char.saveMods[key] = saveP ? mod + newVals[2] : mod;
    }
  }, true);

  // Skill mod watchers
  $scope.$watch('[char.mods, char.skillProfs, char.pb]', function(newVals, oldVals) {
    for (var key in newVals[1]) {
      var relAb = $scope.char.skillRels[key];
      var mod = newVals[0][relAb];
      var skillP = newVals[1][key];
      $scope.char.skillMods[key] = skillP ? mod + newVals[2] : mod;
    }
  }, true);

  // Monsters
  angular.forEach($scope.$parent.characters, function(value, key) {
    if (value.id == $scope.charID) {
      $scope.type = value.type;
      if (value.type == 'monster') {
        angular.forEach(value.presets, function(value, key) {
          $scope.char[key] = value;
        });
        $scope.char.abilities = {'str': $scope.char.str, 'dex': $scope.char.dex, 'con':$scope.char.con, 'int': $scope.char.int, 'wis': $scope.char.wis, 'cha': $scope.char.cha};
      }
    }
  });
}]);

$('body').on('click', 'section h3', function() {
  $(this).find(' + div.content').slideToggle();
});
