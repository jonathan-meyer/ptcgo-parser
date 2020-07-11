import { readFileSync } from 'fs';
import { resolve } from 'path';
import DeckParser from '../DeckParser';

describe('DeckParser', () => {
  it('Should Work with an empty string', () => {
    return expect(DeckParser.parse('')).resolves.toEqual({ cards: [] });
  });

  it.skip('Should Work #1', () => {
    return expect(DeckParser.parse('* 1 Tapu Koko PR-SM 30')).resolves.toEqual({
      cards: [
        {
          raw: '* 1 Tapu Koko PR-SM 30',
          amount: 1,
          code: 'SM30',
          name: 'Tapu Koko',
          ptcgoio: {
            id: 'smp-SM30',
          },
          set: 'PR-SM',
        },
      ],
    });
  });

  it.skip('Should Work #2', () => {
    return expect(DeckParser.parse('* 1 Oranguru SUM 113')).resolves.toEqual({
      cards: [
        {
          raw: '* 1 Oranguru SUM 113',
          amount: 1,
          code: 113,
          name: 'Oranguru',
          ptcgoio: {
            id: 'sm1-113',
          },
          set: 'SUM',
        },
      ],
    });
  });

  it.skip('Should Work #3', () => {
    return expect(DeckParser.parse('* 2 Mew FCO 29')).resolves.toEqual({
      cards: [
        {
          raw: '* 2 Mew FCO 29',
          amount: 2,
          code: 29,
          name: 'Mew',
          ptcgoio: {
            id: 'xy10-29',
          },
          set: 'FCO',
        },
      ],
    });
  });

  it.skip('Should Work Basic Energy', () => {
    const entry = '* 10 Darkness Energy Energy 7';
    return expect(DeckParser.parse(entry)).resolves.toEqual({
      cards: [
        {
          raw: entry,
          amount: 10,
          code: 168,
          name: 'Darkness Energy',
          ptcgoio: {
            id: 'sm3-168',
          },
          set: 'BUS',
        },
      ],
    });
  });

  it.skip('Should Work Special Energy', () => {
    const entry = '* 1 Double Colorless Energy NXD 92';
    return expect(DeckParser.parse(entry)).resolves.toEqual({
      cards: [
        {
          raw: entry,
          amount: 1,
          code: 92,
          name: 'Double Colorless Energy',
          ptcgoio: {
            id: 'bw4-92',
          },
          set: 'NXD',
        },
      ],
    });
  });

  it.skip('Should Work Special Energy #2', () => {
    const entry = '* 1 Beast Energy {*} FLI 117';
    return expect(DeckParser.parse(entry)).resolves.toEqual({
      cards: [
        {
          raw: entry,
          amount: 1,
          code: 117,
          name: 'Beast Energy ◇',
          ptcgoio: {
            id: 'sm6-117',
          },
          set: 'FLI',
        },
      ],
    });
  });

  it.skip('Should Work #5', () => {
    const entry = '* 1 Lightning Energy Energy 4';
    expect(DeckParser.parse(entry)).toEqual({
      cards: [
        {
          raw: entry,
          amount: 1,
          code: 4,
          name: 'Lightning Energy',
          ptcgoio: {
            id: 'sm1-167',
          },
          set: 'Energy',
        },
      ],
    });
  });

  it.skip('Should Work #6', () => {
    expect(DeckParser.parse('* 4 Double Dragon Energy ROS 97')).toEqual({
      cards: [
        {
          raw: '* 4 Double Dragon Energy ROS 97',
          amount: 4,
          code: 97,
          name: 'Double Dragon Energy',
          ptcgoio: {
            id: 'xy6-97',
          },
          set: 'ROS',
        },
      ],
    });
  });

  it('Should Work with test deck', async () => {
    const deck = readFileSync(resolve(__dirname, 'test.deck')).toString();
    return expect(await DeckParser.parse(deck)).toMatchSnapshot();
  });

  it('Should Work with energy deck', async () => {
    const deck = readFileSync(resolve(__dirname, 'energy.deck')).toString();
    return expect(await DeckParser.parse(deck)).toMatchSnapshot();
  });

  it('Should Work with promo deck', async () => {
    const deck = readFileSync(resolve(__dirname, 'promo.deck')).toString();
    return expect(await DeckParser.parse(deck)).toMatchSnapshot();
  });
});
