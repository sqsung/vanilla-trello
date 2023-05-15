/* eslint-disable import/extensions */
import Component from './core/Component.js';
import Header from './components/Header.js';
import Board from './components/Board.js';

class App extends Component {
  state = {
    lists: [
      {
        id: 0,
        title: 'Things to do',
        cards: [
          { cardId: 0, cardTitle: 'JavaScript', description: 'This is JavaScript' },
          { cardId: 1, cardTitle: 'Trello', description: 'This is Trello!' },
        ],
        isAdding: false,
      },
      {
        id: 1,
        title: 'TRELLO 조지기',
        cards: [
          { cardId: 0, cardTitle: 'Practice Trello', description: '' },
          { cardId: 1, cardTitle: '로고 쓸까말까', description: '' },
        ],
        isAdding: false,
      },
      {
        id: 2,
        title: '집가서 할거',
        cards: [
          { cardId: 0, cardTitle: 'Practice React', description: '' },
          { cardId: 1, cardTitle: 'Svelte', description: '스벨트는 언제배운담...' },
          { cardId: 2, cardTitle: 'CSS', description: '사실 CSS가 제일 어려움' },
        ],
        isAdding: false,
      },
    ],
    isAddingList: false,
  };

  // prettier-ignore
  render() {
    return `
      ${new Header().render()}
      ${new Board(this).render()}
    `
  }
}

export default App;
