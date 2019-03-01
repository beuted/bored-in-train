<template>
    <div class="storage">
        <h2>Storage</h2>
        <ul>
            <li>
                <span>Villages: {{ villages.quantity }}</span>
                <span v-if="debugMode">{{ villages }}</span>
            </li>
            <li>
                <span>Barns: {{ barns.quantity }}</span>
                <span v-if="debugMode">{{ barns }}</span>
            </li>
            <li>
                <span>Farms: {{ farms.quantity }}</span>
                <span v-if="debugMode">{{ farms }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IState } from '@/store';

@Component({
  components: {
  },
})
export default class Storage extends Vue {
    get barns() {
        return (this.$store.state as IState).storage.barns;
    }

    get villages() {
        return (this.$store.state as IState).storage.villages;
    }

    get farms() {
        return (this.$store.state as IState).storage.farms;
    }

    get debugMode() {
        return (this.$store.state as IState).debugMode;
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
