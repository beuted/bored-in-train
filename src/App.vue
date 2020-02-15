
<template>
  <div id="app">
    <div class="nav">
      <router-link to="/">Production</router-link> |
      <router-link to="/research">Research</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div class="router-view">
      <router-view />
    </div>
    <Popup />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Popup from '@/components/Popup.vue';
import { IState, IdleGameVue } from '@/store';

@Component({
  components: {
    Popup
  },
})
export default class App extends IdleGameVue {
}
</script>

<style lang="less">
html, body {
  background-color: #fefffe;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.nav {
  max-width: 320px;
  margin: auto;
  padding-top: 15px;
  padding-bottom: 10px;
  border-bottom: solid #ced9e4 1px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.router-view {
  margin-top: 10px;
}
</style>
