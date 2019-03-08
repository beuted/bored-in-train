<template>
    <div class="solid-goods">
        <h2>Solid goods</h2>
        <ul>
            <li>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IdleGameVue } from '@/store';

@Component({
  components: {
  },
})
export default class SolidGoods extends IdleGameVue {
    get debugMode() {
        return this.$store.state.debugMode;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
