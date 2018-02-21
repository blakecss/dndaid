Vue.component('world', {
  data: function() {
    return {
      town: ''
    }
  },
  methods: {
    generateTown: function() {
      this.town = generateTown();
    }
  },
  template: '<div id="characters">\
    <main class="container row">\
      <div class="col-xs-12">\
        <button @click="generateTown()">Generate Town</button>\
        <p>{{town}}</p>\
      </div>\
    </main>\
  </div>'
});
