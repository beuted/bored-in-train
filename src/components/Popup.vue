<template>
  <div class="popup-container" v-if="isShown">
    <div class="popup">
      <div>{{message}}</div>
      <div class="popup-btns-container">
        <div class="popup-help-input" v-if="isHelp"><input type="checkbox" v-bind:checked="showHelp" v-on:click="toggleShowHelp()">Show help messages</div>
        <button class="popup-dismiss-btn" v-on:click="dismiss()">Dismiss</button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IState, IdleGameVue } from '@/store';
import { StaticConsummableInfo, StaticJobInfo, GlobalConfig } from '@/services/GameEngine';
import { EventBus, IPopupMessageEvent } from '@/EventBus';


@Component({
})
export default class Popup extends IdleGameVue {
    private isShown = false;
    private isHelp = false;
    private message = '';

    private mounted() {
      EventBus.$on('show-popup', (event: IPopupMessageEvent) => {
        this.message = event.message;
        this.isHelp = event.isHelp;
        this.isShown = true;
      });
    }

    public get showHelp() {
      return this.$store.state.showHelp;
    }

    public toggleShowHelp() {
      this.$store.commit('ToggleShowHelp');
    }

    public dismiss() {
      this.isShown = false;
      this.$store.commit('SetPlay', true);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.invisible {
  display: none;
}

.popup-container {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  top: 0;
  left: 0;
  text-align: left;
}

.popup {
  // TODO: center verticalement là j'ai pas internet
  position: relative;
  margin: auto;
  padding: 20px;
  width: 600px;
  min-height: 200px;
  background-color: white;
  top: 200px;
}

.popup-btns-container {
  //TODO: bouger ca plus en bas la j'ai pas internet
  position: relative;
  height: 50px;
  bottom: 0;
  margin-top: 20px;
}
.popup-help-input {
  display: inline-block;
  width: 200px;
}
.popup-dismiss-btn {
  display: inline-block;
  position: absolute;
  right: 0;
}

</style>
