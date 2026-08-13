import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs/promises';
import * as admin from 'firebase-admin';
import { getMessaging, Message, Messaging } from 'firebase-admin/messaging';
import {
  FIREBASE_CONFIG_KEY,
  type FirebaseConfig,
} from '../../../config/firebase.config';
import { FirebaseKeys } from '../firebase-keys.constant';
import { LoggerService } from '../../../infra/logger/logger.service';

@Injectable()
export class DefaultFirebaseService implements OnModuleInit {
  private app: admin.App;
  private messaging: Messaging;

  constructor(
    @Inject(FIREBASE_CONFIG_KEY) private firebaseConfig: FirebaseConfig,
    private logger: LoggerService,
  ) {}

  async onModuleInit() {
    try {
      const serviceAccountPath = path.join(
        process.cwd(),
        this.firebaseConfig.default.serviceAccountPath,
      );

      const serviceAccountFile = await fs.readFile(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(serviceAccountFile);

      this.app = admin.initializeApp(
        { credential: admin.cert(serviceAccount as admin.ServiceAccount) },
        FirebaseKeys.DEFAULT,
      );

      this.messaging = getMessaging(this.app);

      this.logger.log(
        `Firebase initialized with projectId: ${serviceAccount.project_id}`,
        'Firebase',
      );
    } catch (error) {
      this.logger.error(error, 'Firebase');
    }
  }

  async sendNofitication(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const messages: Message[] = tokens.map((token) => ({
      token,
      notification: { title, body },
      data: data,
    }));

    try {
      const response = await this.messaging.sendEach(messages);
      // TODO: handle failure messages
      return response;
    } catch (error) {
      this.logger.error(error, 'Firebase');
    }

    return;
  }
}
