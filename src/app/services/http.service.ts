import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

import { Observable, of, throwError } from 'rxjs';
import { delay, take, shareReplay, tap, map, mergeMap } from 'rxjs/operators';

const mockAsync = (val: any): Observable<any> => {
  return of(val)
    .pipe(
      delay(Math.round(Math.random() * 2000)),
      take(1),
      tap((v) => console.log(`mockAsync: ${JSON.stringify(v)} - ${Date.now()}`)),
      shareReplay(),
    );
};

@Injectable({providedIn: 'root'})
export class HttpService {
  private _ids = 10;

  get(val): Observable<any> {
    return mockAsync(val);
  }

  post(val: any): Observable<any> {
    return mockAsync(val).pipe(
      mergeMap((v) => Math.round(Math.random())
        ? of(v)
        : throwError(new Error(`Random Error - ${Date.now()}`))),
      map((o: User) => {
        this._ids++;
        o.id = this._ids;
        return {...o};
      }),
      tap((v) => console.log(`post: ${JSON.stringify(v)} - ${Date.now()}`)),
      shareReplay(),
    );
  }

  patch(val: any): Observable<any> {
    return mockAsync(val).pipe(
      mergeMap((v) => Math.round(Math.random())
        ? of(v)
        : throwError(new Error(`Random Error - ${Date.now()}`))),
      tap((v) => console.log(`patch: ${JSON.stringify(v)} - ${Date.now()}`)),
      shareReplay(),
    );
  }

  delete(val: any): Observable<any> {
    return mockAsync(val).pipe(
      mergeMap((v) => Math.round(Math.random())
        ? of(v)
        : throwError(new Error(`Random Error - ${Date.now()}`))),
      tap((v) => console.log(`delete: ${JSON.stringify(v)} - ${Date.now()}`)),
      shareReplay(),
    );
  }
}
