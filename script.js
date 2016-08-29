
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
    $scope.rollResult = Math.floor((Math.random() * highest) + 1);
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

  $scope.char.speed = 0;
  $scope.char.curHP = 0;
  $scope.char.maxHP = 0;

  $scope.char.cantripSlots, $scope.char.lvl1Slots, $scope.char.lvl2Slots, $scope.char.lvl3Slots, $scope.char.lvl4Slots, $scope.char.lvl5Slots, $scope.char.lvl6Slots, $scope.char.lvl7Slots, $scope.char.lvl8Slots, $scope.char.lvl9Slots = 0;
  // Init character info
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
  $scope.$watch('[char.level, char.class]', function(newVal, oldVal) {
    if (newVal[1]=='Barbarian') {
      $scope.char.hitDie = newVal[0]+'d12';
      $scope.char.cantripSlots = 0;
      $scope.char.level1Slots = 0;
      $scope.char.level2Slots = 0;
      $scope.char.level3Slots = 0;
      $scope.char.level4Slots = 0;
      $scope.char.level5Slots = 0;
      $scope.char.level6Slots = 0;
      $scope.char.level7Slots = 0;
      $scope.char.level8Slots = 0;
      $scope.char.level9Slots = 0;
    } else if (newVal[1]=='Bard') {
      $scope.char.hitDie = newVal[0]+'d8';
      $scope.char.cantripSlots = 2;
      $scope.char.level1Slots = 2;
    } else if (newVal[1]=='Cleric') {
      $scope.char.hitDie = newVal[0]+'d8';
      $scope.char.cantripSlots = 3;
      $scope.char.level1Slots = 2;
    } else if (newVal[1]=='Druid') {
      $scope.char.hitDie = newVal[0]+'d8';
      $scope.char.cantripSlots = 2;
      $scope.char.level1Slots = 2;
    } else if (newVal[1]=='Fighter') {
      $scope.char.hitDie = newVal[0]+'d10';
      $scope.char.cantripSlots = 0;
      $scope.char.level1Slots = 0;
    } else if (newVal[1]=='Monk') {
      $scope.char.hitDie = newVal[0]+'d8';
      $scope.char.cantripSlots = 0;
      $scope.char.level1Slots = 0;
    } else if (newVal[1]=='Paladin') {
      $scope.char.hitDie = newVal[0]+'d10';
      $scope.char.cantripSlots = 0;
      $scope.char.level1Slots = 0;
    } else if (newVal[1]=='Ranger') {
      $scope.char.hitDie = newVal[0]+'d10';
      $scope.char.cantripSlots = 0;
      $scope.char.level1Slots = 0;
    } else if (newVal[1]=='Rogue') {
      $scope.char.hitDie = newVal[0]+'d8';
      $scope.char.cantripSlots = 2;
      $scope.char.level1Slots = 1;
    } else if (newVal[1]=='Sorcerer') {
      $scope.char.hitDie = newVal[0]+'d6';
      $scope.char.cantripSlots = 4;
      $scope.char.level1Slots = 2;
    } else if (newVal[1]=='Warlock') {
      $scope.char.hitDie = newVal[0]+'d8';
      $scope.char.cantripSlots = 2;
      $scope.char.level1Slots = 1;
    } else if (newVal[1]=='Wizard') {
      $scope.char.hitDie = newVal[0]+'d6';
      $scope.char.cantripSlots = 3;
      $scope.char.level1Slots = 2;
    }
  });
  $scope.numToArray = function(num) {
    return new Array(num);
  };

  // Init stats
  $scope.char.exp = 0;
  $scope.char.level = 1;
  $scope.char.pb = 2;
  $scope.$watch('char.exp', function() {
    if ($scope.char.exp >= 335000) {
      $scope.char.level = 20;
      $scope.char.pb = 6;
    } else if ($scope.char.exp < 335000 && $scope.char.exp >= 305000) {
      $scope.char.level = 19;
      $scope.char.pb = 6;
    } else if ($scope.char.exp < 305000 && $scope.char.exp >= 265000) {
      $scope.char.level = 18;
      $scope.char.pb = 6;
    } else if ($scope.char.exp < 265000 && $scope.char.exp >= 225000) {
      $scope.char.level = 17;
      $scope.char.pb = 6;
    } else if ($scope.char.exp < 225000 && $scope.char.exp >= 195000) {
      $scope.char.level = 16;
      $scope.char.pb = 5;
    } else if ($scope.char.exp < 195000 && $scope.char.exp >= 165000) {
      $scope.char.level = 15;
      $scope.char.pb = 5;
    } else if ($scope.char.exp < 165000 && $scope.char.exp >= 140000) {
      $scope.char.level = 14;
      $scope.char.pb = 5;
    } else if ($scope.char.exp < 140000 && $scope.char.exp >= 120000) {
      $scope.char.level = 13;
      $scope.char.pb = 5;
    } else if ($scope.char.exp < 120000 && $scope.char.exp >= 100000) {
      $scope.char.level = 12;
      $scope.char.pb = 4;
    } else if ($scope.char.exp < 100000 && $scope.char.exp >= 85000) {
      $scope.char.level = 11;
      $scope.char.pb = 4;
    } else if ($scope.char.exp < 85000 && $scope.char.exp >= 64000) {
      $scope.char.level = 10;
      $scope.char.pb = 4;
    } else if ($scope.char.exp < 64000 && $scope.char.exp >= 48000) {
      $scope.char.level = 9;
      $scope.char.pb = 4;
    } else if ($scope.char.exp < 48000 && $scope.char.exp >= 34000) {
      $scope.char.level = 8;
      $scope.char.pb = 3;
    } else if ($scope.char.exp < 34000 && $scope.char.exp >= 23000) {
      $scope.char.level = 7;
      $scope.char.pb = 3;
    } else if ($scope.char.exp < 23000 && $scope.char.exp >= 14000) {
      $scope.char.level = 6;
      $scope.char.pb = 3;
    } else if ($scope.char.exp < 14000 && $scope.char.exp >= 6500) {
      $scope.char.level = 5;
      $scope.char.pb = 3;
    } else if ($scope.char.exp < 6500 && $scope.char.exp >= 2700) {
      $scope.char.level = 4;
      $scope.char.pb = 2;
    } else if ($scope.char.exp < 2700 && $scope.char.exp >= 900) {
      $scope.char.level = 3;
      $scope.char.pb = 2;
    } else if ($scope.char.exp < 900 && $scope.char.exp >= 300) {
      $scope.char.level = 2;
      $scope.char.pb = 2;
    } else {
      $scope.char.level = 1;
      $scope.char.pb = 2;
    }
  });

  // TODO: Change these to an array and set a single watcher for all of them
  // Abilities
  $scope.char.str = 0; $scope.char.dex = 0; $scope.char.con = 0; $scope.char.int = 0; $scope.char.wis = 0; $scope.char.cha = 0;
  $scope.calcMod = function(ability) {
    var mod = ability + 'Mod';
    $scope.char[mod] = Math.floor(($scope.char[ability] - 10) / 2);
    return $scope.char[mod];
  };

  // Saving throws
  $scope.calcSaving = function(ability) {
    var mod = $scope.char[ability + 'Mod'];
    var savingP = $scope.char[ability + 'SavingP'];
    var saving = savingP ? mod + $scope.char.pb : mod;
    return saving;
  };

  // Skills
  $scope.calcSkill = function(skillObj) {
    var mod = $scope.char[skillObj.relAbility + 'Mod'];
    var skillP = $scope.char[skillObj.abbr + 'P'];
    var skill = skillP ? mod + $scope.char.pb : mod;
    return skill;
  }

  // Spells

  // Monsters
  angular.forEach($scope.$parent.characters, function(value, key) {
    if (value.id == $scope.charID) {
      $scope.type = value.type;
      angular.forEach(value.presets, function(value, key) {
        $scope.char[key] = value;
      });
    }
  });
}]);

$('body').on('click', 'section h3', function() {
  $(this).find(' + div.content').slideToggle();
});
