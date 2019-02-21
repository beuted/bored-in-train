<template>
    <div class="solid-goods">
        <h2>Solid goods</h2>
        <ul>
            <li>
                <span>Population:</span>
                <span id="population">{{ population }}</span>
                <span id="population-particles" class="particletext bubbles "></span>                
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class SolidGoods extends Vue {

    get population() {
        return this.$store.state.population;
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
