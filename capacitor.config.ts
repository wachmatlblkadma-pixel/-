import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tajalwaqar.app',
  appName: 'تاج الوقار',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
