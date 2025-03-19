import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.warfarin.app',
  appName: 'Warfarin Management App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;