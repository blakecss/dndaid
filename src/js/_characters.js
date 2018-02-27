Vue.component('characters', {
  props: ['characters'],
  data: function() {
    return {
      left: '',
      right: '',
      currentCharacter: 0,
      characterSelect: false,
      characterDelete: false
    }
  },
  filters: {
    mod: function(value) {
      var v = Math.floor((value - 10) / 2);
      return v >= 0 ? '+' + v : v;
    }
  },
  methods: {
    rollInitiative: function() {
      for (var i = 0; i < this.characters.length; i++) {
        this.characters[i].initiative = roll('1d20 + ' + mod(this.characters[i].abilities.dex));
      }
      this.characters.sort(function(a, b) {
        return b.initiative - a.initiative;
      });
    },
    nextTurn: function() {
      var f = this.characters.shift();
      this.characters.push(f);
    },
    leftBtn: function(i) {
      if (this.right.id == this.characters[i].id) {
        this.right = '';
      }
      this.left = this.characters[i];
    },
    rightBtn: function(i) {
      if (this.left.id == this.characters[i].id) {
        this.left = '';
      }
      this.right = this.characters[i];
    },
    duplicateBtn: function(i) {
      var dupe = Vue.util.extend({}, this.characters[i]);
      dupe.id = Math.random().toString(36).substr(2,9);
      this.characters.splice(i + 1, 0, dupe);
    },
    deleteBtn: function(i) {
      this.characterDelete = i;
    },
    deleteCharacter: function(i) {
      if (this.left.id === this.characters[i].id) {
        this.left = '';
      }
      if (this.right.id === this.characters[i].id) {
        this.right = '';
      }
      this.characters.splice(i, 1);
      this.characterDelete = false;
    },
    clearLeft: function() {
      this.left = '';
    },
    clearRight: function() {
      this.right = '';
    }
  },
  template: '<div id="characters">\
    <main class="comparisons row">\
      <div class="col-sm-6">\
        <transition name="character" mode="out-in">\
          <component v-if="left" :is="left.type" :c="left" @clear="clearLeft()"></component>\
        </transition>\
        <div class="character-placeholder">\
          <p>Click on a character to inspect</p>\
        </div>\
      </div>\
      <div class="col-sm-6">\
        <transition name="character" mode="out-in">\
          <component v-if="right" :is="right.type" :c="right" @clear="clearRight()"></component>\
        </transition>\
        <div class="character-placeholder">\
          <p>Click on a character to inspect</p>\
        </div>\
      </div>\
    </main>\
    <aside class="character-list">\
      <button class="add-character" @click="characterSelect = true" title="Add Character">\
        <svg><use xlink:href="sprites.svg#plus"></use></svg>\
      </button>\
      <transition name="fade">\
        <div v-if="characters.length > 0" class="order">\
          <button @click="rollInitiative()" title="Roll Initiative"><svg><use xlink:href="sprites.svg#initiative"></use></svg></button>\
          <button @click="nextTurn()" title="Next Turn"><svg><use xlink:href="sprites.svg#next"></use></svg></button>\
        </div>\
      </transition>\
      <transition-group class="sortable" name="list-slide" tag="ul">\
        <li v-for="(character, index) in characters" :key="character.id">\
          <div class="info">\
            <div class="class-icon">\
              <svg v-if="character.type == \'player\'"><use :xlink:href="\'sprites.svg#\' + character.klass.toLowerCase()"></use></svg>\
              <svg v-if="character.type == \'creature\'"><use xlink:href="sprites.svg#creature"></use></svg>\
            </div>\
            <p class="name">{{character.name}}</p>\
            <svg class="reorder"><use xlink:href="sprites.svg#reorder"></use></svg>\
          </div>\
          <div class="stats">\
            <div>\
              <svg><use xlink:href="sprites.svg#health"></use></svg>\
              <input v-model.number="character.currentHP" type="number" />\
            </div>\
            <div>\
              <svg><use xlink:href="sprites.svg#armor"></use></svg>\
              <input v-model.number="character.armorClass" type="number" readonly />\
            </div>\
            <div>\
              <svg><use xlink:href="sprites.svg#initiative"></use></svg><input v-model.number="character.initiative" type="number" />\
            </div>\
          </div>\
          <div class="tools">\
            <button :class="[left && left.id === character.id ? \'current\' : \'\']" class="flat-btn" @click="leftBtn(index)" title="Inspect Left">\
              <svg><use xlink:href="sprites.svg#arrow-left"></use></svg>\
            </button>\
            <button :class="[right && right.id === character.id ? \'current\' : \'\']" class="flat-btn" @click="rightBtn(index)" title="Inspect Right">\
              <svg><use xlink:href="sprites.svg#arrow-right"></use></svg>\
            </button>\
            <button class="flat-btn" @click="duplicateBtn(index)" title="Duplicate Character">\
              <svg><use xlink:href="sprites.svg#duplicate"></use></svg>\
            </button>\
            <button class="flat-btn" @click="deleteBtn(index)" title="Delete Character">\
              <svg><use xlink:href="sprites.svg#trash"></use></svg>\
            </button>\
          </div>\
        </li>\
      </transition-group>\
    </aside>\
    <transition name="fade">\
      <div v-if="characterSelect" id="character-creator" class="modal-bg">\
        <add-character :characterSelect="characterSelect" :characters="characters" @close="characterSelect = false"></add-character>\
      </div>\
    </transition>\
    <transition name="fade">\
      <div v-if="typeof characterDelete == \'number\'" class="modal-bg">\
        <div class="modal">\
          <div class="modal-content">\
            <p>Delete {{characters[characterDelete].name || character}}?</p>\
          </div>\
          <div class="modal-footer">\
            <button @click="characterDelete = false">Cancel</button>\
            <button @click="deleteCharacter(characterDelete)">Delete</button>\
          </div>\
        </div>\
      </div>\
    </transition>\
  </div>'
});
