<template>
  <div class="popup-container" v-if="isShown">
    <div class="popup">
      <div class="popup-message">{{message}}</div>
      <div class="popup-btns-container">
        <div class="popup-help-input" v-if="isHelp"><input class="chx" type="checkbox" id="toggleShowHelp" v-bind:checked="showHelp" v-on:click="toggleShowHelp()">
          <label class="chx-label" for="toggleShowHelp">Show help messages</label>
        </div>
        <button class="popup-dismiss-btn btn" v-on:click="dismiss()">Dismiss</button>
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
.popup-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  text-align: left;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 800;
}

.popup {
  display: flex;
  flex-direction: column;
  position: relative;
  margin: auto;
  padding: 20px;
  width: 500px;
  border-radius: 2px;
  color: #fff;
  text-shadow: 0px 1px 1px #000;
  background-color: rgba(30, 30, 30, 0.5);
  box-shadow: 0px 0px 3px 0px rgba(255,255,255,0.1)
}

.popup-message {
  flex-grow: 1
}

.popup-btns-container {
  //TODO: bouger ca plus en bas la j'ai pas internet
  position: relative;
  bottom: 0;
  margin-top: 40px;
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
