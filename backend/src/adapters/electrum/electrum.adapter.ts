/**
 * @fileoverview Real Electrum adapter using electrum-client (lazy connection)
 * @version 1.0.0
 * @since 2025-08-11
 * @lastModified 2025-08-11
 * @state In Development
 */

import { ElectrumAdapter, FeeEstimates } from './types';

type ElectrumTransport = 'tcp' | 'tls';

interface BasicElectrumClient {
  connect(): Promise<void>;
  close(): Promise<void>;
  request(method: string, params?: unknown[]): Promise<unknown>;
}

type ElectrumCtor = new (
  port: number,
  host: string,
  transport: ElectrumTransport
) => BasicElectrumClient;

export class RealElectrumAdapter implements ElectrumAdapter {
  private host: string;
  private port: number;
  private tls: boolean;
  private client: BasicElectrumClient | null = null;

  constructor(params: { host: string; port: number; tls: boolean }) {
    this.host = params.host;
    this.port = params.port;
    this.tls = params.tls;
  }

  private async ensureConnected(): Promise<BasicElectrumClient> {
    if (this.client) return this.client;
    try {
      console.log(`Connecting to electrs at ${this.host}:${this.port} (TLS: ${this.tls})`);
      const mod = (await import('electrum-client')) as unknown as {
        default: ElectrumCtor;
      };
      const ElectrumClient = mod.default;
      const transport: ElectrumTransport = this.tls ? 'tls' : 'tcp';
      const client = new ElectrumClient(this.port, this.host, transport);
      console.log('ElectrumClient created, attempting connection...');
      await client.connect();
      console.log('Successfully connected to electrs');
      this.client = client;
      return this.client;
    } catch (error) {
      console.error('Failed to connect to electrs:', error);
      throw error;
    }
  }

  async ping(): Promise<boolean> {
    try {
      const c = await this.ensureConnected();
      // Try server.version first (more reliable than server.ping)
      const res = await c.request('server.version', ['0.0.0', '1.4']);
      console.log('Server version response:', res);
      return res !== null;
    } catch (error) {
      console.error('Electrum ping failed:', error);
      return false;
    }
  }

  async getFeeEstimates(): Promise<FeeEstimates> {
    const c = await this.ensureConnected();
    const fast = await this.callEstimate(c, 1);
    const normal = await this.callEstimate(c, 6);
    const slow = await this.callEstimate(c, 24);
    return { fast, normal, slow };
  }

  private async callEstimate(c: BasicElectrumClient, blocks: number): Promise<number> {
    try {
      // Use the correct method for fee estimation
      const result = await c.request('blockchain.estimatefee', [blocks]);
      console.log(`Fee estimate for ${blocks} blocks:`, result);
      if (typeof result === 'number' && Number.isFinite(result)) {
        return result;
      }
      return 0;
    } catch (error) {
      console.error(`Electrum estimatefee failed for ${blocks} blocks:`, error);
      return 0;
    }
  }

  async getTipHeight(): Promise<number> {
    const c = await this.ensureConnected();
    try {
      // Electrum protocol: blockchain.headers.subscribe returns the current tip header
      const result = (await c.request('blockchain.headers.subscribe', [])) as unknown;
      if (result && typeof (result as any).height === 'number') {
        return (result as any).height as number;
      }
      // Some servers may return an array or different structure; attempt common fallbacks
      if (Array.isArray(result) && result.length > 0 && typeof (result as any)[0]?.height === 'number') {
        return (result as any)[0].height as number;
      }
      return 0;
    } catch (error) {
      console.error('Electrum getTipHeight failed:', error);
      return 0;
    }
  }

  async getTipHeader(): Promise<{ height: number; headerHex?: string }> {
    const c = await this.ensureConnected();
    try {
      const result = (await c.request('blockchain.headers.subscribe', [])) as unknown;
      if (result && typeof (result as any).height === 'number') {
        const height = (result as any).height as number;
        const hex = typeof (result as any).hex === 'string' ? ((result as any).hex as string) : undefined;
        return { height, headerHex: hex };
      }
      if (Array.isArray(result) && result.length > 0 && typeof (result as any)[0]?.height === 'number') {
        const height = (result as any)[0].height as number;
        const hex = typeof (result as any)[0]?.hex === 'string' ? ((result as any)[0].hex as string) : undefined;
        return { height, headerHex: hex };
      }
      return { height: 0 };
    } catch (error) {
      console.error('Electrum getTipHeader failed:', error);
      return { height: 0 };
    }
  }

  async getMempoolSummary(): Promise<{ pendingTransactions?: number | null; vsize?: number }> {
    const c = await this.ensureConnected();
    try {
      // Electrum does not expose count; use fee histogram as a weak proxy for activity
      const hist = (await c.request('mempool.get_fee_histogram', [])) as unknown;
      if (Array.isArray(hist)) {
        // Provide null count but include an approximate virtual size sum if present
        // Histogram entries are [fee_rate, vsize] pairs in Electrum; sum vsizes if available
        let vsize = 0;
        for (const item of hist as any[]) {
          if (Array.isArray(item) && typeof item[1] === 'number') vsize += item[1];
        }
        return { pendingTransactions: null, vsize };
      }
    } catch (error) {
      console.error('Electrum getMempoolSummary failed:', error);
    }
    return { pendingTransactions: null };
  }
}


