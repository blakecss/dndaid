
var app = angular.module('DNDApp', ['ngMaterial', 'ngMessages']);

app.controller('charactersController', ['$scope', function charactersController($scope) {
  $scope.characters = [];
  $scope.idCounter = 0;
  $scope.races = [{name:'Hill Dwarf'}, {name:'Mountain Dwarf'}, {name:'High Elf'}, {name:'Wood Elf'}, {name:'Dark Elf'}, {name:'Lightfoot Halfling'}, {name:'Stout Halfling'}, {name:'Human'}, {name:'Dragonborn'}, {name:'Forest Gnome'}, {name:'Rock Gnome'}, {name:'Half-Elf'}, {name:'Half-Orc'}, {name:'Tiefling'}];
  $scope.classes = [{name:'Barbarian'}, {name:'Bard'}, {name:'Cleric'}, {name:'Druid'}, {name:'Fighter'}, {name:'Fighter'}, {name:'Monk'}, {name:'Paladin'}, {name:'Ranger'}, {name:'Rogue'}, {name:'Sorcerer'}, {name:'Warlock'}, {name:'Wizard'}];
  $scope.abilities = [{name:'Strength', abbr:'str'}, {name:'Dexerity', abbr:'dex'}, {name:'Constitution', abbr:'con'}, {name:'Intelligence', abbr:'int'}, {name:'Wisdom', abbr:'wis'}, {name:'Charisma', abbr:'cha'}];
  $scope.skills = [{name:'Acrobatics', abbr:'acro', relAbility:'dex'}, {name:'Animal Handling', abbr:'anim', relAbility:'wis'}, {name:'Arcana', abbr:'arca', relAbility:'int'}, {name:'Athletics', abbr:'athl', relAbility:'str'}, {name:'Deception', abbr:'dece', relAbility:'cha'}, {name:'History', abbr:'hist', relAbility:'int'}, {name:'Insight', abbr:'insi', relAbility:'wis'}, {name:'Intimidation', abbr:'inti', relAbility:'cha'}, {name:'Investigation', abbr:'inve', relAbility:'int'}, {name:'Medicine', abbr:'medi', relAbility:'wis'}, {name:'Nature', abbr:'natu', relAbility:'int'}, {name:'Perception', abbr:'perc', relAbility:'wis'}, {name:'Performance', abbr:'perf', relAbility:'cha'}, {name:'Persuasion', abbr:'pers', relAbility:'cha'}, {name:'Religion', abbr:'reli', relAbility:'int'}, {name:'Sleight of Hand', abbr:'slei', relAbility:'dex'}, {name:'Stealth', abbr:'stea', relAbility:'dex'}, {name:'Survival', abbr:'surv', relAbility:'wis'}];
  $scope.spells = jsonSpellData;
  $scope.addChar = function() {
    $scope.idCounter++;
    $scope.characters.push($scope.idCounter);
  };
}]);

