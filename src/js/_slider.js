Vue.component('slider', {
  props: ['model', 'max'],
  data: function() {
    console.log('here');
    return {
      vm: this.model
    }
  },
  // watch: function() {
    // vm: function(newVal) {
    //   console.log(this.model);
    //   this.model = newVal;
    // }
  // },
  template: '<div class="slider">\
    <input v-model="vm" type="range" min="0" :max="max" step="1" />\
    <div class="row">\
      <input v-model="vm" type="number" />/<input v-model="max" type="number" />\
    </div>\
  </div>'
});
