/* eslint-disable import/extensions */
import Component from './core/Component.js';
import Header from './components/Header.js';
import Board from './components/Board.js';
import Modal from './components/Modal.js';

class App extends Component {
  state = JSON.parse(localStorage.getItem('trello-state')) ?? {
    lists: [
      {
        id: 0,
        title: 'Things to do',
        cards: [
          { cardId: 0, cardTitle: 'Deep Dive', description: 'Finish summarizing remaining chapters', isEditing: false },
          {
            cardId: 1,
            cardTitle: 'Project Migration',
            description: '@Team Hoisiting - migrate Mychelin Guide project to TypeScript',
            isEditing: false,
          },
        ],
        isAdding: false,
      },
      {
        id: 1,
        title: 'Personal',
        cards: [
          { cardId: 0, cardTitle: 'Daily workout', description: 'legs/shoulders', isEditing: false },
          { cardId: 1, cardTitle: 'Coffee with Paul', description: '', isEditing: false },
        ],
        isAdding: false,
      },
      {
        id: 2,
        title: 'Complete Tasks',
        cards: [
          { cardId: 0, cardTitle: 'Trello', description: 'Finished on 23/06/09 F', isEditing: false },
          { cardId: 1, cardTitle: 'Clean the house', description: '', isEditing: false },
          { cardId: 2, cardTitle: 'weekly TypeScript study', description: '', isEditing: false },
        ],
        isAdding: false,
      },
    ],
    isAddingList: false,
    modalInfo: { open: false, listId: null, cardId: null, isTyping: false },
  };

  // prettier-ignore
  render() {
    return `
      ${new Header().render()}
      ${new Board(this).render()}
      ${new Modal(this).render()}
    `
  }
}

export default App;
