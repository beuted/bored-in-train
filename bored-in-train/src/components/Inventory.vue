<template>
    <div class="inventory">
        <h2>Inventory</h2>
        <ul>
            <li>
                <span>Berries found: </span>
                <span> {{ berries }}</span>
                <span id="berries-particles" class="particletext bubbles    "></span>
            </li>
            <li>
                <span>Stick found: {{ sticks }}</span>
                <span id="sticks-particles" class="particletext bubbles "></span>            
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
