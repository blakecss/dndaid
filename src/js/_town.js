function generateName(sex, race) {
  var fn = '';
  var ln = '';
  if (!race) {
    race = roll(Object.keys(jsonRaceData));
  }
  if (race == 'Dwarf') {
    if (sex = 'f') {
      fn = roll([
        'Amber',
        'Artin',
        'Audhild',
        'Bardryn',
        'Dagnal',
        'Diesa',
        'Eldeth',
        'Falkrunn',
        'Finellen',
        'Gunnloda',
        'Gurdis',
        'Helja',
        'Hlin',
        'Kathra',
        'Kristryd',
        'Ilde',
        'Liftrasa',
        'Mardred',
        'Riswynn',
        'Sannl',
        'Torbera',
        'Torgga',
        'Vistra'
      ]);
    }
    else {
      fn = roll([
        'Adrik',
        'Alberich',
        'Baern',
        'Barendd',
        'Brottor',
        'Bruenor',
        'Dain',
        'Darrak',
        'Delg',
        'Eberk',
        'Einkil',
        'Fargrim',
        'Flint',
        'Gardain',
        'Harbek',
        'Kildrak',
        'Morgran',
        'Orsik',
        'Oskar',
        'Rangrim',
        'Rurik',
        'Taklinn',
        'Thoradin',
        'Thorin',
        'Tordek',
        'Traubon',
        'Travok',
        'Ulfgar',
        'Veit',
        'Vondal'
      ]);
    }
    ln = roll([
      'Balderk',
      'Battlehammer',
      'Brawnanvil',
      'Dankil',
      'Fireforge',
      'Frostbeard',
      'Gorunn',
      'Holderhek',
      'Ironfist',
      'Loderr',
      'Lutgehr',
      'Rumnaheim',
      'Strakeln',
      'Torunn',
      'Ungart'
    ]);
  }
  else if (race == 'Elf') {
    if (sex = 'f') {
      fn = roll([
        'Adrie',
        'Althaea',
        'Anastrianna',
        'Andraste',
        'Antinua',
        'Bethrynna',
        'Birel',
        'Caelynn',
        'Drusilia',
        'Enna',
        'Felosial',
        'Ielenia',
        'Jelenneth',
        'Keyleth',
        'Leshanna',
        'Lia',
        'Meriele',
        'Mialee',
        'Naivara',
        'Quelenna',
        'Quillathe',
        'Sariel',
        'Shanairra',
        'Shava',
        'Silaqui',
        'Theirastra',
        'Thia',
        'Vadania',
        'Valanthe',
        'Xanaphia'
      ]);
    }
    else {
      fn = roll([
        'Adran',
        'Aelar',
        'Aramil',
        'Arannis',
        'Aust',
        'Beiro',
        'Berrian',
        'Carric ',
        'Enialis',
        'Erdan',
        'Erevan',
        'Galinndan',
        'Hadarai',
        'Heian',
        'Himo',
        'Immeral',
        'Ivellios',
        'Laucian',
        'Mindartis',
        'Paelias',
        'Peren',
        'Quarion',
        'Riardon',
        'Rolen',
        'Soveliss',
        'Thamior',
        'Tharivol',
        'Theren',
        'Varis'
      ]);
    }
    ln = roll([
      'Amakiir',
      'Amastacia',
      'Galanodel',
      'Holimion',
      'Ilphelkiir',
      'Liadon',
      'Meliamne',
      'Nai\'lo',
      'Siannodel',
      'Xiloscient'
    ]);
  }
  else if (race == 'Halfling') {
    if (sex = 'f') {
      fn = roll([
        'Andry',
        'Bree',
        'Callie',
        'Cora',
        'Euphemia',
        'Jillian',
        'Kithri',
        'Lavinia',
        'Lidda',
        'Merla',
        'Nedda',
        'Paela',
        'Portia',
        'Seraphina',
        'Shaena',
        'Trym',
        'Vani',
        'Verna'
      ]);
    }
    else {
      fn = roll([
        'Alton',
        'Ander',
        'Cade',
        'Corrin',
        'Eldon',
        'Errich',
        'Finnan',
        'Garret',
        'Lindal',
        'Lyle',
        'Merric',
        'Milo',
        'Osborn',
        'Perrin',
        'Reed',
        'Roscoe',
        'Wellby'
      ]);
    }
    ln = roll([
      'Brushgather',
      'Goodbarrel',
      'Greenbottle',
      'High-hill',
      'Hilltopple',
      'Leagallow',
      'Tealeaf',
      'Thorngage',
      'Tosscobble',
      'Underbough'
    ]);
  }
  else if (race == 'Dragonborn') {
    if (sex = 'f') {
      fn = roll([
        'Akra',
        'Biri',
        'Daar',
        'Farideh',
        'Harann',
        'Flavilar',
        'Jheri',
        'Kava',
        'Korinn',
        'Mishann',
        'Nala',
        'Perra',
        'Raiann',
        'Sora',
        'Surina',
        'Thava',
        'Uadjit'
      ]);
    }
    else {
      fn = roll([
        'Arjhan',
        'Balasar',
        'Bharash',
        'Donaar',
        'Ghesh. Heskan',
        'Kriv',
        'Medrash',
        'Mehen',
        'Nadarr',
        'Pandjed',
        'Patrin',
        'Rhogar',
        'Shamash',
        'Shedinn',
        'Tarhun',
        'Torinn'
      ]);
    }
    ln = roll([
      'Clethtinthiallor',
      'Daardendrian',
      'Delmirev',
      'Drachedandion',
      'Fenkenkabradon',
      'Kepeshkmolik',
      'Kerrhylon',
      'Kimbatuul',
      'Linxakasendalor',
      'Myastan',
      'Nemmonis',
      'Norixius',
      'Ophinshtalajiir',
      'Prexijandilin',
      'Shestendeliath',
      'Turnuroth',
      'Verthisathurgiesh',
      'Yarjerit'
    ]);
  }
  else if (race == 'Gnome') {
    if (sex = 'f') {
      fn = roll([
        'Bimpnottin',
        'Breena',
        'Caramip',
        'Carlin',
        'Donella',
        'Duvamil',
        'Ella',
        'Ellyjobell',
        'Ellywick',
        'Lilli',
        'Loopmottin',
        'Lorilla',
        'Mardnab',
        'Nissa',
        'Nyx',
        'Oda',
        'Orla',
        'Roywyn',
        'Shamil',
        'Tana',
        'Waywocket',
        'Zanna',
        // Nicknames
        'Aleslosh',
        'Ashhearth',
        'Badger',
        'Cloak',
        'Doublelock',
        'Filchbatter',
        'Fnipper',
        'Ku',
        'Nim',
        'Oneshoe',
        'Pock',
        'Sparklegem',
        'Stumbleduck'
      ]);
    }
    else {
      fn = roll([
        'Alston',
        'Alvyn',
        'Boddynock',
        'Brocc',
        'Burgell',
        'Dimble',
        'Eldon',
        'Erky',
        'Fonkin',
        'Frug',
        'Gerbo',
        'Gimble',
        'Glim',
        'Jebeddo',
        'Kellen',
        'Namfoodle',
        'Orryn',
        'Roondar',
        'Seebo',
        'Sindri',
        'Warryn',
        'Wrenn',
        'Zook',
        // Nicknames
        'Aleslosh',
        'Ashhearth',
        'Badger',
        'Cloak',
        'Doublelock',
        'Filchbatter',
        'Fnipper',
        'Ku',
        'Nim',
        'Oneshoe',
        'Pock',
        'Sparklegem',
        'Stumbleduck'
      ]);
    }
    ln = roll([
      'Beren',
      'Daergel',
      'Folkor',
      'Garrick',
      'Nackle',
      'Murnig',
      'Ningel',
      'Raulnor',
      'Scheppen',
      'Timbers',
      'Turen'
    ]);
  }
  else if (race == 'Orc') {
    if (sex = 'f') {
      fn = roll([
        'Baggi',
        'Emen',
        'Engong',
        'Kansif',
        'Myev',
        'Neega',
        'Ovak',
        'Ownka',
        'Shautha',
        'Sutha',
        'Vola',
        'Volen',
        'Yevelda'
      ]);
    }
    else {
      fn = roll([
        'Dench',
        'Feng',
        'Gell',
        'Henk',
        'Holg',
        'Imsh',
        'Keth',
        'Krusk',
        'Mhurren',
        'Ront',
        'Shump',
        'Thokk'
      ]);
    }
  }
  else if (race == 'Tiefling') {
    if (sex = 'f') {
      fn = roll([
        'Akta',
        'Anakis',
        'Bryseis',
        'Criella',
        'Damaia',
        'Ea',
        'Kallista',
        'Lerissa',
        'Makaria',
        'Nemeia',
        'Orianna',
        'Phelaia',
        'Rieta',
        // Virtue names
        'Art',
        'Carrion',
        'Chant',
        'Creed',
        'Despair',
        'Excellence',
        'Fear',
        'Glory',
        'Hope',
        'Ideal',
        'Music',
        'Nowhere',
        'Open',
        'Poetry',
        'Quest',
        'Random',
        'Reverence',
        'Sorrow',
        'Temerity',
        'Torment',
        'Weary'
      ]);
    }
    else {
      fn = roll([
        'Akmenos',
        'Amnon',
        'Barakas',
        'Damakos',
        'Ekemon',
        'Iados',
        'Kairon',
        'Leucis',
        'Melech',
        'Mordai',
        'Morthos',
        'Pelaios',
        'Skamos',
        'Therai',
        // Virtue names
        'Art',
        'Carrion',
        'Chant',
        'Creed',
        'Despair',
        'Excellence',
        'Fear',
        'Glory',
        'Hope',
        'Ideal',
        'Music',
        'Nowhere',
        'Open',
        'Poetry',
        'Quest',
        'Random',
        'Reverence',
        'Sorrow',
        'Temerity',
        'Torment',
        'Weary'
      ]);
    }
  }
  else { // Human
    if (sex = 'f') {
      fn = roll([
        // Calishite
        'Atala',
        'Ceidil',
        'Hama',
        'Jasmal',
        'Meilil',
        'Seipora',
        'Yasheira',
        'Zasheida',
        // Chondathan & Tethyrian
        'Arveene',
        'Esvele',
        'Jhessail',
        'Kerri',
        'Lureene',
        'Miri',
        'Rowan',
        'Shandri',
        'Tessele',
        // Damaran
        'Alethra',
        'Kara',
        'Katernin',
        'Mara',
        'Natali',
        'Olma',
        'Tana',
        'Zora',
        // Illuskan
        'Amafrey',
        'Betha',
        'Cefrey',
        'Kethra',
        'Mara',
        'Olga',
        'Silifrey',
        'Westra',
        // Mulan
        'Arizima',
        'Chathi',
        'Nephis',
        'Nulara',
        'Murithi',
        'Sefris',
        'Thola',
        'Umara',
        'Zolis',
        // Rashemi
        'Fyevarra',
        'Hulmarra',
        'Immith',
        'Imzel',
        'Navarra',
        'Shevarra',
        'Tammith',
        'Yuldra',
        // Shou
        'Bai',
        'Chao',
        'Jia',
        'Lei',
        'Mei',
        'Qiao',
        'Shui',
        'Tai',
        // Turami
        'Balama',
        'Dona',
        'Faila',
        'Jalana',
        'Luisa',
        'Marta',
        'Quara',
        'Selise',
        'Vonda'
      ]);
    }
    else {
      fn = roll([
        // Calishite
        'Aseir',
        'Bardeid',
        'Haseid',
        'Khemed',
        'Mehmen',
        'Sudeiman',
        'Zasheir',
        // Chondathan & Tethyrian
        'Darvin',
        'Dorn',
        'Evendur',
        'Gorstag',
        'Grim',
        'Helm',
        'Malark',
        'Morn',
        'Randal',
        'Stedd',
        // Damaran
        'Bor',
        'Fodel',
        'Glar',
        'Grigor',
        'Igan',
        'Ivor',
        'Kosef',
        'Mival',
        'Orel',
        'Pavel',
        'Sergor',
        // Illuskan
        'Ander',
        'Blath',
        'Bran',
        'Frath',
        'Geth',
        'Lander',
        'Luth',
        'Malcer',
        'Stor',
        'Taman',
        'Urth',
        // Mulan
        'Aoth',
        'Bareris',
        'Ehput-Ki',
        'Kethoth',
        'Mumed',
        'Ramas',
        'So-Kehur',
        'Thazar-De',
        'Urhur',
        // Rashemi
        'Borivik',
        'Faurgar',
        'Jandar',
        'Kanithar',
        'Madislak',
        'Ralmevik',
        'Shaumar',
        'Vladislak',
        // Shou
        'An',
        'Chen',
        'Chi',
        'Fai',
        'Jiang',
        'Jun',
        'Lian',
        'Long',
        'Meng',
        'On',
        'Shan',
        'Shui',
        'Wen',
        // Turami
        'Anton',
        'Diero',
        'Marcon',
        'Pieron',
        'Rimardo',
        'Romero',
        'Salazar',
        'Umbero'
      ]);
    }
    ln = roll([
      // Calishite
      'Basha',
      'Dumein',
      'Jassan',
      'Khalid',
      'Mostana',
      'Pashar',
      'Rein',
      // Chondathan & Tethyrian
      'Amblecrown',
      'Buckman',
      'Dundragon',
      'Evenwood',
      'Greycastle',
      'Tallstag',
      // Damaran
      'Bersk',
      'Chernin',
      'Dotsk',
      'Kulenov',
      'Marsk',
      'Nemetsk',
      'Shemov',
      'Starag',
      // Illuskan
      'Brightwood',
      'Helder',
      'Hornraven',
      'Lackman',
      'Stormwind',
      'Windrivver',
      // Mulan
      'Ankhalab',
      'Anskuld',
      'Fezim',
      'Hahpet',
      'Nathandem',
      'Sepret',
      'Uuthrakt',
      // Rashemi
      'Chergoba',
      'Dyernina',
      'Iltazyara',
      'Murnyethara',
      'Stayanoga',
      'Ulmokina',
      // Shou
      'Chien',
      'Huang',
      'Kao',
      'Kung',
      'Lao',
      'Ling',
      'Mei',
      'Pin',
      'Shin',
      'Sum',
      'Tan',
      'Wan',
      // Turami
      'Agosto',
      'Astorio',
      'Calabra',
      'Domine',
      'Falone',
      'Marivaldi',
      'Pisacar',
      'Ramondo'
    ]);
  }
  return fn + ln ? '' + ln : '';
}

