// eslint-disable-next-line import/extensions
import Component from '../core/Component.js';

class Modal extends Component {
  render() {
    const { modalInfo } = this.props.state;

    console.log('IsModalOpen Check: ', modalInfo);

    return `
      <div class="modal">
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
