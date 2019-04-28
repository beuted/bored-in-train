<template>
  <div class="home">
    <Research />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Research from '@/components/Research.vue'; // @ is an alias to /src

@Component({
  components: {
    Research,
  },
})
export default class ResearchPage extends Vue {
}
</script>
