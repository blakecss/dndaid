function generateTrick() {
  var o = roll([
    'Book',
    'Brain preserved in a jar',
    'Burning fire',
    'Cracked gem',
    'Door',
    'Fresco',
    'Furniture',
    'Glass sculpture',
    'Mushroom field',
    'Painting',
    'Plant or tree',
    'Pool of water',
    'Runes engraved on wall or floor',
    'Skull',
    'Sphere of magical energy',
    'Statue',
    'Stone obelisk',
    'Suit of armor',
    'Tapestry or rug',
    'Target dummy'
  ]);
  var e = roll([
    [1, 3, 'ages the first person to touch the object.'],
    [4, 6, 'the touched object animates, or it animates other objects nearby.'],
    [7, 10, 'asks three skill-testing questions (if all three answered correctly, a reward appears).'],
    [11, 13, 'bestows resistance or vulnerability.'],
    [14, 16, 'changes a character\'s alignment, personality, size, appearance, or sex when touched.'],
    [17, 19, 'changes one substance to another, such as gold to lead or meta to brittle crystal.'],
    [20, 22, 'creates a force field.'],
    [23, 26, 'creates an illusion.'],
    [27, 29, 'suppresses magic items for a time.'],
    [30, 32, 'enlarges or reduces characters.'],
    [33, 35, 'speaks a riddle (<i>Magic Mouth</i>).'],
    [36, 38, 'casts <i>confusion</i> (targets all creatures within 10 ft.).'],
    [39, 41, 'gives directions (true or false).'],
    [42, 44, 'grants a wish.'],
    [45, 47, 'flies about to avoid being touched.'],
    [48, 50, 'casts <i>geas</i> on the characters.'],
    [51, 53, 'increases, reduces, negates, or reverses gravity.'],
    [54, 56, 'induces greed.'],
    [57, 59, 'contains an imprisoned creature.'],
    [60, 62, 'locks or unlocks exits.'],
    [63, 65, 'offers a game of chance, with the promise of a reward or valuable information.'],
    [66, 68, 'helps or harms certain types of creatures.'],
    [69, 71, 'casts <i>polymorph</i> on the characters (lasts 1 hour).'],
    [72, 75, 'presents a puzzle or riddle.'],
    [76, 78, 'prevents movement.'],
    [79, 81, 'releases coins, false coins, gems, false gems, a magic item, or a map.'],
    [82, 84, 'releases, summons, or turns into a monster.'],
    [85, 87, 'casts <i>suggestion</i> on the characters.'],
    [88, 90, 'wails loudly when touched.'],
    [91, 93, 'talks (normal speech, nonsense, poetry and rhymes, singing, spellcasting, or screaming).'],
    [94, 97, 'teleports characters to another place.'],
    [98, 00, 'swaps two or more characters\' minds.']
  ]);
  return o + ' that ' + e;
}

