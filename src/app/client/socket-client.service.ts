import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {SocketClientState} from "./socket-client-state";
import {filter, first, switchMap} from "rxjs/operators";
import {environment} from "../../environments/environment";
import * as SockJS from 'sockjs-client';
import {Client, Message, over, StompSubscription} from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class SocketClientService implements OnDestroy {

  private client: Client;
  private state: BehaviorSubject<SocketClientState>;

  constructor() {
  }

  private connect(): Observable<Client> {
    return new Observable<Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED))
        .subscribe(() => {
          observer.next(this.client)
        })
    })
  }

  init() {
    this.client = over(new SockJS(environment.webSocketEndPoint));
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);

    this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED)
    })
  }

  static jsonHandler(message: Message): any {
    return JSON.parse(message.body);
  }

  static textHandler(message: Message): string {
    return message.body;
  }

  onMessage(topic: string, handler = SocketClientService.jsonHandler): Observable<any> {
    return this.connect().pipe(first(), switchMap(client => {
      return new Observable<any>(observer => {
        const subscription: StompSubscription = client.subscribe(topic, message => {
          observer.next(handler(message))
        });
        return () => client.unsubscribe(subscription.id)
      })
    }))
  }

  onPlainMessage(topic: string): Observable<any> {
    return this.onMessage(topic, SocketClientService.textHandler)
  }

  send(topic: string, payload: any): void {
    this.connect().pipe(first()).subscribe(client => client.send(topic, {}, JSON.stringify(payload)))
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  disconnect(): void {
    this.connect().pipe(first()).subscribe(client => {
      client.disconnect(null)
    })
  }
}
