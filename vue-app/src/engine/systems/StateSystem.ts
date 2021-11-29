import { reactive, toRaw, } from 'vue';
import { SystemBase } from '../';

export default class StateSystem extends SystemBase {

  register_state(system: SystemBase) {
    system.state = reactive(system.state);
  }

  unregister_state(system: SystemBase) {
    system.state = toRaw(system.state);
  }
}