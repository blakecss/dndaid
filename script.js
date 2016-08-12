
var app = angular.module('DNDApp', ['ngMaterial', 'ngMessages']);

app.controller('charactersController', ['$scope', function charactersController($scope) {
  $scope.characters = [];
  $scope.idCounter = 0;
  //$scope.skills = [{name: 'strength'}, {name: 'dexterity'}, {name: 'constitution'}, {name: 'intelligence'}, {name: 'wisdom'}, {name: 'charisma'}];
  $scope.addChar = function() {
    $scope.idCounter++;
    $scope.characters.push($scope.idCounter);
  };
}]);

app.controller('characterController', ['$scope', '$mdDialog', function characterController($scope, $mdDialog) {
  $scope.charID = $scope.$parent.idCounter;
  // Init character info
  $scope.name = ''; $scope.class = ''; $scope.background = ''; $scope.race = ''; $scope.alignment = '';
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

  // Init abilities
  $scope.str = 0; $scope.dex = 0; $scope.con = 0; $scope.int = 0; $scope.wis = 0; $scope.cha = 0;
  // Watcher for ability modifiers
  $scope.$watchGroup(['str', 'dex', 'con', 'int', 'wis', 'cha'], function(newVals, oldVals) {
    var newVals = newVals.map(function(val) {
      return Math.floor((val - 10) / 2);
    });
    $scope.strMod = newVals[0]>=0 ? +newVals[0] : newVals[0];
    $scope.dexMod = newVals[1]>=0 ? +newVals[1] : newVals[1];
    $scope.conMod = newVals[2]>=0 ? +newVals[2] : newVals[2];
    $scope.intMod = newVals[3]>=0 ? +newVals[3] : newVals[3];
    $scope.wisMod = newVals[4]>=0 ? +newVals[4] : newVals[4];
    $scope.chaMod = newVals[5]>=0 ? +newVals[5] : newVals[5];
  });

  // Init saving throws
  $scope.strSaving = 0; $scope.dexSaving = 0; $scope.conSaving = 0; $scope.intSaving = 0; $scope.wisSaving = 0; //$scope.chaSaving = 0;
  // Saving throw functions
  $scope.strSaving = function() {
    var mod = $scope.strSavingP ? $scope.strMod + $scope.pb : $scope.strMod;
    return mod;
  };
  $scope.dexSaving = function() {
    var mod = $scope.dexSavingP ? $scope.dexMod + $scope.pb : $scope.dexMod;
    return mod;
  };
  $scope.conSaving = function() {
    var mod = $scope.conSavingP ? $scope.conMod + $scope.pb : $scope.conMod;
    return mod;
  };
  $scope.intSaving = function() {
    var mod = $scope.intSavingP ? $scope.intMod + $scope.pb : $scope.intMod;
    return mod;
  };
  $scope.wisSaving = function() {
    var mod = $scope.wisSavingP ? $scope.wisMod + $scope.pb : $scope.wisMod;
    return mod;
  };
  $scope.chaSaving = function() {
    var mod = $scope.chaSavingP ? $scope.chaMod + $scope.pb : $scope.chaMod;
    return mod;
  };

  // Init skills
  $scope.skills = ['Acrobatics', 'Animal Handling'];
  $scope.Acrobatics = 1;
  $scope.acro = function() {
    var mod = $scope.dexMod;
    return mod;
  }

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
