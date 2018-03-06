Vue.component('world', {
  data: function() {
    return {
      name: '',
      town: '',
      dungeon: '',
      treasure: ''
    }
  },
  methods: {
    generateName: function() {
      this.name = generateName();
    },
    generateTown: function() {
      this.town = generateTown();
    },
    generateDungeon: function() {
      this.dungeon = generateDungeon();
    },
    generateTreasure: function() {
      this.treasure = generateTreasure(1);
    }
  },
  template: '<div id="characters">\
    <main class="container row">\
      <div class="col-xs-6">\
        <button @click="generateName()">Generate Name</button>\
        <p>{{name}}</p>\
      </div>\
      <div class="col-xs-6">\
        <button @click="generateTown()">Generate Town</button>\
        <p>{{town}}</p>\
      </div>\
      <div class="col-xs-6">\
        <button @click="generateDungeon()">Generate Dungeon</button>\
        <p>{{dungeon}}</p>\
      </div>\
      <div class="col-xs-6">\
        <button @click="generateTreasure()">Generate Treasure</button>\
        <div>\
          <span v-html="treasure"></span>\
        </div>\
      </div>\
    </main>\
  </div>'
});
