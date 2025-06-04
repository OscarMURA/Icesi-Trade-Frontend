// src/services/WebSocketService.ts
import { Client } from '@stomp/stompjs';

class WebSocketService {
  private static instance: WebSocketService;
  private stompClient: Client | null = null;
  private messageCallback: ((message: any) => void) | null = null;
  private username: string | null = null;
  private userId: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000;
  private isConnecting = false;
  private reconnectTimeout: number | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(username: string, userId: number, onMessage: (message: any) => void) {
    console.log('Iniciando conexión WebSocket...');
    
    // Si ya hay una conexión activa, desconectarla primero
    if (this.stompClient?.connected) {
      console.log('Desconectando conexión existente...');
      this.disconnect();
    }

    // Limpiar cualquier intento de reconexión pendiente
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.messageCallback = onMessage;
    this.username = username;
    this.userId = userId;
    this.reconnectAttempts = 0;
    
    this.initializeStompClient();
  }

  private initializeStompClient() {
    if (!this.username || !this.userId) {
      console.error('No hay nombre de usuario o ID para la conexión');
      return;
    }

    if (this.isConnecting) {
      console.log('Ya hay una conexión en progreso');
      return;
    }

    this.isConnecting = true;
    console.log('Inicializando cliente STOMP...');

    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/g1/losbandalos/ws',
      connectHeaders: {
        username: this.username,
        userId: this.userId.toString()
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log('Conectado al WebSocket exitosamente');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.subscribeToTopics();
      },
      onStompError: (frame) => {
        console.error('Error en STOMP:', frame);
        this.isConnecting = false;
        
        // Si el error es "Session closed", intentar reconectar inmediatamente
        if (frame.headers.message === 'Session closed.') {
          console.log('Sesión cerrada, intentando reconectar...');
          this.reconnectAttempts = 0;
          this.handleReconnect();
        } else {
          this.handleReconnect();
        }
      },
      onWebSocketError: (event) => {
        console.error('Error en WebSocket:', event);
        this.isConnecting = false;
        this.handleReconnect();
      },
      onWebSocketClose: () => {
        console.log('Conexión WebSocket cerrada');
        this.isConnecting = false;
        this.handleReconnect();
      }
    });

    try {
      console.log('Activando cliente STOMP...');
      this.stompClient.activate();
    } catch (error) {
      console.error('Error al activar el cliente STOMP:', error);
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Intentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      // Limpiar cualquier intento de reconexión pendiente
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }

      // Calcular el tiempo de espera con backoff exponencial
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      this.reconnectTimeout = window.setTimeout(() => {
        if (this.stompClient) {
          try {
            this.stompClient.deactivate();
            this.initializeStompClient();
          } catch (error) {
            console.error('Error durante la reconexión:', error);
          }
        }
      }, delay);
    } else {
      console.error('Número máximo de intentos de reconexión alcanzado');
      this.disconnect();
    }
  }

  private subscribeToTopics() {
    if (!this.stompClient?.connected) {
      console.error('No se puede suscribir: cliente no conectado');
      return;
    }

    try {
      console.log('Suscribiéndose a tópicos...');
      
      // Suscribirse al tópico privado del usuario
      if (this.username) {
        this.stompClient.subscribe(`/user/${this.username}/queue/messages`, (message) => {
          console.log('Mensaje privado recibido:', message);
          if (this.messageCallback) {
            this.messageCallback(message);
          }
        });
      }
      console.log('Suscripciones completadas');
    } catch (error) {
      console.error('Error al suscribirse a los tópicos:', error);
    }
  }

  disconnect() {
    console.log('Desconectando WebSocket...');
    
    // Limpiar el timeout de reconexión
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
      } catch (error) {
        console.error('Error al desconectar:', error);
      }
      this.stompClient = null;
    }
    
    this.messageCallback = null;
    this.username = null;
    this.userId = null;
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  sendMessage(senderId: number, receiverId: number, message: string) {
    console.log('Intentando enviar mensaje...');
    if (!this.stompClient?.connected) {
      console.error('WebSocket no está conectado');
      this.connect(this.username || '', this.userId || 0, this.messageCallback || (() => {}));
      throw new Error('WebSocket no está conectado');
    }

    const messageObj = {
      senderId,
      receiverId,
      content: message,
      timestamp: new Date().toISOString()
    };

    try {
      console.log('Enviando mensaje privado:', messageObj);
      this.stompClient.publish({
        destination: '/app/chat.private',
        body: JSON.stringify(messageObj)
      });
      console.log('Mensaje enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }
}

export default WebSocketService.getInstance();
