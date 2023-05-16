/* eslint-disable import/extensions */
import Component from '../core/Component.js';

class Card extends Component {
  openTitleEditor(e) {
    if (!e.target.matches('.bi-pencil')) return;

    const targetId = e.target.closest('.card').dataset.id;

    console.log(targetId);
  }

  render(card) {
    this.addEvent('click', '.bi-pencil', this.openTitleEditor.bind(this.props));

    const { cardId, cardTitle, description, isEditing } = card;

    return `
      <li data-id="${cardId}" class="card" draggable="true">
        <div class="${isEditing ? 'hidden' : ''}">
          <span class="card-title">${cardTitle}</span>
          <i class="bi bi-pencil"></i>
        </div>
        <form class="${isEditing ? 'hidden' : ''}">
          <input value="${cardTitle}" />
          <button type="submit">Done</button>
        </form>
        ${description ? '<i class="bi bi-list-nested"></i>' : ''}
      </li>
    `;
  }
}

/* 
<form class="add-form add-card ${isAdding ? '' : 'hidden'}">
  <input placeholder="Enter a new title."></input>
  <div class="button-holder">
    <button type="submit">Add card</button>
    <button type="button"><i class="bi bi-x"></i></button>
  </div>
</form> 
*/

export default Card;
