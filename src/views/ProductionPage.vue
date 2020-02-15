<template>
  <Game msg="Boring Idle Game"/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Game from '@/components/Game.vue'; // @ is an alias to /src

@Component({
  components: {
    Game,
  },
})
export default class ProductionPage extends Vue {
}
</script>
