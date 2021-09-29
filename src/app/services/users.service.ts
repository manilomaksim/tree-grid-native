import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICountryTree, IPasteIds, IUser } from '../interfaces/sours-data-interfase';
import { environment } from '../../environments/environment';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly URL = environment.usersUrl;
  constructor(private http: HttpClient) {};

  public getAll(): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>(this.URL)
  }

  public movePosition(ids: IPasteIds, toIndex: number, position: 'above' | 'below' | 'child', country: string, action: 'cut' | 'copy'): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>(this.URL).pipe(
      map((data) => {

        return data.map(elem => {
          if (elem.country !== country) {
            return elem;
          }

          const usersList: (IUser | null)[] = [...elem.users];
          const usersToMove: (IUser | null)[] = [];
          usersList.forEach((user, idx) => {
            ids.id.forEach((element, index) => {
              if (user?._id && element === user._id) {
                if (action === 'cut') {
                  usersToMove.push(user);
                  usersList[idx] = null;
                } else {
                  usersToMove.push({ ...user, _id: user._id = ids.newId[index] });
                }
              }
            })
          });

          const leftUsers = usersList.slice(0, toIndex);
          const rightUsers = usersList.slice(toIndex);
          const midUser = leftUsers.pop();
          let newUserListWithNull;
          if (position === 'above'){
             newUserListWithNull = [...leftUsers, ...usersToMove, midUser, ...rightUsers]
          } else if (position === 'below') {
             newUserListWithNull = [...leftUsers, midUser, ...usersToMove, ...rightUsers]
          } else {
             newUserListWithNull = [...usersList, ...usersToMove]
          }

          const newUserList = newUserListWithNull.filter(Boolean);
          return {
            ...elem,
            users: newUserList
          }
        })
      }),
      switchMap((body) => {
        return this.http.post<ICountryTree[]>(this.URL, body);
      })
    );
  }

  public update(id: string, country: string, dto: Partial<IUser>): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>(this.URL).pipe(
      map((data) => {
        return data.map(elem => {
          if (elem.country !== country) {
            return elem;
          }
          return {
            ...elem,
            users: elem.users.map((user) => {
              return user._id !== id
                ? user
                : { ...user, ...dto }
            })
          };
        });
      }),
      switchMap((body) => {
        return this.http.post<ICountryTree[]>(this.URL, body);
      })
    );
  }

  public delete(entitiesMap: Record<string, string[]>): Observable<ICountryTree[]> {
    return this.http.get<ICountryTree[]>(this.URL).pipe(
      map((data) => {
        return data.map((item) => {
          if (!entitiesMap.hasOwnProperty(item.country)) {
            return item;
          }
          const idsToRemove = entitiesMap[item.country];
          return {
            ...item,
            users: item.users.filter((item) => !idsToRemove.includes(item._id))
          };
        });
      }),
      switchMap((body) => {
        return this.http.post<ICountryTree[]>(this.URL, body);
      })
    );
  }
}
