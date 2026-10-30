import { Collection, RoomInspiration } from '../types/collection';

/**
 * PUBLIC COLLECTION SERVICE (Static Frontend Architecture)
 * Disconnected from Supabase for reliable static demo delivery.
 */
export const collectionService = {
  async getPublishedCollections(): Promise<Collection[]> {
    return [];
  },

  async getCollectionBySlug(_slug: string): Promise<Collection | null> {
    return null;
  },

  async getRoomInspirations(): Promise<RoomInspiration[]> {
    return [];
  }
};