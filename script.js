
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
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension):/);
}]);

var saveFile = [];
var loading = false;

app.controller('charactersController', ['$scope', '$timeout', 'filterFilter', '$mdDialog', '$mdToast', function charactersController($scope, $timeout, filterFilter, $mdDialog, $mdToast) {
  $scope.fileName = 'my_game';
  $scope.dieNum = 1;
  $scope.dieSides = 20;
  $scope.dieAdd = 0;
  $scope.rollResult = '?';
  $scope.sortableOptions = {
    'placeholder': 'placeholder',
    'forcePlaceholderSize': true,
    'tolerance': 'pointer',
    'ui-floating': true
  };
  $scope.characters = [];
  $scope.idCounter = 0;
  $scope.races = [{name:'Hill Dwarf'}, {name:'Mountain Dwarf'}, {name:'High Elf'}, {name:'Wood Elf'}, {name:'Dark Elf'}, {name:'Lightfoot Halfling'}, {name:'Stout Halfling'}, {name:'Human'}, {name:'Dragonborn'}, {name:'Forest Gnome'}, {name:'Rock Gnome'}, {name:'Half-Elf'}, {name:'Half-Orc'}, {name:'Tiefling'}];
  $scope.classes = [{name:'Barbarian'}, {name:'Bard'}, {name:'Cleric'}, {name:'Druid'}, {name:'Fighter'}, {name:'Monk'}, {name:'Paladin'}, {name:'Ranger'}, {name:'Rogue'}, {name:'Sorcerer'}, {name:'Warlock'}, {name:'Wizard'}];
  $scope.abilities = [{name:'strength', abbr:'str'}, {name:'dexterity', abbr:'dex'}, {name:'constitution', abbr:'con'}, {name:'intelligence', abbr:'int'}, {name:'wisdom', abbr:'wis'}, {name:'charisma', abbr:'cha'}];
  $scope.skills = [{name:'acrobatics', abbr:'acro', relAbility:'dex'}, {name:'animal handling', abbr:'anim', relAbility:'wis'}, {name:'arcana', abbr:'arca', relAbility:'int'}, {name:'athletics', abbr:'athl', relAbility:'str'}, {name:'deception', abbr:'dece', relAbility:'cha'}, {name:'history', abbr:'hist', relAbility:'int'}, {name:'insight', abbr:'insi', relAbility:'wis'}, {name:'intimidation', abbr:'inti', relAbility:'cha'}, {name:'investigation', abbr:'inve', relAbility:'int'}, {name:'medicine', abbr:'medi', relAbility:'wis'}, {name:'nature', abbr:'natu', relAbility:'int'}, {name:'perception', abbr:'perc', relAbility:'wis'}, {name:'performance', abbr:'perf', relAbility:'cha'}, {name:'persuasion', abbr:'pers', relAbility:'cha'}, {name:'religion', abbr:'reli', relAbility:'int'}, {name:'sleight of hand', abbr:'slei', relAbility:'dex'}, {name:'stealth', abbr:'stea', relAbility:'dex'}, {name:'survival', abbr:'surv', relAbility:'wis'}];
  $scope.monsters = jsonMonsterData;
  $scope.spells = jsonSpellData;
  $scope.inventory = jsonInventoryData;
  $scope.definitions = jsonDefinitionData;
  $scope.ref = $scope.spells.concat($scope.inventory, $scope.definitions);

  $scope.numToArray = function(num) {
    return new Array(num);
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

  // Reference search
  $scope.showRef = function(s) {
    if (s) {
      $mdDialog.show({
        autoWrap: false,
        scope: $scope,
        preserveScope: true,
        templateUrl: 'templates/referenceDialog.html'
      });
    }
  };
  $scope.refSearch = function(query) {
    return filterFilter($scope.ref, {name: query});
  };

  // Character add/remove
  $scope.addPlayer = function(c) {
    $scope.idCounter++;
    $scope.characters.push({id: $scope.idCounter, type: 'player', presets: '', char: c});
  };
  $scope.addMonster = function(monster) {
    $scope.idCounter++;
    $scope.characters.push({id: $scope.idCounter, type: 'monster', presets: monster});
    $mdDialog.hide();
  };
  $scope.deleteChar = function(id, name) {
    var confirm = $mdDialog.confirm().title('Delete ' + (!name ? ('character ' + id) : name) + '?').cancel('Cancel').ok('Delete');
    $mdDialog.show(confirm).then(function() {
      var i = $scope.characters.findIndex(c => c.id==id);
      $scope.characters.splice(i, 1);
    });
  };

  // Monster search
  $scope.selectMonster = function() {
    $mdDialog.show({
      autoWrap: false,
      scope: $scope,
      preserveScope: true,
      controller: function DialogController($scope, filterFilter, $mdDialog) {
        $scope.monsterSearch = function(query) {
          if (query==='') {
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
  };

  // Save
  $scope.saveGame = function() {
    saveFile = $scope.characters;
    $scope.saveFile = encodeURIComponent(JSON.stringify(saveFile));
    $mdDialog.show({
      autoWrap: false,
      scope: $scope,
      preserveScope: true,
      templateUrl: 'templates/saveDialog.html'
    });
  };

  // Load
  $scope.loadGame = function() {
    $mdDialog.show({
      autoWrap: false,
      scope: $scope,
      preserveScope: true,
      templateUrl: 'templates/loadDialog.html',
      onComplete: function() {
        document.getElementById('filez').addEventListener('change', function(evt) {
          var f = evt.target.files;
          var reader = new FileReader();
          reader.onload = (function(theFile) {
            return function(e) {
              $scope.savedFile = JSON.parse(e.target.result);
            };
          })(f[0]);
          reader.readAsText(f[0]);
        }, false);
      }
    });
  };
  $scope.loadFile = function() {
    var highestID = 0;
    $scope.characters = [];
    angular.forEach($scope.savedFile, function(value) {
      saveFile = [];
      $scope.characters.push({id: value.id, type: value.type, presets: value.presets, char: value.char});
      if (value.id > highestID) {
        highestID = value.id;
      }
    });
    $scope.idCounter = highestID;
    $mdDialog.cancel();
  };

}]);

app.controller('characterController', ['$scope', function characterController($scope) {
  $scope.charID = $scope.$parent.idCounter;
  $scope.char = {};
  $scope.$watch('id', function(newID) {
    $scope.charID = newID;
    $scope.$parent.characters.forEach(function(value, key) {
      if (value.id==newID) {
        if (value.char) {
          $scope.char = value.char;
        } else {
          value.char = $scope.char;
        }
      }
    });
  });

  $scope.left = function(id) {
    var sel = jQuery('#'+id);
    jQuery('.left').hide();
    if (sel.attr('class').indexOf('left') == -1) {
      sel.appendTo('.left-container');
      sel.removeClass('left right').addClass('left');
    }
    sel.show();
  };

  $scope.right = function(id) {
    var sel = jQuery('#'+id);
    jQuery('.right').hide();
    if (sel.attr('class').indexOf('right') == -1) {
      sel.appendTo('.right-container');
      sel.removeClass('left right').addClass('right');
    }
    sel.show();
  };

  $scope.hideChar = function(id) {
    jQuery('#'+id).hide();
  };

  // Initialize stats
  $scope.char.initiative = 0;
  $scope.char.speed = 0;
  $scope.char.curHP = 0;
  $scope.char.maxHP = 1;
  $scope.char.cantripsKnown = $scope.char.lvl1Slots = $scope.char.lvl2Slots = $scope.char.lvl3Slots = $scope.char.lvl4Slots = $scope.char.lvl5Slots = $scope.char.lvl6Slots = $scope.char.lvl7Slots = $scope.char.lvl8Slots = $scope.char.lvl9Slots = 0;
  $scope.char.exp = 0;
  $scope.char.level = 1;
  $scope.char.pb = 2;
  $scope.char.abilities = {'str': 0, 'dex': 0, 'con': 0, 'int': 0, 'wis': 0, 'cha': 0};
  $scope.char.mods = {'str': -5, 'dex': -5, 'con': -5, 'int': -5, 'wis': -5, 'cha': -5};
  $scope.char.saveMods = {'str': -5, 'dex': -5, 'con': -5, 'int': -5, 'wis': -5, 'cha': -5};
  $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': false, 'wis': false, 'cha': false};
  $scope.char.skillMods = {'acro': -5, 'anim': -5, 'arca': -5, 'athl': -5, 'dece': -5, 'hist': -5, 'insi': -5, 'inti': -5, 'inve': -5, 'medi': -5, 'natu': -5, 'perc': -5, 'perf': -5, 'pers': -5, 'reli': -5, 'slei': -5, 'stea': -5, 'surv': -5};
  $scope.char.skillRels = {'acro': 'dex', 'anim': 'wis', 'arca': 'int', 'athl': 'str', 'dece': 'cha', 'hist': 'int', 'insi': 'wis', 'inti': 'cha', 'inve': 'int', 'medi': 'wis', 'natu': 'int', 'perc': 'wis', 'perf': 'cha', 'pers': 'cha', 'reli': 'int', 'slei': 'dex', 'stea': 'dex', 'surv': 'wis'};
  $scope.char.skillProfs = {'acro': false, 'anim': false, 'arca': false, 'athl': false, 'dece': false, 'hist': false, 'insi': false, 'inti': false, 'inve': false, 'medi': false, 'natu': false, 'perc': false, 'perf': false, 'pers': false, 'reli': false, 'slei': false, 'stea': false, 'surv': false};
  $scope.char.pp = $scope.char.gp = $scope.char.ep = $scope.char.sp = $scope.char.cp = 0;

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
  $scope.$watch('char.class', function(){$scope.char.subclass = '';});
  $scope.$watch('[char.class, char.level]', function(newVal, oldVal) {
    $scope.char.features = [];
    if (newVal[0]=='Barbarian') {
      $scope.char.saveProfs = {'str': true, 'dex': false, 'con': true, 'int': false, 'wis': false, 'cha': false};
      $scope.char.proficiencies = ['Light Armor', 'Medium Armor', 'Shields', 'Simple Weapons', 'Martial Weapons'];
      $scope.char.subclasses = ['Path of the Berserker', 'Path of the Totem Warrior'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Rage, Unarmored Defense');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Reckless Attack, Danger Sense');
      } if (newVal[1]>=3) {
        $scope.char.features.push('Primal Path');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('Extra Attack, Fast Movement');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Path feature');
      } if (newVal[1]>=7) {
        $scope.char.features.push('Feral Instinct');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('Brutal Critical (1 die)');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Path feature');
      } if (newVal[1]>=11) {
        $scope.char.features.push('Relentless Rage');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('Brutal Critical (2 dice)');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Path feature');
      } if (newVal[1]>=15) {
        $scope.char.features.push('Persistent Rage');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('Brutal Critical (3 dice)');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Indomitable Might');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Primal Champion');
      }
    } else if (newVal[0]=='Bard') {
      $scope.char.saveProfs = {'str': false, 'dex': true, 'con': false, 'int': false, 'wis': false, 'cha': true};
      $scope.char.proficiencies = ['Light Armor', 'Simple Weapons', 'Hand Crossbows', 'Longswords', 'Rapiers', 'Shortswords', 'Three Musical Instruments of you choice'];
      $scope.char.subclasses = ['College of Lore', 'College of Valor'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Spellcasting, Bardic Inspiration (d6)');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Jack of All Trades, Song of Rest (d6)');
      } if (newVal[1]>=3) {
        $scope.char.features.push('Bard College, Expertise');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('Bardic Inspiration (d8), Font of Inspiration');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Countercharm, Bard College feature');
      } if (newVal[1]>=7) {
        $scope.char.features.push('--');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('Song of Rest (d8)');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Bardic Inspiration (d10), Expertise, Magical Secrets');
      } if (newVal[1]>=11) {
        $scope.char.features.push('--');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('Song of Rest (d10)');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Magical Secrets, Bard College feature');
      } if (newVal[1]>=15) {
        $scope.char.features.push('Bardic Inspiration (d12)');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('Song of Rest (d12)');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Magical Secrets');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Superior Inspiration');
      }
    } else if (newVal[0]=='Cleric') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': false, 'wis': true, 'cha': true};
      $scope.char.proficiencies = ['Light Armor', 'Medium Armor', 'Shields', 'Simple Weapons'];
      $scope.char.subclasses = ['Knowledge Domain', 'Life Domain', 'Light Domain', 'Nature Domain', 'Tempest Domain', 'Trickery Domain', 'War Domain'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Spellcasting, Divine Domain');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Channel Divinity (1/rest), Divine Domain feature');
      } if (newVal[1]>=3) {
        $scope.char.features.push('--');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('Destroy Undead (CR 1/2)');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Channel Divinity (2/rest), Divine Domain feature');
      } if (newVal[1]>=7) {
        $scope.char.features.push('--');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement, Destroy Undead (CR 1), Divine Domain feature');
      } if (newVal[1]>=9) {
        $scope.char.features.push('--');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Divine Intervention');
      } if (newVal[1]>=11) {
        $scope.char.features.push('Destroy Undead (CR 2)');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('--');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Destroy Undead (CR 3)');
      } if (newVal[1]>=15) {
        $scope.char.features.push('--');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('Destroy Undead (CR 4), Divine Domain feature');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Channel Divinity (3/rest)');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Divine Intervention improvement');
      }
    } else if (newVal[0]=='Druid') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': true, 'wis': true, 'cha': false};
      $scope.char.proficiencies = ['Light Armor (Non-metal)', 'Medium Armor (Non-metal)', 'Shields (Non-metal)', 'Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears', 'Herbalism Kit'];
      $scope.char.subclasses = ['Circle of the Land', 'Circle of the Moon'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Druidic, Spellcasting');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Wild Shape, Druid Circle');
      } if (newVal[1]>=3) {
        $scope.char.features.push('--');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Wild Shape improvement, Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('--');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Druid Circle feature');
      } if (newVal[1]>=7) {
        $scope.char.features.push('--');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Wild Shape improvement, Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('--');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Druid Circle feature');
      } if (newVal[1]>=11) {
        $scope.char.features.push('--');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('--');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Druid Circle feature');
      } if (newVal[1]>=15) {
        $scope.char.features.push('--');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('--');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Timeless Body, Beast Spells');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Archdruid');
      }
    } else if (newVal[0]=='Fighter') {
      $scope.char.saveProfs = {'str': true, 'dex': false, 'con': true, 'int': false, 'wis': false, 'cha': false};
      $scope.char.proficiencies = ['All Armor', 'Shields', 'Simple Weapons', 'Martial Weapons'];
      $scope.char.subclasses = ['Champion', 'Battle Master', 'Eldritch Knight'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Fighting Style, Second Wind');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Action Surge (one use)');
      } if (newVal[1]>=3) {
        $scope.char.features.push('Martial Archetype');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('Extra Attack');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=7) {
        $scope.char.features.push('Martial Archetype feature');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('Indomitable (one use)');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Martial Archetype feature');
      } if (newVal[1]>=11) {
        $scope.char.features.push('Extra Attack (2)');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('Indomitable (two uses)');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=15) {
        $scope.char.features.push('Martial Archetype feature');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('Action Surge (two uses), Indomitable (three uses)');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Martial Archetype feature');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Extra Attack (3)');
      }
    } else if (newVal[0]=='Monk') {
      $scope.char.saveProfs = {'str': true, 'dex': true, 'con': false, 'int': false, 'wis': false, 'cha': false};
      $scope.char.proficiencies = ['Simple Weapons', 'Shortswords', 'One Artisan Tool or Musical Instrument'];
      $scope.char.subclasses = ['Way of the Open Hand', 'Way of the Four Elements'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Unarmored Defense, Martial Arts');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Ki, Unarmored Movement');
      } if (newVal[1]>=3) {
        $scope.char.features.push('Monastic Tradition, Deflect Missiles');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement, Slow Fall');
      } if (newVal[1]>=5) {
        $scope.char.features.push('Extra Attack, Stunning Strike');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Ki-Empowered Strikes, Monastic Tradition feature');
      } if (newVal[1]>=7) {
        $scope.char.features.push('Evasion, Stillness of Mind');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('Unarmored Movement improvement');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Purity of Body');
      } if (newVal[1]>=11) {
        $scope.char.features.push('Monastic Tradition feature');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('Tongue of the Sun and Moon');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Diamond Soul');
      } if (newVal[1]>=15) {
        $scope.char.features.push('Timeless Body');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('Monastic Tradition feature');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Empty Body');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Perfect Self');
      }
    } else if (newVal[0]=='Paladin') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': false, 'wis': true, 'cha': true};
      $scope.char.proficiencies = ['All Armor', 'Shields', 'Simple Weapons', 'Martial Weapons'];
      $scope.char.subclasses = ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Divine Sense, Lay on Hands');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Fighting Style, Spellcasting, Divine Smite');
      } if (newVal[1]>=3) {
        $scope.char.features.push('Divine Health, Sacred Oath');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('Extra Attack');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Aura of Protection');
      } if (newVal[1]>=7) {
        $scope.char.features.push('Sacred Oath feature');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('--');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Aura of Courage');
      } if (newVal[1]>=11) {
        $scope.char.features.push('Improved Divine Smite');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('--');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Cleansing Touch');
      } if (newVal[1]>=15) {
        $scope.char.features.push('Sacred Oath feature');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('--');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Aura improvement');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Sacred Oath feature');
      }
    } else if (newVal[0]=='Ranger') {
      $scope.char.saveProfs = {'str': true, 'dex': true, 'con': false, 'int': false, 'wis': false, 'cha': false};
      $scope.char.proficiencies = ['Light Armor', 'Medium Armor', 'Shields', 'Simple Weapons', 'Martial Weapons'];
      $scope.char.subclasses = ['Hunter', 'Beast Master'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Favored Enemy, Natural Explorer');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Fighting Style, Spellcasting');
      } if (newVal[1]>=3) {
        $scope.char.features.push('Ranger Archetype, Primeval Awareness');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('Extra Attack');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Favored Enemy and Natural Explorer improvements');
      } if (newVal[1]>=7) {
        $scope.char.features.push('Ranger Archetype feature');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement, Land&#39;s Stride');
      } if (newVal[1]>=9) {
        $scope.char.features.push('--');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Natural Explorer improvments, Hide in Plain Sight');
      } if (newVal[1]>=11) {
        $scope.char.features.push('Ranger Archetype feature');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('--');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Favored Enemy improvement, Vanish');
      } if (newVal[1]>=15) {
        $scope.char.features.push('Ranger Archetype feature');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('--');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Feral Senses');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Foe Slayer');
      }
    } else if (newVal[0]=='Rogue') {
      $scope.char.saveProfs = {'str': false, 'dex': true, 'con': false, 'int': true, 'wis': false, 'cha': false};
      $scope.char.proficiencies = ['Light Armor', 'Simple Weapons', 'Hand Crossbows', 'Longswords', 'Rapiers', 'Shortswords', 'Thieves&#39; Tools'];
      $scope.char.subclasses = ['Thief', 'Arcane Trickster'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Expertise, Sneak Attack, Thieves&#39; Cant');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Cunning Action');
      } if (newVal[1]>=3) {
        $scope.char.features.push('Roguish Archetype');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('Uncanny Dodge');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Expertise');
      } if (newVal[1]>=7) {
        $scope.char.features.push('Evasion');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('Roguish Archetype feature');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=11) {
        $scope.char.features.push('Reliable Talent');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('Roguish Archetype feature');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Blindsense');
      } if (newVal[1]>=15) {
        $scope.char.features.push('Slippery Mind');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('Roguish Archetype feature');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Elusive');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Stroke of Luck');
      }
    } else if (newVal[0]=='Sorcerer') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': true, 'int': false, 'wis': false, 'cha': true};
      $scope.char.proficiencies = ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light Crossbows'];
      $scope.char.subclasses = ['Draconic Bloodline', 'Wild Magic'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Spellcasting, Sorcerous Origin');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Font of Magic');
      } if (newVal[1]>=3) {
        $scope.char.features.push('Metamagic');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('--');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Sorcerous Origin feature');
      } if (newVal[1]>=7) {
        $scope.char.features.push('--');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('--');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Metamagic');
      } if (newVal[1]>=11) {
        $scope.char.features.push('--');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('--');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Sorcerous Origin feature');
      } if (newVal[1]>=15) {
        $scope.char.features.push('--');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('Metamagic');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Sorcerous Origin feature');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Sorcerous Restoration');
      }
    } else if (newVal[0]=='Warlock') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': false, 'wis': true, 'cha': true};
      $scope.char.proficiencies = ['Light Armor', 'Simple Weapons'];
      $scope.char.subclasses = ['The Archfey', 'The Fiend', 'The Great Old One'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Otherworldly Patron, Pact Magic');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Eldritch Invocations');
      } if (newVal[1]>=3) {
        $scope.char.features.push('Pact Boon');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('--');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Otherworldly Patron feature');
      } if (newVal[1]>=7) {
        $scope.char.features.push('--');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('--');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Otherworldly Patron feature');
      } if (newVal[1]>=11) {
        $scope.char.features.push('Mystic Arcanum (6th level)');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('Mystic Arcanum (7th level)');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Otherworldly Patron feature');
      } if (newVal[1]>=15) {
        $scope.char.features.push('Mystic Arcanum (8th level)');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('Mystic Arcanum (9th level)');
      } if (newVal[1]>=18) {
        $scope.char.features.push('--');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Eldritch Master');
      }
    } else if (newVal[0]=='Wizard') {
      $scope.char.saveProfs = {'str': false, 'dex': false, 'con': false, 'int': true, 'wis': true, 'cha': false};
      $scope.char.proficiencies = ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light Crossbows'];
      $scope.char.subclasses = ['School of Abjuration', 'School of Conjuration', 'School of Divination', 'School of Enchantment', 'School of Evocation', 'School of Illusion', 'School of Necromancy', 'School of Transmutation'];
      if (newVal[1]>=1) {
        $scope.char.features.push('Spellcasting, Arcane Recovery');
      } if (newVal[1]>=2) {
        $scope.char.features.push('Arcane Tradition');
      } if (newVal[1]>=3) {
        $scope.char.features.push('--');
      } if (newVal[1]>=4) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=5) {
        $scope.char.features.push('--');
      } if (newVal[1]>=6) {
        $scope.char.features.push('Arcane Tradition feature');
      } if (newVal[1]>=7) {
        $scope.char.features.push('--');
      } if (newVal[1]>=8) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=9) {
        $scope.char.features.push('--');
      } if (newVal[1]>=10) {
        $scope.char.features.push('Arcane Tradition feature');
      } if (newVal[1]>=11) {
        $scope.char.features.push('--');
      } if (newVal[1]>=12) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=13) {
        $scope.char.features.push('--');
      } if (newVal[1]>=14) {
        $scope.char.features.push('Arcane Tradition feature');
      } if (newVal[1]>=15) {
        $scope.char.features.push('--');
      } if (newVal[1]>=16) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=17) {
        $scope.char.features.push('--');
      } if (newVal[1]>=18) {
        $scope.char.features.push('Spell Mastery');
      } if (newVal[1]>=19) {
        $scope.char.features.push('Ability Score Improvement');
      } if (newVal[1]>=20) {
        $scope.char.features.push('Signature Spell');
      }
    }
  });

  // Spell watchers
  $scope.$watch('[char.level, char.class, char.mods.int, char.mods.wis, char.mods.cha]', function(newVal, oldVal) {
    if (newVal[1]=='Barbarian') {
      $scope.char.hitDice = newVal[0]+'d12';
      $scope.char.spellcastingAbility = '';
      $scope.char.cantripsKnown = $scope.char.spellsKnown = $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
    }
    else if (newVal[1]=='Bard') {
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
    else if (newVal[1]=='Cleric') {
      $scope.char.hitDice = newVal[0]+'d8';
      $scope.char.spellcastingAbility = 'wis';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[3];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[3];
      $scope.char.spellsPrepared = newVal[3] + newVal[0] < 1 ? 1 : newVal[3] + newVal[0];
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
    else if (newVal[1]=='Druid') {
      $scope.char.hitDice = newVal[0]+'d8';
      $scope.char.spellcastingAbility = 'wis';
      $scope.char.spellSaveDC = 8 + $scope.char.pb + newVal[3];
      $scope.char.spellAttackMod = $scope.char.pb + newVal[3];
      $scope.char.spellsPrepared = newVal[3] + newVal[0] < 1 ? 1 : newVal[3] + newVal[0];
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
    else if (newVal[1]=='Fighter') { // This is only for a certain archetype
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
    else if (newVal[1]=='Monk') {
      $scope.char.hitDice = newVal[0]+'d8';
      $scope.char.spellcastingAbility = '';
      $scope.char.cantripsKnown = $scope.char.spellsKnown = $scope.char.level1Slots = $scope.char.level2Slots = $scope.char.level3Slots = $scope.char.level4Slots = $scope.char.level5Slots = $scope.char.level6Slots = $scope.char.level7Slots = $scope.char.level8Slots = $scope.char.level9Slots = 0;
    }
    else if (newVal[1]=='Paladin') {
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
    else if (newVal[1]=='Ranger') {
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
    else if (newVal[1]=='Rogue') {
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
    else if (newVal[1]=='Sorcerer') {
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
    else if (newVal[1]=='Warlock') {
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
    else if (newVal[1]=='Wizard') {
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
