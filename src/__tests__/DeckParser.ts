import { readFileSync } from 'fs';
import { resolve } from 'path';
import DeckParser from '../DeckParser';

describe('DeckParser', () => {
  it('Should Work with an empty string', () => {
    expect(DeckParser.parse('')).toEqual({ cards: [] });
  });

  it('Should Work #1', () => {
    expect(DeckParser.parse('* 1 Tapu Koko PR-SM 30')).toEqual({
      cards: [
        {
          amount: 1,
          code: 30,
          name: 'Tapu Koko',
          ptcgoio: {
            id: 'smp-SM30',
          },
          set: 'PR-SM',
        },
      ],
    });
  });

  it('Should Work #2', () => {
    expect(DeckParser.parse('* 1 Oranguru SUM 113')).toEqual({
      cards: [
        {
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

  it('Should Work #3', () => {
    expect(DeckParser.parse('* 2 Mew FAC 29')).toEqual({
      cards: [
        {
          amount: 2,
          code: 29,
          name: 'Mew',
          ptcgoio: {
            id: 'xy10-29',
          },
          set: 'FAC',
        },
      ],
    });
  });

  it('Should Work #4', () => {
    expect(DeckParser.parse('* 11 Darkness Energy 7')).toEqual({
      cards: [
        {
          amount: 11,
          code: 7,
          name: 'Darkness',
          ptcgoio: {
            id: 'sm1-170',
          },
          set: 'Energy',
        },
      ],
    });
  });

  it('Should Work #5', () => {
    expect(DeckParser.parse('* 10 Lightning Energy 1')).toEqual({
      cards: [
        {
          amount: 10,
          code: 1,
          name: 'Lightning',
          ptcgoio: {
            id: 'sm1-167',
          },
          set: 'Energy',
        },
      ],
    });
  });

  it('Should Work #6', () => {
    expect(DeckParser.parse('* 4 Double Dragon Energy ROS 97')).toEqual({
      cards: [
        {
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

  it('Should Work with an exported deck', () => {
    const deck = readFileSync(resolve(__dirname, 'test.deck')).toString();
    expect(DeckParser.parse(deck)).toMatchSnapshot();
  });
});

/*
const PTCGOParser = require('../lib/index.js')
const fs = require('fs')
const path = require('path')

const pick = (decklist, card_name) =>
  decklist.cards.filter(card => card.name === card_name)[0]

const exported_list = fs
  .readFileSync(path.resolve(__dirname, 'exported-1.deck'))
  .toString()

const promo_deck = fs
  .readFileSync(path.resolve(__dirname, 'promo.deck'))
  .toString()

const energies_deck = fs
  .readFileSync(path.resolve(__dirname, 'energies.deck'))
  .toString()

describe('ptcgo-parser', () => {
  it('should ignore headlines', () => {
    const decklist = PTCGOParser.parse(exported_list)
    const header_items = decklist.cards.filter(item =>
      item.name.startsWith('##')
    )

    expect(header_items.length).toBe(0)
  })

  it('should parse Oranguru correctly', () => {
    const decklist = PTCGOParser.parse(exported_list)
    const oranguru = pick(decklist, 'Oranguru')

    expect(oranguru.name).toBe('Oranguru')
    expect(oranguru.amount).toBe('1')
    expect(oranguru.set).toBe('SUM')
    expect(oranguru.code).toBe('113')
  })

  it('should work with cards without leading asterisk', () => {
    const decklist = PTCGOParser.parse(exported_list)
    const card = pick(decklist, 'Special Charge')

    expect(card.name).toBe('Special Charge')
    expect(card.amount).toBe('1')
    expect(card.set).toBe('STS')
    expect(card.code).toBe('105')
  })

  it('should parse correctly basic energy without set code', () => {
    const decklist = PTCGOParser.parse(exported_list)
    const card = pick(decklist, 'Darkness')

    expect(card.name).toBe('Darkness')
    expect(card.amount).toBe('11')
    expect(card.set).toBe(undefined)
    expect(card.code).toBe(undefined)
  })

  it('should parse correctly basic energy with a set code', () => {
    const decklist = PTCGOParser.parse(exported_list)
    const card = pick(decklist, 'Water')

    expect(card.name).toBe('Water')
    expect(card.amount).toBe('4')
    expect(card.set).toBe(undefined)
    expect(card.code).toBe(undefined)
  })

  it('should parse correctly special energy with a set code', () => {
    const decklist = PTCGOParser.parse(exported_list)

    const card = pick(decklist, 'Double Dragon Energy')

    expect(card.name).toBe('Double Dragon Energy')
    expect(card.amount).toBe('4')
    expect(card.set).toBe('ROS')
    expect(card.code).toBe('97')
  })

  it('should parse correctly SM promo', () => {
    const decklist = PTCGOParser.parse(promo_deck)
    const card = pick(decklist, 'Tapu Koko')

    expect(card.name).toBe('Tapu Koko')
    expect(card.amount).toBe('1')
    expect(card.set).toBe('PR-SM')
    expect(card.code).toBe('30')
  })

  it('should parse correctly XY promo', () => {
    const decklist = PTCGOParser.parse(promo_deck)
    const card = pick(decklist, 'Jirachi')

    expect(card.name).toBe('Jirachi')
    expect(card.amount).toBe('1')
    expect(card.set).toBe('PR-XY')
    expect(card.code).toBe('67')
  })

  it('should match PTCGO set code to ptcgo.io id correctly', () => {
    const decklist = PTCGOParser.parse(exported_list)
    const card = pick(decklist, 'Double Dragon Energy')

    expect(card.name).toBe('Double Dragon Energy')
    expect(card.set).toBe('ROS')
    expect(card.ptcgoio.id).toBe('xy6-97')
  })
})

it('should match promo PTCGO set code to ptcgo.io id correctly', () => {
  const decklist = PTCGOParser.parse(promo_deck)

  const card = pick(decklist, 'Jirachi')

  expect(card.name).toBe('Jirachi')
  expect(card.set).toBe('PR-XY')
  expect(card.ptcgoio.id).toBe('xyp-XY67')
})

it('should match promo PTCGO set code to ptcgo.io id correctly, part 2', () => {
  const decklist = PTCGOParser.parse(promo_deck)

  const card = pick(decklist, 'Tapu Koko')

  expect(card.name).toBe('Tapu Koko')
  expect(card.set).toBe('PR-SM')
  expect(card.ptcgoio.id).toBe('smp-SM30')
})

it('should use S&M energy ids for basic energies', () => {
  const decklist = PTCGOParser.parse(energies_deck)

  let card = pick(decklist, 'Darkness')
  expect(card.name).toBe('Darkness')
  expect(card.ptcgoio.id).toBe('sm1-170')

  card = pick(decklist, 'Fairy')
  expect(card.name).toBe('Fairy')
  expect(card.ptcgoio.id).toBe('sm1-172')

  card = pick(decklist, 'Fighting')
  expect(card.name).toBe('Fighting')
  expect(card.ptcgoio.id).toBe('sm1-169')

  card = pick(decklist, 'Fire')
  expect(card.name).toBe('Fire')
  expect(card.ptcgoio.id).toBe('sm1-165')

  card = pick(decklist, 'Grass')
  expect(card.name).toBe('Grass')
  expect(card.ptcgoio.id).toBe('sm1-164')

  card = pick(decklist, 'Lightning')
  expect(card.name).toBe('Lightning')
  expect(card.ptcgoio.id).toBe('sm1-167')

  card = pick(decklist, 'Metal')
  expect(card.name).toBe('Metal')
  expect(card.ptcgoio.id).toBe('sm1-171')

  card = pick(decklist, 'Psychic')
  expect(card.name).toBe('Psychic')
  expect(card.ptcgoio.id).toBe('sm1-168')

  card = pick(decklist, 'Water')
  expect(card.name).toBe('Water')
  expect(card.ptcgoio.id).toBe('sm1-166')
})
*/
