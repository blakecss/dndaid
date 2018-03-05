Vue.component('character-preview', {
  props: ['char', 'index'],
  template: '<div>\
    <div class="info">\
      <div class="class-icon">\
        <svg v-if="char.type == \'player\'"><use :xlink:href="\'sprites.svg#\' + char.klass.toLowerCase()"></use></svg>\
        <svg v-if="char.type == \'creature\'"><use xlink:href="sprites.svg#creature"></use></svg>\
      </div>\
      <p class="name">{{char.name}}</p>\
      <svg class="reorder"><use xlink:href="sprites.svg#reorder"></use></svg>\
    </div>\
    <div class="stats">\
      <div>\
        <svg><use xlink:href="sprites.svg#health"></use></svg>\
        <input v-model.number="char.currentHP" type="number" />\
      </div>\
      <div>\
        <svg><use xlink:href="sprites.svg#armor"></use></svg>\
        <input v-model.number="char.armorClass" type="number" readonly />\
      </div>\
      <div>\
        <svg><use xlink:href="sprites.svg#initiative"></use></svg><input v-model.number="char.initiative" type="number" />\
      </div>\
    </div>\
    <div class="tools">\
      <button class="flat-btn" @click="leftBtn(index)">\
        <svg><use xlink:href="sprites.svg#arrow-left"></use></svg>\
      </button>\
      <button class="flat-btn" @click="rightBtn(index)">\
        <svg><use xlink:href="sprites.svg#arrow-right"></use></svg>\
      </button>\
      <button class="flat-btn" @click="duplicateBtn(index)">\
        <svg><use xlink:href="sprites.svg#duplicate"></use></svg>\
      </button>\
      <button class="flat-btn" @click="deleteBtn(index)">\
        <svg><use xlink:href="sprites.svg#trash"></use></svg>\
      </button>\
    </div>\
  </div>'
});
