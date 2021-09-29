export interface IUser {
  index: number,
  _id: string,
  firstName: string,
  lastName: string,
  isActive: boolean,
  gender: string,
  email: string,
  phone: string,
  age: number,
  company: string,
  city: string,
  guid: string,
  registered: string
}

export interface ICountryTree{
  country: string,
  users: IUser[]
}

export interface IPasteIds{
  id: string[],
  newId: string[]
}
