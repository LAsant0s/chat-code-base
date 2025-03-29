/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { delay, fileToBuffer } from '@/utils/functions';

class ApiService {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao buscar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      await delay(2000);
      const response: AxiosResponse<T> = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao enviar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  async uploadFile<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    try {
      const buffer = await fileToBuffer(file);
      
      const formData = new FormData();
      formData.append('file', new Blob([buffer], { type: file.type }));
      formData.append('filename', file.name);
      formData.append('contentType', file.type);

      const response: AxiosResponse<T> = await this.api.post(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao fazer upload do arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
  }
}

export const api = new ApiService('http://localhost:3000');

export interface ChatResponse {
  message: string;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  buffer: string;
}

export const chatService = {
  sendMessage: (message: string) => api.post<ChatResponse>('/chat', { message }),
  getMessages: () => api.get<ChatResponse[]>('/chat'),
  uploadPdf: (file: File) => api.uploadFile<FileUploadResponse>('/chat/upload', file)
}; 