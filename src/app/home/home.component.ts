import {Component} from '@angular/core';
import {User} from "../_models";
import {AuthService} from "../_service";


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loading = false;
  users: User[];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.loading = true;
    this.loading = false;
    this.users = [];
  }
}
