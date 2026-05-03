import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OperationType, handleFirestoreError } from '../lib/errorHandlers';
import { Draw } from '../types';

const COLLECTION_NAME = 'draws';

export const drawService = {
  subscribeToLatestDraws(callback: (draws: Draw[]) => void) {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('drawDate', 'desc'),
      limit(10)
    );

    return onSnapshot(q, (snapshot) => {
      const draws = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Draw[];
      callback(draws);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    });
  }
};
