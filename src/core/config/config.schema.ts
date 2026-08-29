import { z } from 'zod';

export const ConfigSchema = z.object({
  env: z.enum(['development', 'production', 'test']).default('development'),
  firebase: z.object({
    apiKey: z.string().default(''),
    authDomain: z.string().default('cakebox-28faf.firebaseapp.com'),
    projectId: z.string().default('cakebox-28faf'),
    storageBucket: z.string().default('cakebox-28faf.firebasestorage.app'),
    messagingSenderId: z.string().default(''),
    appId: z.string().default(''),
    measurementId: z.string().default(''),
    oAuthClientId: z.string().default(''),
    firestoreDatabaseId: z.string().default('(default)'),
  }),
  gemini: z.object({
    apiKey: z.string().default(''),
    models: z.array(z.string()).default(['gemini-2.5-flash', 'gemini-2.5-flash-lite']),
  }),
});

export type AppConfig = z.infer<typeof ConfigSchema>;
