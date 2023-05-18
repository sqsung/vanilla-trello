/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */
import render from '../utils/render.js';
import eventStorage from '../utils/eventStorage.js';

class Component {
  constructor(props) {
    this.props = props;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };

    render();
  }

  /** @abstract */
  render() {
    throw new Error("Component의 서브 클래스는 'render' 메서드를 구현해야 합니다.");
  }

  /**
   *
   * @param {string} eType: on which event the callback will be called upon
   * @param {string} el: the CSS selector of the element that triggers the event
   * @param {function} callback: the callback function that will be invoked when the event occurs
   * @returns {void} if no duplicate event exists, new event listener is attached to root
   */
  addEvent(eType, el, callback) {
    if (eventStorage.some(({ eventType, selector }) => eventType === eType && selector === el)) return;

    const event = { eventType: eType, selector: el, handler: callback };

    eventStorage.push(event);
  }
}

export default Component;
