import { useContext } from 'react';
import { SubXContext } from '../provider/SubXContext';

export function useSubX() {
  const context = useContext(SubXContext);
  if (!context) {
    throw new Error('useSubX must be used within a SubXProvider');
  }
  return context;
}
