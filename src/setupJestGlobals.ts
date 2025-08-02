import { TextEncoder, TextDecoder } from 'util';
if (typeof global.TextEncoder === 'undefined') {
  (global as typeof globalThis).TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  (global as typeof globalThis).TextDecoder = class {
    decode(input?: ArrayBuffer | DataView | null, options?: { stream?: boolean }): string {
      return new TextDecoder().decode(input, options);
    }
  } as unknown as typeof TextDecoder;
}

// fetchモック（node-fetchやjest-fetch-mockでも可。ここでは簡易モック）
if (typeof global.fetch === 'undefined') {
  (global as typeof globalThis).fetch = async () => ({
    json: async () => ({}),
    headers: new Headers(),
    ok: true,
    redirected: false,
    status: 200,
    statusText: 'OK',
    type: 'basic',
    url: '',
    clone: () => ({} as Response),
    text: async () => '',
    blob: async () => new Blob(),
    formData: async () => new FormData(),
    arrayBuffer: async () => new ArrayBuffer(0),
  } as Response);
}

// Responseモック（firebase/authのNode依存対策）
if (typeof global.Response === 'undefined') {
  (global as typeof globalThis).Response = class {
    body: unknown;
    status: number;
    statusText: string;
    headers: Headers;
    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.body = body;
      this.status = (init && init.status) || 200;
      this.statusText = (init && init.statusText) || 'OK';
      this.headers = new Headers(init?.headers);
    }
    json() { return Promise.resolve(this.body); }
    text() { return Promise.resolve(typeof this.body === 'string' ? this.body : JSON.stringify(this.body)); }
    static error() { return new Response(null, { status: 0, statusText: '' }); }
    static redirect(url: string | URL, status: number) { return new Response(null, { status, headers: { Location: url.toString() } }); }
  } as unknown as typeof Response;
}
