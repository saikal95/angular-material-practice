export class Message{
  constructor(
    public _id: string,
    public message: string,
    public author: string,
    public datetime: string,
  ){}
}


export interface messageData {
  message: string,
  author: string,
}
