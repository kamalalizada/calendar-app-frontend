export interface EntryCategory {
  id?: number;
  entryId?: number;
  categoryId: number;
  category?: { id: number; name: string; type: string };
}