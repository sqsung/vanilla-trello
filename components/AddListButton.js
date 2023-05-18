// eslint-disable-next-line import/extensions
import Component from '../core/Component.js';

class AddListButton extends Component {
  displayAddListForm(e) {
    if (!e.target.closest('.add-list-btn')) return;

    const updatedList = this.state.lists.map(list => ({ ...list, isAdding: false }));

    this.setState({ lists: updatedList, isAddingList: true });
  }

  closeAddListForm(e) {
    if (!e.target.matches('.close-add-list-btn') && !e.target.matches('.list-wrapper')) return;

    this.setState({ isAddingList: false });
  }

  createNewList(e) {
    e.preventDefault();

    if (!e.target.matches('.add-list-form')) return;

    const newListTitle = e.target.firstElementChild.value.trim();
    if (!newListTitle) return;

    e.target.firstElementChild.value = '';

    const nextListId = this.state.lists.length ? Math.max(...this.state.lists.map(list => list.id)) + 1 : 0;

    this.setState({
      lists: [...this.state.lists, { id: nextListId, title: newListTitle, cards: [], isAdding: false }],
      isAddingList: true,
    });
  }

  render() {
    const { isAddingList } = this.props.state;

    this.addEvent('click', '.add-list', this.displayAddListForm.bind(this.props));
    this.addEvent('click', '.close-add-list-btn', this.closeAddListForm.bind(this.props));
    this.addEvent('submit', '.add-list-form', this.createNewList.bind(this.props));

    return `
      <div class="list-wrapper" data-id="list-adder">
        <div class="list-content add-list ${isAddingList ? 'adding' : ''}">
          <button class="add-list-btn ${isAddingList ? 'hidden' : ''}"">
            <span>+ Add another list</span>
          </button>
          <form class="add-form add-list-form ${isAddingList ? '' : 'hidden'}">
            <input placeholder="Enter a new title."></input>
            <div class="button-holder">
              <button type="submit">Add list</button>
              <button type="button"><i class="bi bi-x close-add-list-btn"></i></button>
            </div>
          </form>
         </div>
      </div>`;
  }
}

export default AddListButton;
