/**
 * Minimal ambient types for 'electrum-client' until official types are added.
 * Narrow signatures avoid any; sufficient for our adapter usage.
 */
declare module 'electrum-client' {
  export default class ElectrumClient {
    constructor(port: number, host: string, protocol: 'tcp' | 'tls');
    connect(): Promise<void>;
    close(): Promise<void>;
    request(method: string, params?: unknown[]): Promise<unknown>;
  }
}


