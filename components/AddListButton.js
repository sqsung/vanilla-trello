// eslint-disable-next-line import/extensions
import Component from '../core/Component.js';

class AddListButton extends Component {
  displayAddListForm(e) {
    if (e.target.closest('.empty')) this.setState({ isAddingList: true });
  }

  closeAddListForm(e) {
    if (!e.target.matches('.add-list>button[type="button"]')) return;

    this.setState({ isAddingList: false });
  }

  createNewList(e) {
    e.preventDefault();
    if (!e.target.matches('.add-list')) return;

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
    this.addEvent('submit', '.add-list', this.createNewList.bind(this.props));

    return `
      <div class="list-wrapper">
        <div class="list-content add-list ${isAddingList ? '' : 'empty'}">
          <div class="add-list-btn ${isAddingList ? 'hidden' : ''}">➕ Add another list</div>
          <form class="add-form add-list ${isAddingList ? '' : 'hidden'}">
            <textarea placeholder="Enter a new title."></textarea>
            <button type="submit">Add list</button>
            <button type="button">✖️</button>
          </form>
        </div>
      </div>`;
  }
}

export default AddListButton;
