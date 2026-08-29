import { collection, getDocs, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../../../core/api/firebase';
import { mapCakeDoc } from '../../../core/api/firestoreMappers';
import { captureError } from '../../../core/errors';
import { INITIAL_CAKES } from '../../../data/cakes';
import { CakeItem } from '../models/cake.model';

export class CakeRepository {
  static async fetchCakes(): Promise<CakeItem[]> {
    try {
      const snap = await getDocs(collection(db, 'cakes'));
      if (!snap.empty) {
        const liveCakes: CakeItem[] = [];
        snap.forEach((d) => {
          liveCakes.push(mapCakeDoc(d.id, d.data()));
        });
        return liveCakes;
      }
      return INITIAL_CAKES;
    } catch (err: unknown) {
      captureError(err, { source: 'CakeRepository', action: 'fetchCakes' });
      return INITIAL_CAKES;
    }
  }

  static subscribeCakes(onUpdate: (cakes: CakeItem[]) => void): Unsubscribe {
    try {
      return onSnapshot(
        collection(db, 'cakes'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: CakeItem[] = [];
            snapshot.forEach((d) => {
              list.push(mapCakeDoc(d.id, d.data()));
            });
            onUpdate(list);
          }
        },
        (error) => {
          captureError(error, { source: 'CakeRepository', action: 'subscribeCakes' });
        }
      );
    } catch (err: unknown) {
      captureError(err, { source: 'CakeRepository', action: 'subscribeCakes' });
      return () => {};
    }
  }
}
