import {Component} from '@angular/core';
import {first} from 'rxjs/operators';
import {User} from "../_models";


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loading = false;
  users: User[];

  constructor() {
  }

  ngOnInit() {
    this.loading = true;
    this.loading = false;
    this.users = [];
  }
}
