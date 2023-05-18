// eslint-disable-next-line import/extensions
import Component from '../core/Component.js';

class Modal extends Component {
  closeModal(e) {
    if (!e.target.matches('.modal')) return;

    this.setState({ modalInfo: { open: false, listId: null, cardId: null, isTyping: false } });
  }

  ableTextarea(e) {
    if (!e.target.matches('.description-form>textarea.not-active')) return;

    this.setState({ modalInfo: { ...this.state.modalInfo, isTyping: true } });
  }

  disabledTextarea(e) {
    if (e.target.closest('.description-form')) return;

    if (e.target.closest('.modal')) this.setState({ modalInfo: { ...this.state.modalInfo, isTyping: false } });
  }

  submitDescription(e) {
    if (!e.target.matches('.description-form')) return;

    const newDescription = e.target.firstElementChild.value.trim();
    if (!newDescription) return;

    const { listId, cardId } = this.state.modalInfo;

    const updatedList = this.state.lists.map(list =>
      list.id !== +listId
        ? list
        : {
            ...list,
            cards: list.cards.map(card => (card.cardId !== +cardId ? card : { ...card, description: newDescription })),
          }
    );

    this.setState({ lists: updatedList, modalInfo: { ...this.state.modalInfo, isTyping: false } });
  }

  render() {
    this.addEvent('click', '.modal', this.closeModal.bind(this.props));
    this.addEvent('click', '.description-form>textarea.not-active', this.ableTextarea.bind(this.props));
    this.addEvent('click', '.description-form>textarea.active', this.disabledTextarea.bind(this.props));
    this.addEvent('submit', '.description-form', this.submitDescription.bind(this.props));

    const { state } = this.props;
    const { open, listId, cardId, isTyping } = state.modalInfo;

    const list = state.lists.filter(list => list.id === +listId)[0];
    const card = list?.cards.filter(card => card.cardId === +cardId)[0];

    // prettier-ignore
    return `
      <div class="modal ${open ? '' : 'hidden'}">
        <div class="editor">
          <div class="editor-header">
            <div class="title-holder">
              <i class="bi bi-list-task"></i>
              <span>${card?.cardTitle ? card.cardTitle : ''}</span>
            </div>
            <i class="bi bi-x"></i>
          </div>
          <div class="description-wrapper">
            <div class="description-header">
              <i class="bi bi-list-nested"></i>
              <span>Description</span>
            </div>
            <form class="description-form">
              <textarea placeholder="${card?.description ? card.description : "Enter a detailed description!"}" class="${isTyping ? 'active' : 'not-active'}">${card?.description ? card.description : ''}</textarea>
              <button type="submit" class="${isTyping ? 'visible' : 'hidden'}">Save</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

export default Modal;
