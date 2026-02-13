import request from 'supertest';
import { getTestApp } from './utils/e2e-setup';

describe('AppController (e2e)', () => {
  it('/ (GET)', () => {
    return request(getTestApp().getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