function generateInn(owner) {
  var name = null;
  var adjectives = [
    'Bronze',
    'Silver',
    'Golden',
    'Staggering',
    'Salty',
    'Laughing',
    'Prancing',
    'Dancing',
    'Gilded',
    'Running',
    'Howling',
    'Slaughtered',
    'Sacred',
    'Drunken',
    'Wooden',
    'Roaring',
    'Smiling',
    'Frowning',
    'Lonely',
    'Happy',
    'Wandering',
    'Twisted',
    'Talking',
    'Black',
    'White',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Purple',
    'Gleaming',
    'Broken',
    'Pious',
    'Bloody',
    'Flying',
    'Weary',
    'Fat',
    'Singing',
    'Crooked',
    'Dead'
  ];
  var nouns = [
    'Eel',
    'Griffon',
    'Pony',
    'Rose',
    'Lily',
    'Stag',
    'Wolf',
    'Lamb',
    'Dragon',
    'Goat',
    'Spirit',
    'Specter',
    'Eagle',
    'Satyr',
    'Gargoyle',
    'Hound',
    'Cat',
    'Spider',
    'Star',
    'Toad',
    'Owl',
    'Kobold',
    'Kraken',
    'Crab',
    'Knight',
    'Lion',
    'Tiger',
    'Bear',
    'Lizard',
    'Bard',
    'Flagon',
    'Flask',
    'Chalice',
    'Pearl',
    'Moon',
    'Sun',
    'Boar',
    'Horn',
    'King',
    'Queen'
  ];
  var titles = [
    'Tavern',
    'Inn',
    'Lodge',
    'Bar',
    'Pub'
  ];
  if (owner) {
    name = owner + '\'s ' + roll(titles);
  }
  else {
    name = roll([
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return 'The ' + roll(nouns) + ' & ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(nouns) + ' & ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(titles);
      }
    ]);
  }
  var inventory = roll([
    'TODO'
  ]);
  return name + ' (Inn)';
}

