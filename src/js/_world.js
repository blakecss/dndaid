Vue.component('world', {
  data: function() {
    return {
      town: '',
      cz: ['testing 1', 'testing 2', 'testing 3']
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
        <button @click="generateTown()">Generate T</button>\
        <p>{{town}}</p>\
        <chips :chips="cz"></chips>\
      </div>\
    </main>\
  </div>'
});
