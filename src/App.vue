
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
// CSS reset BEGIN
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
// CSS reset END

html, body {
  background-color: #fefffe;
}

.btn {
  cursor: pointer;
}

.chx {
  cursor: pointer;
}

.chx-label {
  cursor: pointer;
}

.title {
  font-weight: bold;
  font-size: 20px;
}

b {
  font-weight: bold;
}

u {
  font-style: underline;
}

i {
  font-style: italic;
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
