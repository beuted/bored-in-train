<template>
    <div class="solid-goods">
        <h2>Solid goods</h2>
        <ul>
            <li>
                <span>Population: {{ population.quantity }}</span>
                <span v-if="debugMode">{{ population }}</span>
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

    get debugMode() {
        return this.$store.state.debugMode;
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