function generateSmith(owner) {
  var name = null;
  var name = null;
  var adjectives = [
    'Bronze',
    'Silver',
    'Golden',
    'Stoic',
    'Hardened',
    'Gilded',
    'Sacred',
    'Roaring',
    'Twisted',
    'Black',
    'White',
    'Gray',
    'Red',
    'Reinforced',
    'Smelted',
    'Fiery',
    'Platinum',
    'Bloody',
    'Deadly',
    'Armored',
    'Molten',
    'Forged',
    'Exalted',
    'Superior',
    'Lethal',
    'Fatal',
    'Honed',
    'Keen',
    'Smoking',
    'Burning'
  ];
  var nouns = [
    'Griffon',
    'Phoenix',
    'Mace',
    'Dragon',
    'Eagle',
    'Gargoyle',
    'Hound',
    'Knight',
    'Stone',
    'Axe',
    'Ore',
    'Spear',
    'Ogre',
    'Fire',
    'Furnace',
    'Metal',
    'Hammer',
    'Anvil',
    'Dagger',
    'Sword',
    'Shield',
    'Helmet',
    'Tongs',
    'Iron',
    'Steel',
    'Flame',
    'Soldier',
    'Warrior',
    'Barbarian',
    'Fighter'
  ];
  var titles = [
    'Forge',
    'Arsenal',
    'Blacksmith',
    'Armory'
  ];
  if (owner) {
    name = owner + '\'s ' + roll(titles);
  }
  else {
    name = roll([
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return roll(nouns) + ' & ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(nouns) + ' & ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(titles);
      }
    ]);
  }
  var inventory = roll([
    'TODO'
  ]);
  return name + ' (Smith)';
}

