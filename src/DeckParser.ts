import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import Deck from './Deck';

const CARD_PATTERN = /^(?:\* )?(\d+) (.*) (\w+|[A-Z]{2}-[A-Z]{2})? (\d+|XY\d+|BW\d+)$/;

const getCard = async (code: string) => {
  return PokemonTCG.Card.find(code).catch((err) => {
    const card = new PokemonTCG.Card();
    card.name = `unknown code: '${code}'`;
    card.id = '???-??';
    card.number = '??';
    return card;
  });
};

const getSet = async (code: string) => {
  return PokemonTCG.Set.where([{ name: 'ptcgoCode', value: code || '' }])
    .then((sets) => sets[0] || new PokemonTCG.Set())
    .catch((err) => {
      const set = new PokemonTCG.Set();
      set.ptcgoCode = `unknown code: '${code}'`;
      set.code = '???';
      return set;
    });
};

const parseRow = async (row: string) => {
  const [, amount, name, setCode, number] = row.match(CARD_PATTERN) || [];

  let card: PokemonTCG.Card;
  let set: PokemonTCG.Set;

  if (/Energy/i.test(setCode)) {
    card = (
      await PokemonTCG.Card.where([
        { name: 'supertype', value: 'Energy' },
        { name: 'subtype', value: 'Basic' },
        { name: 'name', value: name },
      ])
    )[0];
    set = await PokemonTCG.Set.find(card.setCode);
  } else {
    set = await getSet(setCode);
    const [, promoSet] =
      (set.ptcgoCode && set.ptcgoCode.match(/^PR-(\w+)$/)) || [];
    card = await getCard(`${set.code}-${promoSet || ''}${number}`);
  }

  return { amount: Number(amount), card, set };
};

class DeckParser {
  static async parse(decklist: string): Promise<Deck> {
    return {
      cards: await Promise.all(
        decklist
          .split('\n')
          .map((row) => row.trim())
          .filter((row) => row.length > 0 && CARD_PATTERN.test(row))
          .map(async (row) => {
            const { amount, card, set } = await parseRow(row);

            return (
              card && {
                raw: row,
                amount,
                name: card.name,
                set: set.ptcgoCode,
                code: Number(card.number) || card.number,
                ptcgoio: {
                  id: card.id,
                },
              }
            );
          })
          .filter((card) => card)
      ),
    };
  }
}

export default DeckParser;
