import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Global } from 'src/app/common/global';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public socket: WebSocketSubject<any>;

  constructor() {
    // Initialize the 'socket' property with the WebSocket server URL
    this.socket = webSocket(Global.webscoket);
  }

  connectToWebSocketServer() {
    // Subscribe to WebSocket messages
    this.socket.subscribe(
      (msg) => {
        // Handle incoming WebSocket messages here
      },
      (error) => {
        console.error('WebSocket error:', error);
      },
      () => {
        console.log('WebSocket connection closed.');
      }
    );
  }
  // Add methods to send WebSocket messages if needed
}
