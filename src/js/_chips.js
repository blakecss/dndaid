Vue.component('chips', {
  props: {
    chips: {
      type: Array
    },
    suggestions: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data: function() {
    return {
      newChip: '',
      savedChip: '',
      focus: 0
    }
  },
  computed: {
    suggs: {
      get: function() {
        return this.suggestions;
      },
      set: function() {

      }
    }
  },
  methods: {
    deleteChip: function(i) {
      this.chips.splice(i, 1);
    },
    addChip: function() {
      this.chips.push(this.newChip);
      this.newChip = '';
      this.focus = 0;
    },
    changeSuggestions: function() {
      var nc = this.newChip.toLowerCase();
      this.suggs = this.suggestions.filter(function(v) {
        return v.toLowerCase().includes(nc);
      });
      this.savedChip = this.newChip;
      this.focus = 0;
    },
    addSuggestion: function(s) {
      this.chips.push(s);
      this.newChip = '';
      this.focus = 0;
    },
    focusUp: function() {
      this.focus--;
      if (this.focus < 0) {
        this.focus = this.suggs.length;
      }
      if (this.focus == 0) {
        this.newChip = this.savedChip;
      }
      else {
        this.newChip = this.suggs[this.focus-1];
      }
    },
    focusDown: function() {
      this.focus++;
      if (this.focus > this.suggs.length) {
        this.focus = 0;
      }
      if (this.focus == 0) {
        this.newChip = this.savedChip;
      }
      else {
        this.newChip = this.suggs[this.focus-1];
      }
    }
  },
  mounted: function() {
    var cs = this.chips;
    var start = 0;
    var end = 0;
    var el = this.$el.querySelector('ul');
    jQuery(el).sortable({
      placeholder: 'chip-placeholder',
      forcePlaceholderSize: true,
      start: function(e, ui) {
        start = ui.item.index();
      },
      stop: function(e, ui) {
        end = ui.item.index();
        cs.splice(end, 0, cs.splice(start, 1)[0]);
      }
    });
  },
  template: '<div class="chips">\
    <ul>\
      <li v-for="(chip, index) in chips" :key="Math.random().toString(36).substr(2,9)">{{chip}}<button @click="deleteChip(index)"><svg><use xlink:href="sprites.svg#delete"></use></svg></button></li>\
    </ul>\
    <form @submit.prevent="addChip()">\
      <input v-model="newChip" @input="changeSuggestions()" @keyup.down="focusDown()" @keyup.up="focusUp()" @keydown.enter.prevent="addChip()" class="chip-input" type="text" placeholder="Add" />\
      <div v-if="newChip" class="suggestions">\
        <button v-for="(suggestion, index) in suggs" :class="[index+1 == focus ? \'hover\' : \'\']" @click.prevent="addSuggestion(suggestion)">{{suggestion}}</button>\
      </div>\
    </form>\
  </div>'
});
