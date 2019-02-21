<template>
    <div class="storage">
        <h2>Storage</h2>
        <ul>
            <li>
                <span>Houses: {{ houses.quantity }}</span>
                <span v-if="debugMode">{{ houses }}</span>
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
export default class Storage extends Vue {

    get houses() {
        return this.$store.state.houses;
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
