import { BaseService } from './base.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Notification, NotificationTypes } from '../models/notification.model';
import { ModelStatus } from '../models/baseModel.model';

const _data: User[] = [
  {id: 0, name: 'User000', lastName: 'Last000', age: 23},
  {id: 1, name: 'User001', lastName: 'Last001', age: 20},
  {id: 2, name: 'User002', lastName: 'Last002', age: 30},
];

/**
 * UserService extends BaseService so we have setMeta methods
 */
@Injectable({providedIn: 'root'})
export class UserService extends BaseService {

  private users: BehaviorSubject<User[]> = new BehaviorSubject([]);
  public readonly users$: Observable<User[]> = this.users.asObservable();

  private notifier: Subject<Notification> = new Subject();
  public readonly notifier$: Observable<Notification> = this.notifier.asObservable();

  constructor(private httpService: HttpService) {
    super();
    this.loadUsers();
  }

  public loadUsers() {
    const data: User[] = this.setMetaToArray<User>(_data);
    this.httpService.get(data).subscribe(
      (users) => this.users.next(users)
    );
  }

  public addUser(user: User): Observable<any> {
    this.setMeta(user, {status: ModelStatus.PENDING});

    // emit the object as Pending
    this.users.next([...this.users.getValue(), user]);

    const obs = this.httpService.post(user);
    obs.subscribe(
      (updated: User) => {
        // update object to Ready
        user.id = updated.id;
        this.setMeta(user, {status: ModelStatus.READY});

        this.notifier.next(
          {
            type: NotificationTypes.SUCCESS,
            message: 'User added',
          }
        );
      },
      (error: Error) => {
        // remove object on error
        const users = [...this.users.getValue()];
        const idx = users.findIndex(item => item === user);
        users.splice(idx, 1);
        this.users.next(users);

        this.notifier.next(
          {
            type: NotificationTypes.ERROR,
            message: `User could not be added : ${error.message}`,
          }
        );
      },
      () => console.log('Close at service')
    );

    return obs;
  }

  public updateAge(
    user: User,
    age: number,
  ): Observable<any> {

    // update model
    const updated = {...user, age};
    this.setMeta(updated, {status: ModelStatus.PENDING});

    // replace with updated
    let users = [...this.users.getValue()];
    let idx = users.findIndex(u => u === user);
    users[idx] = updated;
    this.users.next(users);

    const obs = this.httpService.patch(user);
    obs.subscribe(
      () => {
        this.setMeta(updated, {status: ModelStatus.READY});

        this.notifier.next(
          {
            type: NotificationTypes.SUCCESS,
            message: 'User updated',
          }
        );
      },
      (error: Error) => {
        // rollback
        users = [...this.users.getValue()];
        idx = users.findIndex(u => u === updated);
        users[idx] = user;

        this.setMeta(user, {status: ModelStatus.ERROR});

        this.users.next(users);

        this.notifier.next(
          {
            type: NotificationTypes.ERROR,
            message: `User could not be updated : ${error.message}`,
          }
        );
      },
      () => console.log('Close at service')
    );

    return obs;
  }

  public removeUser(user: User): Observable<any> {
    this.setMeta(user, {status: ModelStatus.PENDING});

    const obs = this.httpService.delete(user);
    obs.subscribe(
      () => {
        const users = [...this.users.getValue()];
        const idx = users.findIndex(item => item === user);

        users.splice(idx, 1);
        this.users.next(users);
        this.notifier.next(
          {
            type: NotificationTypes.SUCCESS,
            message: 'User deleted',
          }
        );
      },
      (error: Error) => {
        this.setMeta(user, {status: ModelStatus.ERROR});
        this.notifier.next(
          {
            type: NotificationTypes.ERROR,
            message: `User could not be deleted: ${error.message}`,
          }
        );
      },
      () => console.log('Close at service')
    );

    return obs;
  }
}
