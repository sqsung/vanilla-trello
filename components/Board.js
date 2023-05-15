/* eslint-disable import/extensions */
import Component from '../core/Component.js';
import List from './List.js';

class Board extends Component {
  render() {
    return `
      <div class="board">
        ${new List(this.props).render()}
      </div>
    `;
  }
}

export default Board;
