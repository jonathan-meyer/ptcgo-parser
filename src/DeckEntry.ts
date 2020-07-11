export default interface DeckEntry {
  amount: number;
  name: string;
  set: string;
  code: number | string;
  ptcgoio: { id: string };
  raw: string;
}
