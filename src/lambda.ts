import { configure as serverlessExpress } from '@vendia/serverless-express';

import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer;

export const handler = async (event, context) => {
  if (!cachedServer) {
    const nestApp = await createNestApplication();

    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    });
  }

  return cachedServer(event, context);
};

async function createNestApplication(): Promise<INestApplication> {
  const expressAdapater = new ExpressAdapter();

  return NestFactory.create(AppModule, expressAdapater).then(
    async (nestApp: INestApplication) => {
      //await nestApp.useGlobalPipes(new ClassValidatorPipe()).init();
      return nestApp;
    },
  );
}
