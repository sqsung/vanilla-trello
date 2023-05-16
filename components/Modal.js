// eslint-disable-next-line import/extensions
import Component from '../core/Component.js';

class Modal extends Component {
  closeModal(e) {
    if (!e.target.matches('.modal')) return;

    this.setState({ modalInfo: { open: false, listId: null, cardId: null } });
  }

  render() {
    this.addEvent('click', '.modal', this.closeModal.bind(this.props));

    const { modalInfo } = this.props.state;

    return `
      <div class="modal ${modalInfo.open ? '' : 'hidden'}">
        <div class="editor">
          <div>
            Check!
          </div>
        </div>
      </div>
    `;
  }
}

export default Modal;
