import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos modulos Usuario e auth (e2e)', () => {
  let usuarioId:number;
  let token: string;

  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type:'sqlite',
          database: ':memory:',
          entities: [__dirname + './../src/**/entities/*.entity.ts'],
          synchronize: true,
          dropSchema:true,
        }),        
        
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });


  afterAll(async () =>{
    await app.close();
  });

  it('1-Ddeve cadastrar um novo Usuario', async()=>{
    const resposta = await request(app.getHttpServer())
    .post('/usuarios/cadastrar')
    .send({
        nome: 'Murilo',
        usuario: 'murilo@email.com',
        senha: 'murilo123',
        foto: 'https://i.imgur.com/zEM4Z3S.jpeg',
      })
      .expect(201);

      usuarioId= (resposta.body as {id: number}).id;
      
  });

  it('2-Não deve cadastrar um usuario duplicado', async()=>{
    await request(app.getHttpServer())
    .post('/usuarios/cadastrar')
    .send({
        nome: 'Murilo',
        usuario: 'murilo@email.com',
        senha: 'murilo123',
        foto: 'https://i.imgur.com/zEM4Z3S.jpeg',
    })
    .expect(400);
  });

  it('3-Deve autenticar o usuario(Login)', async ()=>{
    const resposta = await request(app.getHttpServer())
    .post('/usuarios/logar')
    .send({
      usuario: 'murilo@email.com',
      senha: 'murilo123'
    })
    .expect(200);

    token = (resposta.body as {token: string}).token;
  });


  it('4-Deve litar todos os usuarios', async ()=>{
    return request(app.getHttpServer())
    .get('/usuarios/all')
    .set('Authorization', token)
    .send({})
    .expect(200);
    });

    it('5-Deve atualizar um usuario', async()=>{
      return request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set ('Authorization', token)
      .send({
        id:usuarioId,
        nome: 'Murilo atualizado',
        usuario: 'murilo-atualizado@email.com',
        senha: 'murilo456',
        foto: 'https://i.imgur.com/zEM4Z3S.jpeg',
      })
      .expect(200)
      .then((resposta)=>{
        const body = resposta.body as {nome: string};

        expect(body.nome).toEqual('Murilo atualizado');
      });

    });
});
