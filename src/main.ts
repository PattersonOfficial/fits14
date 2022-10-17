import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

const currentUrl = window.location.href;

if (environment.production) {
  enableProdMode();

  if (currentUrl.includes('https://account.fitnuts.com')) {
    Sentry.init({
      dsn: 'https://b805bd6c6b194b298bb65fd4cc70468b@o1238962.ingest.sentry.io/6712488',
      integrations: [
        new BrowserTracing({
          tracingOrigins: ['https://account.fitnuts.com/'],
          routingInstrumentation: Sentry.routingInstrumentation,
        }),
      ],
      tracesSampleRate: 0.5,
    });
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
