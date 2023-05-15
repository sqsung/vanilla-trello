import Component from '../core/Component.js';

class Card extends Component {
  render() {
    const { cardId, cardTitle, description } = this.props;

    return `
      <li data-id="${cardId}" class="card" draggable="true">
        <div>
          <span class="card-title">${cardTitle}</span>
          <i class="bi bi-pencil"></i>
        </div>
        ${description ? '<i class="bi bi-list-nested"></i>' : ''}
      </li>
    `;
  }
}

export default Card;