function generateDungeon() {
  var location = roll([
    [1, 4, 'in a building in a city'],
    [5, 8, 'in catacombs or sewers beneath a city'],
    [9, 12, 'beneath a farmhouse'],
    [13, 16, 'beneath a graveyard'],
    [17, 22, 'beneath a ruined castle'],
    [23, 26, 'beneath a ruined city'],
    [27, 30, 'beneath a temple'],
    [31, 34, 'in a chasm'],
    [35, 38, 'in a cliff face'],
    [39, 42, 'in a desert'],
    [43, 46, 'in a forest'],
    [47, 50, 'in a glacier'],
    [51, 54, 'in a gorge'],
    [55, 58, 'in a jungle'],
    [59, 62, 'in a mountain pass'],
    [63, 66, 'in a swamp'],
    [67, 70, 'beneath or on top of a mesa'],
    [71, 74, 'in sea caves'],
    [75, 78, 'in several connected mesas'],
    [79, 82, 'on a mountain peak'],
    [83, 86, 'on a promontory'],
    [87, 90, 'on an island'],
    [91, 95, 'underwater'],
    [96, 100, function () {
      return roll([
        'among the branches of a tree',
        'around a geyser',
        'behind a waterfall',
        'buried in an avalanche',
        'buried in a sandstorm',
        'buried in volcanic ash',
        'in a castle or structure sunken in a swamp',
        'in a castle or structure at the bottom of a sinkhole',
        'floating on the sea',
        'in a meteorite',
        'on a demiplane or in a pocket dimension',
        'in an area devastated by a magical catastrophe',
        'on a cloud',
        'in the Feywild',
        'in the Shadowfell',
        'on an island in an underground sea',
        'in a volcano',
        'on the back of a Gargantuan living creature',
        'sealed inside a magical dome of force',
        'inside a <i>Mordenkainen\'s magnificent mansion</i>'
      ]);
    }]
  ]);
  var purpose = roll([
    [1, 1, 'Death trap'],
    [2, 5, 'Lair'],
    [6, 6, 'Maze'],
    [7, 9, 'Mine'],
    [10, 10, 'Planar gate'],
    [11, 14, 'Stronghold'],
    [15, 17, 'Temple or shrine'],
    [18, 19, 'Tomb'],
    [20, 20, 'Treasure vault']
  ]);
  var creator = roll([
    [1, 1, 'a beholder'],
    [2, 4, function() {
      return roll([
        [1, 1, 'a demon-worshiping cult'],
        [2, 2, 'a devil-worshiping cult'],
        [3, 4, 'an elemental Air cult'],
        [5, 6, 'an elemental Earth cult'],
        [7, 8, 'an elemental Fire cult'],
        [9, 10, 'an elemental Water cult'],
        [11, 15, 'worshipers of an evil deity'],
        [16, 17, 'worshipers of a good deity'],
        [18, 20, 'worshipers of a neutral deity'],
      ]);
    }],
    [5, 8, 'dwarves'],
    [9, 9, 'elves (including drow)'],
    [10, 10, 'giants'],
    [11, 11, 'hobgoblins'],
    [12, 15, function() {
      var a = roll([
        [1, 2, 'Lawful good'],
        [3, 4, 'Neutral good'],
        [5, 6, 'Chaotic good'],
        [7, 9, 'Lawful neutral'],
        [10, 11, 'Neutral'],
        [12, 12, 'Chaotic neutral'],
        [13, 15, 'Lawful evil'],
        [16, 18, 'Neutral evil'],
        [19, 20, 'Chaotic evil']
      ]);
      var c = roll([
        [1, 1, 'Barbarian'],
        [2, 2, 'Bard'],
        [3, 4, 'Cleric'],
        [5, 5, 'Druid'],
        [6, 7, 'Fighter'],
        [8, 8, 'Monk'],
        [9, 9, 'Paladin'],
        [10, 10, 'Ranger'],
        [11, 14, 'Rogue'],
        [15, 15, 'Sorcerer'],
        [16, 16, 'Warlock'],
        [17, 20, 'Wizard']
      ]);
      return 'humans (' + a + ' ' + c + ')';
    }],
    [16, 16, 'Kuo-toa'],
    [17, 17, 'a lich'],
    [18, 18, 'mind flayers'],
    [19, 19, 'Yuan-ti'],
    [20, 20, 'no creator (natural)']
  ]);
  var history = roll([
    [1, 3, 'was abandoned by it\'s creators'],
    [4, 4, 'was abandoned due to a plague'],
    [5, 8, 'was conquered by invaders'],
    [9, 10, 'it\'s creator(s) were destroyed by attacking raiders'],
    [11, 11, 'it\'s creator(s) were destroyed by a discovery made within the site'],
    [12, 12, 'it\'s creator(s) were destroyed by internal conflict'],
    [13, 13, 'it\'s creator(s) were destroyed by a magical catastrophe'],
    [14, 15, 'it\'s creator(s) were destroyed by a natural disaster'],
    [16, 16, 'the location was cursed by the gods and shunned'],
    [17, 18, 'it\'s creator(s) is still in control'],
    [19, 19, 'was overrun by planar creatures'],
    [20, 20, 'was the site of a great miracle']
  ]);
  var goal = roll([
    'stop the dungeon\'s monstrous inhabitants from raiding the surface world',
    'foil a villain\'s evil scheme',
    'destroy a magical threat inside the dungeon',
    'acquire treasure',
    'find a particular item for a specific purpose',
    'rescue a captive',
    'discover the fate of a previous adventuring party',
    'find an NPC who disappeared in the area',
    'slay a dragon or some other challenging monster',
    'discover the nature and origin of a strange location or phenomenon',
    'pursue fleeing foes taking refuge in the dungeon',
    'escape from captivity in the dungeon',
    'clear a ruin so it can be rebuilt and reoccupied',
    'disover why a villain is interested in the dungeon',
    'win a bet or complete a rite of passage by surviving in the dungeon for a certain amount of time',
    'parley with a villain in the dungeon',
    'hide from a threat outside the dungeon',
    function() {
      var first = roll([
        'stop the dungeon\'s monstrous inhabitants from raiding the surface world',
        'foil a villain\'s evil scheme',
        'destroy a magical threat inside the dungeon',
        'acquire treasure',
        'find a particular item for a specific purpose',
        'rescue a captive',
        'discover the fate of a previous adventuring party',
        'find an NPC who disappeared in the area',
        'slay a dragon or some other challenging monster',
        'discover the nature and origin of a strange location or phenomenon',
        'pursue fleeing foes taking refuge in the dungeon',
        'escape from captivity in the dungeon',
        'clear a ruin so it can be rebuilt and reoccupied',
        'disover why a villain is interested in the dungeon',
        'win a bet or complete a rite of passage by surviving in the dungeon for a certain amount of time',
        'parley with a villain in the dungeon',
        'hide from a threat outside the dungeon',
        ''
      ]);
      var second = roll([
        'stop the dungeon\'s monstrous inhabitants from raiding the surface world',
        'foil a villain\'s evil scheme',
        'destroy a magical threat inside the dungeon',
        'acquire treasure',
        'find a particular item for a specific purpose',
        'rescue a captive',
        'discover the fate of a previous adventuring party',
        'find an NPC who disappeared in the area',
        'slay a dragon or some other challenging monster',
        'discover the nature and origin of a strange location or phenomenon',
        'pursue fleeing foes taking refuge in the dungeon',
        'escape from captivity in the dungeon',
        'clear a ruin so it can be rebuilt and reoccupied',
        'disover why a villain is interested in the dungeon',
        'win a bet or complete a rite of passage by surviving in the dungeon for a certain amount of time',
        'parley with a villain in the dungeon',
        'hide from a threat outside the dungeon',
        ''
      ]);
      if (first && second) {
        return first + ' and ' + second;
      }
      else {
        return first + second;
      }
    }
  ]);
  return purpose + ' ' + location + ' created by ' + creator + ' but ' + history + '. Your goal is to ' + goal + '.';
}