function generateAlchemist(owner) {
  var name = null;
  var name = null;
  var adjectives = [
    'Bronze',
    'Silver',
    'Golden',
    'Mischievous',
    'Secret',
    'Gilded',
    'Sacred',
    'Bottled',
    'Medicinal',
    'Black',
    'White',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Purple',
    'Poisonous',
    'Silent',
    'Deadly',
    'Wise',
    'Harmless',
    'Acidic',
    'Bottomless',
    'Superior',
    'Opaque',
    'Invisible',
    'Aromatic',
    'Dripping',
    'Flowing',
    'Still'
  ];
  var nouns = [
    'Spirit',
    'Phoenix',
    'Spider',
    'Cauldron',
    'Spoon',
    'Mix',
    'Witch',
    'Bottle',
    'Phial',
    'Elixir',
    'Concoction',
    'Tonic',
    'Brew',
    'Newt',
    'Flask',
    'Potion',
    'Frog',
    'Mushroom',
    'Acid',
    'Vine',
    'Lake',
    'Viper',
    'Eel',
    'Dew',
    'Ivy',
    'Flame',
    'Rose',
    'Lily',
    'Chameleon',
    'Tiger'
  ];
  var titles = [
    'Alchemist',
    'Chemist',
    'Apothecary',
    'Herbalist'
  ];
  if (owner) {
    name = owner + '\'s ' + roll(titles);
  }
  else {
    name = roll([
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return roll(nouns) + ' & ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(nouns) + ' & ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(titles);
      }
    ]);
  }
  var inventory = roll([
    'TODO'
  ]);
  return name + ' (Alchemist)';
}

