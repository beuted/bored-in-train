<template>
    <div class="inventory">
        <h2>Inventory</h2>
        <ul>
            <li>
                <span>Berries found: {{ berries.quantity }}</span>
                <span v-if="debugMode"> {{ berries }}</span>
            </li>
            <li>
                <span>Stick found: {{ sticks.quantity }}</span>
                <span v-if="debugMode"> {{ sticks }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Inventory extends Vue {
    get berries() {
        return this.$store.state.berries;
    }

    get sticks() {
        return this.$store.state.sticks;
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
  margin: 10px;
}
a {
  color: #42b983;
}
</style>
