
<template>
  <div id="app">
    <Controls class="controls"/>
    <!--<div class="nav">
      <router-link to="/">Production</router-link>
      <router-link to="/research">Research</router-link>
      <router-link to="/about">About</router-link>
    </div>-->
    <div class="router-view">
      <router-view />
    </div>
    <Popup />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Popup from '@/components/Popup.vue';
import Controls from '@/components/Controls.vue';
import { IState, IdleGameVue } from '@/store';

@Component({
  components: {
    Popup,
    Controls
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

html, body {
  height: 100%;
  background-color: #d6dbd8
}

#app {
  display: flex;
  flex-direction: column;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.controls {
  padding: 15px;
}

.nav {
  width: 100%;
  flex: 0 0 22px;
  margin: auto;
  padding-top: 6px;
  //border-bottom: solid #ced9e4 1px;
  a {
    border: solid #2c3e50 1px;
    padding: 5px 10px;
    margin: 0 10px 0 10px;
    text-decoration: none;
    color: #2c3e50;
    &.router-link-exact-active {
      border: solid #3a96dd 1px;
      color: #3a96dd;
    }
  }
}

.router-view {
  flex-grow: 1;
}

// Animations

@keyframes rubberBand {
  0% {transform: scale(1);}
  30% {transform: scaleX(1.25) scaleY(0.75);}
  40% {transform: scaleX(0.75) scaleY(1.25);}
  60% {transform: scaleX(1.15) scaleY(0.85);}
  100% {transform: scale(1);}
}
</style>
