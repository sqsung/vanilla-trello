/* eslint-disable import/extensions */
import Component from '../core/Component.js';
import Card from './Card.js';
import AddListButton from './AddListButton.js';

class List extends Component {
  displayAddCardForm(e) {
    if (!e.target.matches('.add-card-btn, .bi-plus-square')) return;

    const { id: targetId } = e.target.closest('.list-wrapper').dataset;
    const newLists = this.state.lists.map(list => (list.id === +targetId ? { ...list, isAdding: true } : list));

    this.setState({ lists: newLists });
  }

  closeAddCardForm(e) {
    if (!e.target.closest('.button-holder>button[type="button"]')) return;

    const { id: targetId } = e.target.closest('.list-wrapper').dataset;
    const newLists = this.state.lists.map(list => (list.id === +targetId ? { ...list, isAdding: false } : list));

    this.setState({ lists: newLists });
  }

  createNewCard(e) {
    e.preventDefault();

    if (!e.target.matches('.add-card')) return;

    const newCardTitle = e.target.firstElementChild.value.trim();
    if (!newCardTitle) return;

    e.target.firstElementChild.value = '';

    const { id: targetId } = e.target.closest('.list-wrapper').dataset;

    const updatedLists = this.state.lists.map(list =>
      list.id === +targetId
        ? {
            ...list,
            cards: [
              ...list.cards,
              {
                cardId: Math.max(...list.cards.map(({ cardId }) => cardId)) + 1 || 0,
                cardTitle: newCardTitle,
                description: '',
              },
            ],
          }
        : list
    );

    this.setState({ lists: updatedLists });
  }

  removeList(e) {
    if (!e.target.matches('.delete-list-btn')) return;

    const deleteId = e.target.closest('.list-wrapper').dataset.id;
    const updatedLists = this.state.lists.filter(list => list.id !== +deleteId);
    const title = e.target.closest('.list-header').firstElementChild.textContent;

    if (!window.confirm(`Do you really want to delete '${title}' list?`)) return;

    this.setState({ lists: updatedLists });
  }

  render() {
    const { lists } = this.props.state;

    this.addEvent('click', '.add-card-btn', this.displayAddCardForm.bind(this.props));
    this.addEvent('click', '.add-card>button[type="button"]', this.closeAddCardForm.bind(this.props));
    this.addEvent('submit', '.add-card', this.createNewCard.bind(this.props));
    this.addEvent('click', '.delete-list-btn', this.removeList.bind(this.props));

    // prettier-ignore
    return `
      ${lists.map(({ id, title, cards, isAdding }) => `
        <div class="list-wrapper" data-id="${id}">
          <div class="list-content" draggable="true">
            <div class="list-header"> 
              <h2>${title}</h2>
              <i class="bi bi-x delete-list-btn"></i>
            </div>
            <ul class="list">
              ${cards.map(card => new Card(this.props).render(card, id)).join('')}
            </ul>
            <div class="add-card-btn-holder ${isAdding ? 'hidden' : ''}">
              <button class="add-card-btn">
                <i class="bi bi-plus-square"></i>
                Add a card
              </button>
            </div>
            <form class="add-form add-card ${isAdding ? '' : 'hidden'}">
              <input placeholder="Enter a new title."></input>
              <div class="button-holder">
                <button type="submit">Add card</button>
                <button type="button">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </form>
          </div>
        </div>`).join('')}
        ${new AddListButton(this.props).render()}`
  }
}

export default List;
