/* eslint-disable import/extensions */
import Component from '../core/Component.js';
import Card from './Card.js';

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

  onDragStart(e) {
    if (!e.target.closest('.list-content') || e.target.matches('.placeholder')) return;

    const ghost = e.target.closest('.card')
      ? e.target.closest('.card').cloneNode(true)
      : e.target.closest('.list-content').cloneNode(true);

    ghost.classList.add('ghost');
    ghost.style.left = e.clientX + 'px';
    ghost.style.top = e.clientY + 'px';

    if (e.target.closest('.card')) {
      ghost.style.width = e.target.closest('.card').offsetWidth + 'px';
      ghost.style.height = e.target.closest('.card').offsetHeight + 'px';
    }

    document.body.appendChild(ghost);

    const emptyImage = new Image();
    e.dataTransfer.setDragImage(emptyImage, 0, 0);

    if (e.target.closest('.card')) {
      // prettier-ignore
      const [dragListId, dragCardId] = e.target.closest('.card').dataset.id.split('-').map(val => +val);

      this.setState({
        dragCardInfo: { dragListId, dragCardId, dragOverCardId: dragCardId, dragOverListId: dragListId },
      });
    } else {
      const newDragId = +e.target.closest('.list-wrapper').dataset.id;

      this.setState({ dragListInfo: { dragId: newDragId, dragOverId: newDragId } });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onDrag(e) {
    e.preventDefault();

    document.querySelector('.ghost').style.left = e.clientX + 'px';
    document.querySelector('.ghost').style.top = e.clientY + 'px';
  }

  onDragEnter(e) {
    e.preventDefault();

    if (!e.target.closest('.list-wrapper') || e.target.closest('.list-wrapper')?.dataset.id === 'list-adder') return;

    if (this.state.dragCardInfo.dragCardId === null) {
      const dragoverId = +e.target.closest('.list-wrapper').dataset.id;
      const dragoverList = this.state.lists.find(({ id }) => id === dragoverId);
      const dragList = this.state.lists.find(({ id }) => id === this.state.dragListInfo.dragId);

      const newList = this.state.lists.map(list => {
        if (list.id === dragoverId) return { ...dragList, id: this.state.dragListInfo.dragId };
        if (list.id === this.state.dragListInfo.dragId) return { ...dragoverList, id: dragoverId };

        return list;
      });

      this.setState({
        lists: newList,
        dragListInfo: { dragId: this.state.dragListInfo.dragId, dragOverId: dragoverId },
      });
    } else if (this.state.dragCardInfo.dragCardId !== null && e.target.closest('.card')) {
      const { dragCardId, dragListId } = this.state.dragCardInfo;
      const dragList = this.state.lists.find(({ id }) => id === dragListId);
      const dragCard = dragList.cards.find(({ cardId }) => cardId === dragCardId);

      // prettier-ignore
      const [dragOverListId, dragOverCardId] = e.target.closest('.card') ? e.target.closest('.card').dataset.id.split('-').map(val => +val) : [+e.target.closest('.list-wrapper').dataset.id, 0] // 현재 drag 밑에 위치한 list id, card id
      const dragOverList = this.state.lists.find(({ id }) => id === dragOverListId);
      const dragOverCard = dragOverList.cards.find(({ cardId }) => cardId === dragOverCardId);

      if (dragOverListId === dragListId) {
        const newCards = !dragOverList.cards
          ? [dragCard]
          : dragOverList.cards.map(card => {
              if (card.cardId === dragOverCardId) return { ...dragCard, cardId: dragCardId };
              if (card.cardId === dragCardId) return { ...dragOverCard };

              return card;
            });

        this.setState({
          lists: this.state.lists.map(list => (list.id === dragOverListId ? { ...list, cards: newCards } : list)),
          dragCardInfo: { dragListId, dragCardId, dragOverListId, dragOverCardId },
        });
      } else {
        const newDragCards = dragList.cards.filter(({ cardId }) => cardId !== dragCardId);
        const newDragCardId = Math.max(...dragOverList.cards.map(({ cardId }) => cardId), 0) + 1;

        const newDragOverCards = dragOverList.cards.slice();
        newDragOverCards.splice(dragOverCardId, 0, { ...dragCard, cardId: newDragCardId });

        this.setState({
          lists: this.state.lists.map(list => {
            if (list.id === dragOverListId) return { ...list, cards: newDragOverCards };
            if (list.id === dragListId) return { ...list, cards: newDragCards };

            return list;
          }),
          dragCardInfo: { ...this.state.dragCardInfo, dragListId: dragOverListId, dragCardId: newDragCardId },
        });
      }
    } else if (
      this.state.dragCardInfo.dragCardId !== null &&
      !e.target.closest('.list-wrapper').querySelector('.list').firstElementChild
    ) {
      const emptyListId = +e.target.closest('.list-wrapper').dataset.id;

      const { dragCardId, dragListId } = this.state.dragCardInfo;
      const dragList = this.state.lists.find(({ id }) => id === dragListId);
      const dragCard = dragList.cards.find(({ cardId }) => cardId === dragCardId);

      const newList = this.state.lists.map(list => {
        if (list.id === emptyListId) return { ...list, cards: [dragCard] };
        if (list.id === dragListId) return { ...list, cards: list.cards.filter(({ cardId }) => cardId !== dragCardId) };

        return list;
      });

      this.setState({ lists: newList, dragCardInfo: { ...this.state.dragCardInfo, dragListId: emptyListId } });
    }
  }

  onDrop() {
    [...document.querySelectorAll('.ghost')].forEach(ghost => ghost.remove());

    this.setState({
      dragListInfo: { dragOverId: null, dragId: null },
      dragCardInfo: { dragListId: null, dragCardId: null },
    });
  }

  onDragEnd() {
    [...document.querySelectorAll('.ghost')].forEach(ghost => ghost.remove());

    this.setState({
      dragListInfo: { dragOverId: null, dragId: null },
      dragCardInfo: { dragListId: null, dragCardId: null },
    });
  }

  render() {
    this.addEvent('click', '.add-card-btn', this.displayAddCardForm.bind(this.props));
    this.addEvent('click', '.add-card>button[type="button"]', this.closeAddCardForm.bind(this.props));
    this.addEvent('submit', '.add-card', this.createNewCard.bind(this.props));
    this.addEvent('click', '.delete-list-btn', this.removeList.bind(this.props));
    this.addEvent('dragover', '.list-wrapper', this.cancelDragover.bind(this.props));
    this.addEvent('dragstart', '.list-content', this.onDragStart.bind(this.props));
    this.addEvent('drag', '.list-content', this.onDrag.bind(this.props));
    this.addEvent('dragenter', '.list-wrapper', this.onDragEnter.bind(this.props));
    this.addEvent('drop', '.list-content', this.onDrop.bind(this.props));
    this.addEvent('dragend', '.list-content', this.onDragEnd.bind(this.props));

    const { lists, dragListInfo } = this.props.state;
    const { dragId } = dragListInfo;

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
