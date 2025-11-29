export interface EntryCreateDto {
  amount: number;
  date: string;
  type: 'expense' | 'income';
  note: string;
  categoryIds: number[];
}
