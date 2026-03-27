import { Injectable } from '@angular/core';
import { Watch } from '../models/watch.model';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  getRecommendations(watches: Watch[], current?: Watch): Watch[] {
    return watches
      .filter((watch) => watch.id !== current?.id)
      .sort((a, b) => {
        const currentCategoryBoost = current && a.category === current.category ? -1 : 0;
        const comparisonBoost = current && b.category === current.category ? -1 : 0;
        return currentCategoryBoost - comparisonBoost || b.rating - a.rating;
      })
      .slice(0, 3);
  }
}
