import { Component, OnInit, ViewChild } from '@angular/core';
import { WishService } from 'src/app/services/wish.service';
import { Wish, TypeMessage } from 'src/app/interfaces';
import { UserService } from '../../services/user.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { EditComponent } from '../edit/edit.component';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private _shoppingList: Wish[] = [];
  private _expanded: string[] = [];
  private wishSelected: Wish;

  @ViewChild(ModalComponent)
  modalView: ModalComponent;

  @ViewChild(EditComponent)
  editView: EditComponent;

  constructor(private _service: WishService, private _user: UserService) {}

  get list(): Wish[] {
    return this._shoppingList.filter(f => this.showBoughtItems || !f.bought);
  }

  get totalRecords(): number {
    return this._shoppingList.length;
  }

  get showBoughtItems() {
    return this._user.showBoughtItems;
  }

  set showBoughtItems(show: boolean) {
    this._user.showBoughtItems = show;
    this.loadList();
  }

  get userAgreed() {
    return this._user.userAgreed;
  }

  set userAgreed(value: boolean) {
    this._user.userAgreed = value;
  }

  ngOnInit() {
    this.loadList();
  }

  isExpanded = id => !!this._expanded.find(f => f === id);

  toggle = id => {
    if (this.isExpanded(id)) {
      this._expanded.splice(this._expanded.indexOf(id), 1);
    } else {
      this._expanded.push(id);
    }
  };

  loadList = () =>
    this._service.getAll().subscribe(list => (this._shoppingList = list));

  mark = (wish: Wish) => {
    wish.bought = !wish.bought;
    setTimeout(this._service.edit, 500, wish);
  };

  removeWish = wish => this._service.remove(wish);

  openEditModal = wish =>
    (this.wishSelected = Object.assign({}, wish)) && this.modalView.show();

  handleEditWish = () => this.editView.edit();
}