app.controller('characterController', ['$scope', '$mdDialog', function characterController($scope, $mdDialog) {
  $scope.charID = $scope.$parent.idCounter;
  // Init character info
  $scope.name = ''; $scope.class = ''; $scope.background = ''; $scope.race = ''; $scope.alignment = '';
  $scope.$watch('race', function(newVal, oldVal) {
    switch (newVal) {
      case 'Hill Dwarf':
        $scope.size = 'Medium';
        $scope.speed = 25;
        break;
      case 'Mountain Dwarf':
        $scope.size = 'Medium';
        $scope.speed = 25;
        break;
      case 'High Elf':
        $scope.size = 'Medium';
        $scope.speed = 30;
        break;
      case 'Wood Elf':
        $scope.size = 'Medium';
        $scope.speed = 35;
        break;
      case 'Dark Elf':
        $scope.size = 'Medium';
        $scope.speed = 30;
        break;
      case 'Lightfoot Halfling':
        $scope.size = 'Small';
        $scope.speed = 25;
        break;
      case 'Stout Halfling':
        $scope.size = 'Small';
        $scope.speed = 25;
        break;
      case 'Human':
        $scope.size = 'Medium';
        $scope.speed = 30;
        break;
      case 'Dragonborn':
        $scope.size = 'Medium';
        $scope.speed = 30;
        break;
      case 'Forest Gnome':
        $scope.size = 'Small';
        $scope.speed = 25;
        break;
      case 'Rock Gnome':
        $scope.size = 'Small';
        $scope.speed = 25;
        break;
      case 'Half-Elf':
        $scope.size = 'Medium';
        $scope.speed = 30;
        break;
      case 'Half-Orc':
        $scope.size = 'Medium';
        $scope.speed = 30;
        break;
      case 'Tiefling':
        $scope.size = 'Medium';
        $scope.speed = 30;
        break;
      default:
        $scope.size = '';
        $scope.speed = '';
        break;
    }
  });

  // Init stats
  $scope.exp = 0;
  $scope.level = 1;
  $scope.pb = 2;
  $scope.$watch('exp', function() {
    if ($scope.exp >= 335000) {
      $scope.level = 20;
      $scope.pb = 6;
    } else if ($scope.exp < 335000 && $scope.exp >= 305000) {
      $scope.level = 19;
      $scope.pb = 6;
    } else if ($scope.exp < 305000 && $scope.exp >= 265000) {
      $scope.level = 18;
      $scope.pb = 6;
    } else if ($scope.exp < 265000 && $scope.exp >= 225000) {
      $scope.level = 17;
      $scope.pb = 6;
    } else if ($scope.exp < 225000 && $scope.exp >= 195000) {
      $scope.level = 16;
      $scope.pb = 5;
    } else if ($scope.exp < 195000 && $scope.exp >= 165000) {
      $scope.level = 15;
      $scope.pb = 5;
    } else if ($scope.exp < 165000 && $scope.exp >= 140000) {
      $scope.level = 14;
      $scope.pb = 5;
    } else if ($scope.exp < 140000 && $scope.exp >= 120000) {
      $scope.level = 13;
      $scope.pb = 5;
    } else if ($scope.exp < 120000 && $scope.exp >= 100000) {
      $scope.level = 12;
      $scope.pb = 4;
    } else if ($scope.exp < 100000 && $scope.exp >= 85000) {
      $scope.level = 11;
      $scope.pb = 4;
    } else if ($scope.exp < 85000 && $scope.exp >= 64000) {
      $scope.level = 10;
      $scope.pb = 4;
    } else if ($scope.exp < 64000 && $scope.exp >= 48000) {
      $scope.level = 9;
      $scope.pb = 4;
    } else if ($scope.exp < 48000 && $scope.exp >= 34000) {
      $scope.level = 8;
      $scope.pb = 3;
    } else if ($scope.exp < 34000 && $scope.exp >= 23000) {
      $scope.level = 7;
      $scope.pb = 3;
    } else if ($scope.exp < 23000 && $scope.exp >= 14000) {
      $scope.level = 6;
      $scope.pb = 3;
    } else if ($scope.exp < 14000 && $scope.exp >= 6500) {
      $scope.level = 5;
      $scope.pb = 3;
    } else if ($scope.exp < 6500 && $scope.exp >= 2700) {
      $scope.level = 4;
      $scope.pb = 2;
    } else if ($scope.exp < 2700 && $scope.exp >= 900) {
      $scope.level = 3;
      $scope.pb = 2;
    } else if ($scope.exp < 900 && $scope.exp >= 300) {
      $scope.level = 2;
      $scope.pb = 2;
    } else {
      $scope.level = 1;
      $scope.pb = 2;
    }
  });

  // Abilities
  $scope.str = 0; $scope.dex = 0; $scope.con = 0; $scope.int = 0; $scope.wis = 0; $scope.cha = 0;
  $scope.calcMod = function(ability) {
    var mod = ability + 'Mod';
    $scope[mod] = Math.floor(($scope[ability] - 10) / 2);
    return $scope[mod];
  };

  // Saving throws
  $scope.calcSaving = function(ability) {
    var mod = $scope[ability + 'Mod'];
    var savingP = $scope[ability + 'SavingP'];
    var saving = savingP ? mod + $scope.pb : mod;
    return saving;
  };

  // Skills
  $scope.calcSkill = function(skillObj) {
    var mod = $scope[skillObj.relAbility + 'Mod'];
    var skillP = $scope[skillObj.abbr + 'P'];
    var skill = skillP ? mod + $scope.pb : mod;
    return skill;
  }

  $scope.speed = function() {
    return $scope.race.speed;
  };

  // Spells
  $scope.cantrip = ''; $scope.lvl1spell = ''; $scope.lvl2spell = ''; $scope.lvl3spell = ''; $scope.lvl4spell = ''; $scope.lvl5spell = ''; $scope.lvl6spell = ''; $scope.lvl7spell = ''; $scope.lvl8spell = ''; $scope.lvl9spell = '';

  $scope.deleteChar = function() {
    var confirm = $mdDialog.confirm().title('Delete ' + ($scope.name=='' ? ('character ' + $scope.charID) : $scope.name) + '?').cancel('Cancel').ok('Delete');
    $mdDialog.show(confirm).then(function() {
      var i = $scope.$parent.characters.indexOf($scope.charID);
      $scope.$parent.characters.splice(i, 1);
    });
  };
}]);

$(".sort-container").sortable({
  cursor: "move",
  handle: ".handle",
  placeholder: "placeholder",
  tolerance: "pointer"
});