function generateJeweler(owner) {
  var name = null;
  var adjectives = [
    'Bronze',
    'Silver',
    'Golden',
    'Shining',
    'Ruby',
    'Gilded',
    'Sacred',
    'Saphirre',
    'Emerald',
    'Black',
    'White',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Purple',
    'Diamond',
    'Silent',
    'Luxurious',
    'Blinding',
    'Cutting',
    'Flawless',
    'Polished',
    'Superior',
    'Opaque',
    'Flashing',
    'Prismatic',
    'Ornate',
    'Priceless',
    'Alluring'
  ];
  var nouns = [
    'Pearl',
    'Phoenix',
    'Rock',
    'Edge',
    'Stone',
    'Gem',
    'Peacock',
    'Ring',
    'Noble',
    'Queen',
    'King',
    'Star',
    'Mirror',
    'Flame',
    'Crystal',
    'Inlay',
    'Frog',
    'Prince',
    'Princess',
    'Chameleon',
    'Lake',
    'Toucan',
    'Parrot',
    'Butterfly',
    'Finch',
    'Coin',
    'Rose',
    'Lily',
    'Necklace',
    'Tiger'
  ];
  var titles = [
    'Jeweler',
    'Stonecutter',
    'Gemologist'
  ];
  if (owner) {
    name = owner + '\'s ' + roll([
      'Gems',
      'Jewels',
      'Amulets',
      'Rings',
      'Gemstones'
    ]);
  }
  else {
    name = roll([
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return roll(nouns) + ' & ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(nouns) + ' & ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(titles);
      }
    ]);
  }
  var inventory = roll([
    'TODO'
  ]);
  return name + ' (Jeweler)';
}

