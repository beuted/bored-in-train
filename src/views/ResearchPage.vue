<template>
  <ResearchComponent />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ResearchComponent from '@/components/ResearchComponent.vue'; // @ is an alias to /src

@Component({
  components: {
    ResearchComponent,
  },
})
export default class ResearchPage extends Vue {
}
</script>
