// eslint-disable-next-line import/extensions
import Component from '../core/Component.js';

class AddListButton extends Component {
  displayAddListForm(e) {
    if (e.target.closest('.add-list')) this.setState({ isAddingList: true });
  }

  closeAddListForm(e) {
    if (!e.target.matches('.bi, .button-holder>button[type="button"]')) return;

    this.setState({ isAddingList: false });
  }

  createNewList(e) {
    e.preventDefault();

    if (!e.target.closest('.add-list-form')) return;

    const newListTitle = e.target.firstElementChild.value.trim();
    if (!newListTitle) return;

    e.target.firstElementChild.value = '';

    const nextListId = Math.max(...this.state.lists.map(list => list.id)) + 1 || 0;

    this.setState({
      lists: [...this.state.lists, { id: nextListId, title: newListTitle, cards: [], isAdding: false }],
    });
  }

  render() {
    const { isAddingList } = this.props.state;

    this.addEvent('click', '.empty', this.displayAddListForm.bind(this.props));
    this.addEvent('click', '.add-list>button[type="button"]', this.closeAddListForm.bind(this.props));
    this.addEvent('submit', '.add-list-form', this.createNewList.bind(this.props));

    return `
      <div class="list-wrapper">
        <div class="list-content add-list ${isAddingList ? 'adding' : ''}">
          <button class="add-list-btn ${isAddingList ? 'hidden' : ''}"">
            <span>+ Add another list</span>
          </button>
          <form class="add-form add-list-form ${isAddingList ? '' : 'hidden'}">
            <input placeholder="Enter a new title."></input>
            <div class="button-holder">
              <button type="submit">Add list</button>
              <button type="button"><i class="bi bi-x"></i></button>
            </div>
        </form>
         </div>
      </div>`;
  }
}

export default AddListButton;