function generateEnchanter(owner) {
  var name = null;
  var adjectives = [
    'Bronze',
    'Silver',
    'Golden',
    'Shining',
    'Cursed',
    'Gilded',
    'Dusty',
    'Sacred',
    'Curious',
    'Black',
    'White',
    'Gray',
    'Red',
    'Blue',
    'Green',
    'Purple',
    'Diamond',
    'Enchanted',
    'Casting',
    'Hidden',
    'Wise',
    'Ancient',
    'Brilliant',
    'Sacred',
    'Celestial',
    'Magical',
    'Taboo',
    'Wicked',
    'Rare',
    'Sleeping'
  ];
  var nouns = [
    'Scroll',
    'Wand',
    'Staff',
    'Tome',
    'Spark',
    'Moon',
    'Spirit',
    'Shadow',
    'Orb',
    'Pillar',
    'Spell',
    'Star',
    'Curse',
    'Wizard',
    'Crystal',
    'Mage',
    'Warlock',
    'Beholder',
    'Lich',
    'Tablet',
    'Planet',
    'Codex',
    'Owl',
    'Pedestal',
    'Text',
    'Wraith',
    'Genie',
    'Key',
    'Talisman',
    'Hourglass'
  ];
  var titles = [
    'Enchanter',
    'Arcanery'
  ];
  if (owner) {
    name = owner + '\'s ' + roll([
      'Curiosities',
      'Wonders',
      'Wands',
      'Staves',
      'Scrolls',
      'Tomes',
      'Spells'
    ]);
  }
  else {
    name = roll([
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return roll(nouns) + ' & ' + roll(nouns);
      },
      function() {
        return 'The ' + roll(nouns) + ' & ' + roll(nouns) + ' ' + roll(titles);
      },
      function() {
        return 'The ' + roll(adjectives) + ' ' + roll(titles);
      }
    ]);
  }
  var inventory = roll([
    'TODO'
  ]);
  return name + ' (Enchanter)';
}

