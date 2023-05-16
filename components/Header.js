/* eslint-disable import/extensions */
import Component from '../core/Component.js';

class Header extends Component {
  /* eslint-disable class-methods-use-this */
  render() {
    return `
      <header>
        <h1>🌐 Vanilla Trello</h1>
        <p>Made with Vanilla JavaScript only, by <a href='https://github.com/sqsung' target='_blank' rel='noopener noreferrer'>@sqsung</a></p>
      </header>
    `;
  }
}

export default Header;
