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
    if (e.target.matches('.description-form>textarea.active')) return;

    if (e.target.closest('.modal')) this.setState({ modalInfo: { ...this.state.modalInfo, isTyping: false } });
  }

  render() {
    this.addEvent('click', '.modal', this.closeModal.bind(this.props));
    this.addEvent('click', '.description-form>textarea.not-active', this.ableTextarea.bind(this.props));
    this.addEvent('click', '.description-form>textarea.active', this.disabledTextarea.bind(this.props));

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
              <span>${open ?? card.cardTitle}</span>
            </div>
            <i class="bi bi-x"></i>
          </div>
          <div class="description-wrapper">
            <div class="description-header">
              <i class="bi bi-list-nested"></i>
              <span>Description</span>
            </div>
            <form class="description-form">
              <textarea class="${isTyping ? 'active' : 'not-active'}">${card.description ? card.description.trim() : 'Enter a more detailed description.'.trim()}</textarea>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

export default Modal;