function generateTown(size) {
  if (!size) {
    size = roll([
      [1, 50, function() {
        return roll(1000);
      }],
      [51, 85, function() {
        return roll(5000) + 1000;
      }],
      [86, 100, function() {
        return roll(19000) + 6000;
      }]
    ]);
  }
  var stores = [];
  var type = null;
  if (size <= 1000) {
    type = 'village';
    stores.push(generateInn());
  }
  else if (size <= 6000) {
    type = 'town';
    for (var i = 0; i < Math.ceil(size/2000); i++) {
      stores.push(generateInn());
    }
    for (var i = 0; i < Math.ceil(size/2500); i++) {
      stores.push(
        roll([
          generateSmith(),
          generateAlchemist(),
          generateJeweler(),
          generateEnchanter()
        ])
      );
    }
  }
  else {
    type = 'city';
    for (var i = 0; i < Math.ceil(size/3000); i++) {
      stores.push(generateInn());
    }
    stores.push(generateSmith());
    stores.push(generateAlchemist());
    stores.push(generateJeweler());
    stores.push(generateEnchanter());
    for (var i = 0; i < Math.ceil(size/5000); i++) {
      stores.push(
        roll([
          generateSmith(),
          generateAlchemist(),
          generateJeweler(),
          generateEnchanter()
        ])
      );
    }
  }
  var name = roll([
    'Aerilon',
    'Aquarin',
    'Aramoor',
    'Azmar',
    'Begger\'s Hole',
    'Black Hollow',
    'Blue Field',
    'Briar Glen',
    'Brickelwhyte',
    'Broken Shield',
    'Boatwright',
    'Bullmar',
    'Carran',
    'City of Fire',
    'Coalfell',
    'Cullfield',
    'Darkwell',
    'Deathfall',
    'Doonatel',
    'Dry Gulch',
    'Easthaven',
    'Ecrin',
    'Erast',
    'Far Water',
    'Firebend',
    'Fool\'s March',
    'Frostford',
    'Goldcrest',
    'Goldenleaf',
    'Greenflower',
    'Garen\'s Well',
    'Haran',
    'Hillfar',
    'Hogsfeet',
    'Hollyhead',
    'Hull',
    'Hwen',
    'Icemeet',
    'Ironforge',
    'Irragin',
    'Jarren\'s Outpost',
    'Jongvale',
    'Kara\'s Vale',
    'Knife\'s Edge',
    'Lakeshore',
    'Leeside',
    'Lullin',
    'Marren\'s Eve',
    'Millstone',
    'Moonbright',
    'Mountmend',
    'Nearon',
    'New Cresthill',
    'Northpass',
    'Nuxvar',
    'Oakheart',
    'Oar\'s Rest',
    'Old Ashton',
    'Orrinshire',
    'Ozryn',
    'Pavv',
    'Pella\'s Wish',
    'Pinnella Pass',
    'Pran',
    'Quan Ma',
    'Queenstown',
    'Ramshorn',
    'Red Hawk',
    'Rivermouth',
    'Saker Keep',
    'Seameet',
    'Ship\'s Haven',
    'Silverkeep',
    'South Warren',
    'Snake\'s Canyon',
    'Snowmelt',
    'Squall\'s End',
    'Swordbreak',
    'Tarrin',
    'Three Streams',
    'Trudid',
    'Ubbin Falls',
    'Ula\'ree',
    'Veritas',
    'Violl’s Garden',
    'Wavemeet',
    'Whiteridge',
    'Willowdale',
    'Windrip',
    'Wintervale',
    'Wellspring',
    'Westwend',
    'Wolfden',
    'Xan\'s Bequest',
    'Xynnar',
    'Yarrin',
    'Yellowseed',
    'Zao Ying',
    'Zeffari',
    'Zumka'
  ]);
  var relations = roll([
    [1, 10, 'harmony'],
    [11, 14, 'tension or rivalry'],
    [15, 16, 'racial majority are conquerors'],
    [17, 17, 'racial minority are rulers'],
    [18, 18, 'racial minority are refugees'],
    [19, 19, 'racial majority oppresses minority'],
    [20, 20, 'racial minority oppresses majority']
  ]);
  var govt = roll([
    [1, 8, 'Autocracy'],
    [9, 13, 'Bureaucracy'],
    [14, 19, 'Confederacy'],
    [20, 22, 'Democracy'],
    [23, 27, 'Dictatorship'],
    [28, 42, 'Feudalism'],
    [43, 44, 'Gerontocracy'],
    [45, 53, 'Hierarchy'],
    [54, 56, 'Magocracy'],
    [57, 58, 'Matriarchy'],
    [59, 64, 'Militocracy'],
    [65, 74, 'Monarchy'],
    [75, 78, 'Oligarchy'],
    [79, 80, 'Patriarchy'],
    [81, 83, 'Meritocracy'],
    [84, 85, 'Plutocracy'],
    [86, 92, 'Republic'],
    [93, 94, 'Satrapy'],
    [95, 95, 'Kleptocracy'],
    [96, 100, 'Theocracy']
  ]);
  var ruler = roll([
    [1, 5, 'respected, fair, and just'],
    [6, 8, 'a feared tyrant'],
    [9, 9, 'a weakling manipulated by others'],
    [10, 10, 'an illegitimate ruler, simmering civil ware'],
    [11, 11, 'controlled by a powerful monster'],
    [12, 12, 'a mysterious, anonymous cabal'],
    [13, 13, 'contested, with leadership openly fighting'],
    [14, 14, 'a cabal that seized power openly'],
    [15, 15, 'a doltish lout'],
    [16, 16, 'on their deathbed with claimants competing for power'],
    [17, 18, 'iron-willed but respected'],
    [19, 20, 'a religious leader']
  ]);
  var trait = roll([
    'canals in place of its streets',
    'containing a massive statue or monument',
    'containing a grand temple',
    'it being a large fortress',
    'verdant parks and orchards',
    'a river that divides town',
    'being a major trade center',
    'being the headquarters of a powerful family or guild',
    'having a mostly wealthy population',
    'being destitute and rundown',
    'having an awful smell (tanneries, open sewers)',
    'being the center of trade for one specific good',
    'being the site of many battles',
    'being the site of a mythic or magical event',
    'containing an important library or archive',
    'having banned the worship of all gods',
    'having a sinister reputation',
    'containing a distinguished academy',
    'being the site of an important tomb or graveyard',
    'being built atop ancient ruins'
  ]);
  var known = roll([
    'delicious cuisine',
    'rude people',
    'greedy merchants',
    'artists and writers',
    'great hero/savior',
    'flowers',
    'hordes of beggars',
    'tough warriors',
    'dark magic',
    'decadence',
    'piety',
    'gambling',
    'godlessness',
    'education',
    'wines',
    'high fashion',
    'political intrigue',
    'powerful guilds',
    'strong drink',
    'patriotism'
  ]);
  var calamity = roll([
    [1, 1, 'a suspected vampire infestation'],
    [2, 2, 'a new cult that is seeking converts'],
    [3, 3, 'an important figure that has recently died (murder suspected)'],
    [4, 4, 'a war between rival thieves\' guilds'],
    [5, 6, 'a plague or famine (sparks riots)'],
    [7, 7, 'corrupt officials'],
    [8, 9, 'marauding monsters'],
    [10, 10, 'a powerful wizard that has moved into town'],
    [11, 11, 'an economic depression (trade disrupted)'],
    [12, 12, 'flooding'],
    [13, 13, 'undead stirring in cemeteries'],
    [14, 14, 'a prophecy of doom'],
    [15, 15, 'being on the brink of war'],
    [16, 16, 'internal strife (leads to anarchy)'],
    [17, 17, 'being besieged by enemies'],
    [18, 18, 'scandal that threatens several powerful families'],
    [19, 19, 'a nearby dungeon that was discovered (adventurers flock to town)'],
    [20, 20, 'religious sects struggling for power']
  ]);
  var output = name + ' is a ' + type + ' with a population of ' + size + '. It is known for its ' + known + ', and it has the notable trait of ' + trait + '. ' + govt + ' is the form of government and the current state of racial relations is ' + relations + '. The ruler is ' + ruler + '. The ' + type + ' is struggling with ' + calamity + '.';
  output += '\nStores:\n';
  stores.forEach(function(item, index) {
    output += item + '\n';
  });
  return output;
}
