import { Platform } from 'react-native';
import { StoreName } from '../types';

export function getStoreName(): StoreName {
  return Platform.OS === 'ios' ? 'app_store' : 'play_store';
}
