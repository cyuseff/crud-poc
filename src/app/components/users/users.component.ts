import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';
import { ModelStatus } from 'src/app/models/baseModel.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public readonly Status: typeof ModelStatus = ModelStatus;
  public formDisabled = false;
  @ViewChild('f') public form: NgForm;

  constructor(
    public userService: UserService,
  ) { }

  public ngOnInit() {
  }

  public metaToString(user: User): string {
    return JSON.stringify(user);
  }

  public onSubmit() {
    const username = this.form.value.username;
    if (username) {
      this.formDisabled = true;

      const newUser: User = {
        name: username,
        lastName: `LastName-${name}`,
        age: 10,
      };

      this.userService.addUser(newUser).subscribe(
        () => {
          this.formDisabled = false;
          this.form.reset();
        },
        (err) => {
          this.formDisabled = false;
        },
        () => console.log('Close at component')
      );
    }
  }

  public addAge(user: User) {
    const age: number = user.age + 1;
    this.userService.updateAge(user, age);
  }

  public getClasses(user: User) {
    return {
      'table-secondary': user._meta.status === ModelStatus.PENDING,
      'table-danger': user._meta.status === ModelStatus.ERROR
    };
  }

}
