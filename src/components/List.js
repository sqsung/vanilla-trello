/* eslint-disable import/extensions */
import Component from '../core/Component.js';
import Card from './Card.js';

class List extends Component {
  constructor(props) {
    super();

    this.props = props;
    this.$dragTarget = null;
    this.$ghostImage = null;
    this.fromListId = null;
    this.cardDropIndex = null;
    this.$dropZone = null;
  }

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

  /**
   * ※ only elements with @draggable attribute can be grabbed, meaning e.target will always be either card or list-content
   * 1. makes a new ghost image of e.target, adjust location, and append it onto document.body
   * 2. remove default ghost image with @dataTransfer
   * 3. make $dragTarget a 'placeholder' and update drag event related information
   */
  onDragStart(e) {
    // Step 1:
    const $ghost = e.target.cloneNode(true);
    $ghost.classList.add('ghost');

    if (e.target.matches('.card')) {
      $ghost.style.width = e.target.offsetWidth + 'px';
      $ghost.style.height = e.target.offsetHeight + 'px';
    }

    $ghost.style.left = e.clientX + 'px';
    $ghost.style.top = e.clientY + 'px';

    document.body.appendChild($ghost);

    // Step 2:
    const emptyImage = new Image();
    e.dataTransfer.setDragImage(emptyImage, 0, 0);

    // Step 3:
    e.target.classList.add('placeholder');
    this.$ghostImage = $ghost;
    this.$dragTarget = e.target;
    this.fromListId = +e.target.closest('.list-wrapper').dataset.id;
  }

  /**
   * to catch mouse movements in between the start and end of a drag event
   * updates $ghost element's left/top positions using event's @clientX and @clientY
   */
  onDrag(e) {
    this.$ghostImage.style.left = e.clientX + 'px';
    this.$ghostImage.style.top = e.clientY + 'px';
  }

  /**
   * must use @preventDefault to allow drop events to be made on normally non-droppable areas
   * the state should not be changed on dragover as doing so would result in high browser stress levels and malfunctions of setState
   */
  onDragOver(e) {
    const $dropTarget = e.target;
    const $dropZone = e.target.closest('.list-content');

    e.preventDefault();

    this.$dropZone = $dropZone ? e.target : null;

    if (!$dropZone) return;

    /**
     * condition 1: when a list element is being dragged
     * 1. if e is valid, manipulate DOM to reorder lists as they should appear according to user's drag movement
     * 2. go through the lists and change their data-ids to fit their new order
     */
    if (this.$dragTarget.matches('.list-content')) {
      if ($dropZone === this.$dragTarget || !$dropZone.draggable) return;

      const [fromId, toId] = [
        +this.$dragTarget.closest('.list-wrapper').dataset.id,
        +$dropTarget.closest('.list-wrapper').dataset.id,
      ];

      // Step 1:
      this.$dragTarget
        .closest('.list-wrapper')
        .parentNode.insertBefore(
          this.$dragTarget.closest('.list-wrapper'),
          fromId > toId ? $dropZone.closest('.list-wrapper') : $dropZone.closest('.list-wrapper').nextElementSibling
        );

      // Step 2:
      [...document.querySelectorAll('.list-wrapper')].forEach(($list, idx) => {
        $list.dataset.id = idx;
      });

      return;
    }

    /**
     * condition 2: when a card element is being dragged
     * 1. when card container being dragged over has no children (= is an empty ul list)
     * 2. early return when $dragTarget over itself OR $dropTarget is NOT a card element
     * 3. else calculate vertical center of $dropTarget and insertBefore accordingly
     */
    if (this.$dragTarget.matches('.card')) {
      const $toCardContainer = $dropZone.querySelector('.list');

      // Step 1:
      if (!$toCardContainer.children || $dropTarget === $dropZone) {
        $toCardContainer.appendChild(this.$dragTarget);
        return;
      }

      // Step 2:
      if ($dropTarget === this.$dragTarget || !$dropTarget.matches('.card')) return;

      // Step 3:
      const { bottom, top } = $dropTarget.getBoundingClientRect();
      const center = (bottom - top) / 2;

      $toCardContainer.insertBefore(this.$dragTarget, e.offsetY < center ? $dropTarget : $dropTarget.nextSibling);
      this.cardDropIndex = [...$dropZone.querySelector('.list').children].indexOf(this.$dragTarget);
    }
  }

  /**
   * when draggged element is dropped, update state
   * re-initialize class properties related to drag event
   * when card element is being dragged, must consider when the card is moved within the same list and else
   */
  onDrop() {
    this.$ghostImage.remove();
    this.$dragTarget.classList.remove('placeholder');

    if (!this.$dropZone) return;

    // condition 1. when dragTarget is a list element
    if (this.$dragTarget.matches('.list-content')) {
      const [fromId, toId] = [this.fromListId, +this.$dropZone.closest('.list-wrapper').dataset.id];
      const { lists } = this.state;

      const temp = lists[fromId];
      const _lists = lists.filter(({ id }) => id !== fromId);
      _lists.splice(toId, 0, temp);

      const newLists = _lists.map((list, idx) => ({ ...list, id: idx }));

      this.setState({ lists: newLists });
    }

    // condition 2. when dragTarget is a card element
    if (this.$dragTarget.matches('.card')) {
      const [fromListId, fromCardId] = this.$dragTarget.dataset.id.split('-').map(val => +val);
      const toListId = +this.$dropZone.closest('.list-wrapper').dataset.id;
      const { lists } = this.state;

      const fromList = lists.find(({ id }) => +id === fromListId);
      const targetCard = fromList.cards.find(({ cardId }) => +cardId === fromCardId);
      const filteredFromListCards = fromList.cards.filter(({ cardId }) => +cardId !== fromCardId);

      const addedToListCards = lists.find(({ id }) => +id === toListId).cards;
      addedToListCards.splice(this.cardDropIndex || 0, 0, targetCard);

      const swappedCards = filteredFromListCards.slice();
      swappedCards.splice(this.cardDropIndex || 0, 0, targetCard);

      const _filteredFromListCards = filteredFromListCards.map((card, idx) => ({ ...card, cardId: idx }));
      const _addedToListCards = addedToListCards.map((card, idx) => ({ ...card, cardId: idx }));
      const newLists = lists.map(list => {
        if (+list.id === fromListId && fromListId === toListId) return { ...list, cards: swappedCards };
        if (+list.id === fromListId) return { ...list, cards: _filteredFromListCards };
        if (+list.id === toListId) return { ...list, cards: _addedToListCards };

        return list;
      });

      this.setState({ lists: newLists });
    }

    this.$dragTarget = null;
    this.$ghostImage = null;
    this.fromListId = null;
    this.cardDropIndex = null;
    this.$dropZone = null;
  }

  render() {
    this.addEvent('click', '.add-card-btn', this.displayAddCardForm.bind(this.props));
    this.addEvent('click', '.add-card>button[type="button"]', this.closeAddCardForm.bind(this.props));
    this.addEvent('submit', '.add-card', this.createNewCard.bind(this.props));
    this.addEvent('click', '.delete-list-btn', this.removeList.bind(this.props));
    this.addEvent('dragstart', '.list-wrapper', this.onDragStart.bind(this.props));
    this.addEvent('drag', '.list-wrapper', this.onDrag.bind(this.props));
    this.addEvent('dragover', '.list-wrapper', this.onDragOver.bind(this.props));
    this.addEvent('dragend', '.list-wrapper', this.onDrop.bind(this.props));

    const { lists } = this.props.state;

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
