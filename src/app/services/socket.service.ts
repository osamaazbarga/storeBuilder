import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.websocketUrl, {
      transports: ['websocket'], // استخدام WS مباشر
      secure: true,
    });
    this.socket.on('connect', () => {
      console.log('✅ Connected to WS server with id:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WS server');
    });
  }

  // إرسال رسالة للباك إند
  sendMessage(msg: string): void {
    this.socket.emit('sendMessage', msg);
  }

  // الاستماع للرسائل الجديدة
  onNewMessage(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('newMessage', (data: string) => {
        observer.next(data);
      });
    });
  }
}