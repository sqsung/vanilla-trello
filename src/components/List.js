/* eslint-disable import/extensions */
import Component from '../core/Component.js';
import Card from './Card.js';

const ghostPosition = { x: 0, y: 0 };

// const swapList = e => {};

// const onMove = e => {
//   e.preventDefault();

//   console.log(e.target);
//   console.log(document.elementFromPoint(e.clientX, e.clientY).closest('.list-wrapper').dataset.id);
// };

class List extends Component {
  displayAddCardForm(e) {
    if (!e.target.closest('.add-card-btn-holder')) return;

    const { id: targetId } = e.target.closest('.list-wrapper').dataset;
    const newLists = this.state.lists.map(list =>
      list.id === +targetId ? { ...list, isAdding: true } : { ...list, isAdding: false }
    );

    this.setState({ lists: newLists, isAddingList: false });

    e.target.closest('.add-card-btn-holder').parentElement.querySelector('.add-form').firstElementChild.focus();
  }

  closeAddCardForm(e) {
    if (!e.target.closest('.close-card-form-btn') && !e.target.matches('.list-wrapper')) return;

    const newLists = this.state.lists.map(list => ({ ...list, isAdding: false }));

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
                cardId: list.cards.length ? Math.max(...list.cards.map(({ cardId }) => cardId)) + 1 : 0,
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

  // eslint-disable-next-line class-methods-use-this
  cancelDragover(e) {
    e.preventDefault();
  }

  onDrag(e) {
    if (!e.target.closest('.list-content') || e.target.matches('.placeholder')) return;

    const ghost = e.target.closest('.list-content').cloneNode(true);
    ghost.classList.add('ghost');

    ghost.style.left = e.clientX + 'px';
    ghost.style.top = e.clientY + 'px';

    document.body.appendChild(ghost);

    const emptyImage = new Image();
    e.dataTransfer.setDragImage(emptyImage, 0, 0);

    const newDragId = +e.target.closest('.list-wrapper').dataset.id;

    this.setState({ dragInfo: { dragId: newDragId, dragOverId: newDragId } });
  }

  onDragEnter(e) {
    e.preventDefault();

    if (!e.target.closest('.list-wrapper') || e.target.closest('.list-wrapper')?.dataset.id === 'list-adder') return;

    const dragoverId = +e.target.closest('.list-wrapper').dataset.id;
    const dragList = this.state.lists.find(({ id }) => id === this.state.dragInfo.dragId);
    const dragOverList = this.state.lists.find(({ id }) => id === dragoverId);

    const newList = this.state.lists.map(list => {
      if (list.id === dragoverId) return { ...dragList, id: this.state.dragInfo.dragId };
      if (list.id === this.state.dragInfo.dragId) return { ...dragOverList, id: dragoverId };

      return list;
    });

    this.setState({ lists: newList, dragInfo: { dragId: this.state.dragInfo.dragId, dragOverId: dragoverId } });
  }

  onDrop(e) {
    if (!e.target.closest('.list-wrapper')) return;

    this.setState({ dragInfo: { dragOverId: null, dragId: null } });
  }

  render() {
    this.addEvent('click', '.add-card-btn', this.displayAddCardForm.bind(this.props));
    this.addEvent('click', '.add-card>button[type="button"]', this.closeAddCardForm.bind(this.props));
    this.addEvent('submit', '.add-card', this.createNewCard.bind(this.props));
    this.addEvent('click', '.delete-list-btn', this.removeList.bind(this.props));
    this.addEvent('dragstart', '.list-content', this.onDrag.bind(this.props));
    this.addEvent('dragenter', '.list-wrapper', this.onDragEnter.bind(this.props));
    this.addEvent('drop', '.list-content', this.onDrop.bind(this.props));
    this.addEvent('dragover', '.list-wrapper', this.cancelDragover.bind(this.props));

    const { lists, dragInfo } = this.props.state;
    const { dragId } = dragInfo;

    // prettier-ignore
    return `
      ${lists.map(({ id, title, cards, isAdding }) => `
        <div class="list-wrapper" data-id="${id}">
          <div class="list-content ${dragId === +id ? 'placeholder' : ''}" draggable="true">
            <div class="list-header"> 
              <h2>${title}</h2>
              <i class="bi bi-x delete-list-btn"></i>
            </div>
            <ul class="list">
              ${cards?.map(card => new Card(this.props).render(card, id)).join('')}
            </ul> 
            <div class="add-card-btn-holder ${isAdding ? 'hidden' : ''}">
              <button class="add-card-btn">
                <i class="bi bi-plus-square"></i>
                Add a card
              </button>
            </div>
            <form class="add-form add-card ${isAdding ? 'active' : 'hidden'}">
              <input placeholder="Enter a new title."></input>
              <div class="button-holder">
                <button type="submit">Add card</button>
                <button type="button" class="close-card-form-btn">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </form>
          </div>
        </div>`).join('')}
      `
  }
}

export default List;
