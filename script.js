
var app = angular.module('DNDApp', ['ngMaterial', 'ngMessages', 'ngSanitize', 'ui.sortable']);

app.controller('charactersController', ['$scope', 'filterFilter', '$mdDialog', function charactersController($scope, filterFilter, $mdDialog) {
  $scope.sortableOptions = {
    'handle': '.handle',
    'placeholder': 'placeholder',
    'tolerance': 'pointer',
    'ui-floating': true
  };
  $scope.characters = [];
  $scope.idCounter = 0;
  $scope.races = [{name:'Hill Dwarf'}, {name:'Mountain Dwarf'}, {name:'High Elf'}, {name:'Wood Elf'}, {name:'Dark Elf'}, {name:'Lightfoot Halfling'}, {name:'Stout Halfling'}, {name:'Human'}, {name:'Dragonborn'}, {name:'Forest Gnome'}, {name:'Rock Gnome'}, {name:'Half-Elf'}, {name:'Half-Orc'}, {name:'Tiefling'}];
  $scope.classes = [{name:'Barbarian'}, {name:'Bard'}, {name:'Cleric'}, {name:'Druid'}, {name:'Fighter'}, {name:'Fighter'}, {name:'Monk'}, {name:'Paladin'}, {name:'Ranger'}, {name:'Rogue'}, {name:'Sorcerer'}, {name:'Warlock'}, {name:'Wizard'}];
  $scope.abilities = [{name:'strength', abbr:'str'}, {name:'dexterity', abbr:'dex'}, {name:'constitution', abbr:'con'}, {name:'intelligence', abbr:'int'}, {name:'wisdom', abbr:'wis'}, {name:'charisma', abbr:'cha'}];
  $scope.skills = [{name:'acrobatics', abbr:'acro', relAbility:'dex'}, {name:'animal handling', abbr:'anim', relAbility:'wis'}, {name:'arcana', abbr:'arca', relAbility:'int'}, {name:'athletics', abbr:'athl', relAbility:'str'}, {name:'deception', abbr:'dece', relAbility:'cha'}, {name:'history', abbr:'hist', relAbility:'int'}, {name:'insight', abbr:'insi', relAbility:'wis'}, {name:'intimidation', abbr:'inti', relAbility:'cha'}, {name:'investigation', abbr:'inve', relAbility:'int'}, {name:'medicine', abbr:'medi', relAbility:'wis'}, {name:'nature', abbr:'natu', relAbility:'int'}, {name:'perception', abbr:'perc', relAbility:'wis'}, {name:'performance', abbr:'perf', relAbility:'cha'}, {name:'persuasion', abbr:'pers', relAbility:'cha'}, {name:'religion', abbr:'reli', relAbility:'int'}, {name:'sleight of hand', abbr:'slei', relAbility:'dex'}, {name:'stealth', abbr:'stea', relAbility:'dex'}, {name:'survival', abbr:'surv', relAbility:'wis'}];
  $scope.spells = jsonSpellData;
  $scope.monsters = jsonMonsterData;
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
    var confirm = $mdDialog.confirm().title('Delete ' + (name=='' ? ('character ' + id) : name) + '?').cancel('Cancel').ok('Delete');
    $mdDialog.show(confirm).then(function() {
      var i = $scope.characters.findIndex(c => c.id==id);
      $scope.characters.splice(i, 1);
    });
  };
  $scope.showSpell = function(s) {
    if (s) {
      $mdDialog.show({
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
        //$scope.closeDialog = function() {
        //  $mdDialog.cancel();
        //}
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

  // Init character info
  $scope.$watch('race', function(newVal, oldVal) {
    switch (newVal) {
      case 'Hill Dwarf':
        $scope.char.size = 'Medium';
        $scope.char.speed = 25;
        break;
      case 'Mountain Dwarf':
        $scope.char.size = 'Medium';
        $scope.char.speed = 25;
        break;
      case 'High Elf':
        $scope.char.size = 'Medium';
        $scope.char.speed = 30;
        break;
      case 'Wood Elf':
        $scope.char.size = 'Medium';
        $scope.char.speed = 35;
        break;
      case 'Dark Elf':
        $scope.char.size = 'Medium';
        $scope.char.speed = 30;
        break;
      case 'Lightfoot Halfling':
        $scope.char.size = 'Small';
        $scope.char.speed = 25;
        break;
      case 'Stout Halfling':
        $scope.char.size = 'Small';
        $scope.char.speed = 25;
        break;
      case 'Human':
        $scope.char.size = 'Medium';
        $scope.char.speed = 30;
        break;
      case 'Dragonborn':
        $scope.char.size = 'Medium';
        $scope.char.speed = 30;
        break;
      case 'Forest Gnome':
        $scope.char.size = 'Small';
        $scope.char.speed = 25;
        break;
      case 'Rock Gnome':
        $scope.char.size = 'Small';
        $scope.char.speed = 25;
        break;
      case 'Half-Elf':
        $scope.char.size = 'Medium';
        $scope.char.speed = 30;
        break;
      case 'Half-Orc':
        $scope.char.size = 'Medium';
        $scope.char.speed = 30;
        break;
      case 'Tiefling':
        $scope.char.size = 'Medium';
        $scope.char.speed = 30;
        break;
      default:
        $scope.char.size = '';
        $scope.char.speed = '';
        break;
    }
  });

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

  $scope.savingThrows = function() {
    var savingStr = '';
    angular.forEach($scope.$parent.abilities, function(value, key) {
      if ($scope.char[value.name+'_save']) {
        savingStr += (value.abbr + ' +' + $scope.char[value.name+'_save'] + ', ');
      }
    });
    return savingStr.substr(0, savingStr.length-2);;
  };

  $scope.skills = function() {
    var skillsStr = '';
    angular.forEach($scope.$parent.skills, function(value, key) {
      if ($scope.char[value.name]) {
        skillsStr += (value.name + ' +' + $scope.char[value.name] + ', ');
      }
    });
    return skillsStr.substr(0, skillsStr.length-2);;
  };

  $scope.expEarned = function() {
    if ($scope.char.challenge_rating=='0') {
      return '10 XP';
    } else if ($scope.char.challenge_rating=='1/8') {
      return '25 XP';
    } else if ($scope.char.challenge_rating=='1/4') {
      return '50 XP';
    } else if ($scope.char.challenge_rating=='1/2') {
      return '100 XP';
    } else if ($scope.char.challenge_rating=='1') {
      return '200 XP';
    } else if ($scope.char.challenge_rating=='2') {
      return '450 XP';
    } else if ($scope.char.challenge_rating=='3') {
      return '700 XP';
    } else if ($scope.char.challenge_rating=='4') {
      return '1100 XP';
    } else if ($scope.char.challenge_rating=='5') {
      return '1800 XP';
    } else if ($scope.char.challenge_rating=='6') {
      return '2300 XP';
    } else if ($scope.char.challenge_rating=='7') {
      return '2900 XP';
    } else if ($scope.char.challenge_rating=='8') {
      return '3900 XP';
    } else if ($scope.char.challenge_rating=='9') {
      return '5000 XP';
    } else if ($scope.char.challenge_rating=='10') {
      return '5900 XP';
    } else if ($scope.char.challenge_rating=='11') {
      return '7200 XP';
    } else if ($scope.char.challenge_rating=='12') {
      return '8400 XP';
    } else if ($scope.char.challenge_rating=='13') {
      return '10000 XP';
    } else if ($scope.char.challenge_rating=='14') {
      return '11500 XP';
    } else if ($scope.char.challenge_rating=='15') {
      return '13000 XP';
    } else if ($scope.char.challenge_rating=='16') {
      return '15000 XP';
    } else if ($scope.char.challenge_rating=='17') {
      return '18000 XP';
    } else if ($scope.char.challenge_rating=='18') {
      return '20000 XP';
    } else if ($scope.char.challenge_rating=='19') {
      return '22000 XP';
    } else if ($scope.char.challenge_rating=='20') {
      return '25000 XP';
    } else if ($scope.char.challenge_rating=='21') {
      return '33000 XP';
    } else if ($scope.char.challenge_rating=='22') {
      return '41000 XP';
    } else if ($scope.char.challenge_rating=='23') {
      return '50000 XP';
    } else if ($scope.char.challenge_rating=='24') {
      return '62000 XP';
    } else if ($scope.char.challenge_rating=='25') {
      return '75000 XP';
    } else if ($scope.char.challenge_rating=='26') {
      return '90000 XP';
    } else if ($scope.char.challenge_rating=='27') {
      return '105000 XP';
    } else if ($scope.char.challenge_rating=='28') {
      return '120000 XP';
    } else if ($scope.char.challenge_rating=='29') {
      return '135000 XP';
    } else if ($scope.char.challenge_rating=='30') {
      return '155000 XP';
    } else {
      return '0 XP';
    }
  }
}]);
