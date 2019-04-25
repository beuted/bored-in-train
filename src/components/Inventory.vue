<template>
    <div class="inventory">
        <h2>Inventory</h2>
        <ul>
            <li>
                <span>Food 🍗 {{ food.quantity }} / {{ foodStorage }}</span>
                <span v-if="debugMode"> {{ food }}</span>
            </li>
            <li>
                <span>Wood 🌲 {{ sticks.quantity }}</span>
                <span v-if="debugMode"> {{ sticks }}</span>
            </li>
            <li>
                <span>Stone ⛏️ {{ stones.quantity }}</span>
                <span v-if="debugMode"> {{ stones }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';

@Component
export default class Inventory extends IdleGameVue {
    get food() {
        return this.$store.state.consummable.food;
    }

    get sticks() {
        return this.$store.state.consummable.sticks;
    }

    get stones() {
         return this.$store.state.consummable.stones;
    }

    get debugMode() {
        return this.$store.state.debugMode;
    }

    public get foodStorage() {
        return this.$store.getters.getRessourceStorage('food');
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
