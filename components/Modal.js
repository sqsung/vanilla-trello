// eslint-disable-next-line import/extensions
import Component from '../core/Component.js';

class Modal extends Component {
  closeModal(e) {
    if (!e.target.matches('.modal')) return;

    this.setState({ modalInfo: { open: false, listId: null, cardId: null } });
  }

  render() {
    this.addEvent('click', '.modal', this.closeModal.bind(this.props));

    const { state } = this.props;
    const { open, listId, cardId } = state.modalInfo;

    const list = state.lists.filter(list => list.id === +listId)[0];
    const card = list?.cards.filter(card => card.cardId === +cardId)[0];

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
        </div>
      </div>
    `;
  }
}

export default Modal;
