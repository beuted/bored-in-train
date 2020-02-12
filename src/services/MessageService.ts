import { EventBus, IPopupMessageEvent } from '@/EventBus';
import store from '@/store'

export class MessageService {
  private static alreadySentHelp: {[id: string]: boolean} = {};

  public static Help(message: string, uniqueId: string) {
    if (!store.state.showHelp)
      return;
    if (MessageService.alreadySentHelp[uniqueId])
      return;

    MessageService.alreadySentHelp[uniqueId] = true;
    store.commit('SetPlay', false);

    var evt: IPopupMessageEvent = { message: message, isHelp: true }
    EventBus.$emit('show-popup', evt);
  }

  public static Send(message: string) {
    var evt: IPopupMessageEvent = { message: message, isHelp: false }
    EventBus.$emit('show-popup', evt);
  }
}