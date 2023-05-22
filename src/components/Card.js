/* eslint-disable import/extensions */
import Component from '../core/Component.js';

class Card extends Component {
  openTitleEditor(e) {
    if (!e.target.matches('.card-icon-holder>.bi-pencil')) return;

    const [targetListId, targetCardId] = e.target.closest('.card').dataset.id.split('-');

    const updatedList = this.state.lists.map(list =>
      list.id !== +targetListId
        ? list
        : {
            ...list,
            cards: list.cards.map(card => (card.cardId !== +targetCardId ? card : { ...card, isEditing: true })),
          }
    );

    this.setState({ lists: updatedList });
  }

  editCardTitle(e) {
    if (!e.target.matches('.card-editor-form')) return;

    const newCardTitle = e.target.firstElementChild.value.trim();
    if (!newCardTitle) return;

    const [targetListId, targetCardId] = e.target.closest('.card').dataset.id.split('-');

    const updatedList = this.state.lists.map(list =>
      list.id !== +targetListId
        ? list
        : {
            ...list,
            cards: list.cards.map(card =>
              card.cardId !== +targetCardId ? card : { ...card, cardTitle: newCardTitle, isEditing: false }
            ),
          }
    );

    this.setState({ lists: updatedList });
  }

  deleteCard(e) {
    if (!e.target.matches('.delete-card-btn')) return;

    const [targetListId, targetCardId] = e.target.closest('.card').dataset.id.split('-');

    const updatedList = this.state.lists.map(list =>
      list.id !== +targetListId ? list : { ...list, cards: list.cards.filter(({ cardId }) => cardId !== +targetCardId) }
    );

    this.setState({ lists: updatedList });
  }

  openModal(e) {
    if (!e.target.closest('.card')) return;
    if (e.target.closest('.card-icon-holder') || e.target.closest('.card-editor-form')) return;

    const [targetListId, targetCardId] = e.target.closest('.card').dataset.id.split('-');

    this.setState({ modalInfo: { open: true, listId: targetListId, cardId: targetCardId, isTyping: false } });
  }

  render(card, listId) {
    this.addEvent('click', '.bi-pencil', this.openTitleEditor.bind(this.props));
    this.addEvent('submit', '.card-editor-form', this.editCardTitle.bind(this.props));
    this.addEvent('click', '.delete-card-btn', this.deleteCard.bind(this.props));
    this.addEvent('click', '.card', this.openModal.bind(this.props));

    const { cardId, cardTitle, description, isEditing } = card;

    return `
      <li data-id="${`${listId}-${cardId}`}" class="card" draggable="true">
        <div>
          <span class="card-title ${isEditing ? 'hidden' : ''}">${cardTitle}</span>
          <div class="card-icon-holder ${isEditing ? 'hidden' : ''}">
            <i class="bi bi-pencil"></i>
            <i class="bi bi-x delete-card-btn ${isEditing ? 'hidden' : ''}"></i>
          </div>
        </div>
        <form class="card-editor-form">
          <input value="${cardTitle}" class="${!isEditing ? 'hidden' : ''}" />
          <button type="submit" class="${!isEditing ? 'hidden' : ''}">Done</button>
        </form>
        ${description ? '<i class="bi bi-list-nested"></i>' : ''}
      </li>
    `;
  }
}

export default Card;
