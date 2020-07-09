import Deck from './Deck';
import { BASIC_ENERGY_IDS, SET_CODES } from './types';

const CARD_PATTERN = /^(?:\* )?(\d+) (.*) (\w+|[A-Z]{2}-[A-Z]{2})? (\d+|XY\d+|BW\d+)$/;

const SET_PATTERN = /(?:\* )?(\d+) (.*) ([A-Z]{2,3}|[A-Z]{2}-[A-Z]{2}|[A-Z0-9]{3})? (\d+|XY\d+|BW\d+)*/;
const BASIC_ENERGY_PATTERN = /(?:\* )?(\d+) (Darkness|Fairy|Fighting|Fire|Grass|Lightning|Metal|Psychic|Water) Energy.*/;

const parseRow = (row: string) => {
  const [, amount, name, set, code] = row.match(CARD_PATTERN) || [];
  return { amount, name, set, code };
};

class DeckParser {
  static parse(decklist: string): Deck {
    return {
      cards: decklist
        .split('\n')
        .map((row) => row.trim())
        .filter((row) => row.length > 0)
        .map((row) => {
          const { amount, name, set, code } = parseRow(row);

          const promoSet =
            set && set.startsWith('PR') ? set.split('-')[1] : null;

          return name
            ? {
                raw: row,
                amount: Number(amount),
                name,
                set,
                code: Number(code),
                ptcgoio: {
                  id: promoSet
                    ? `${SET_CODES[set]}-${promoSet}${code}`
                    : `${SET_CODES[set]}-${
                        Number(code) + (set === 'Energy' ? 163 : 0)
                      }`,
                },
              }
            : null;
        })
        .filter((card) => card),
    };
  }
}

export default DeckParser;
