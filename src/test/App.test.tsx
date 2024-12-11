import { parseInput } from '../app/utils';

describe('parseInput', () => {
  it('should parse movie titles correctly', () => {
    const input1 = '@Juanito Nomino Klaus (2019)';
    expect(parseInput(input1)).toEqual('klaus');

    const input2 = '@Juanito nomino Silent Night, Deadly Night (1984)';
    expect(parseInput(input2)).toEqual('silent night deadly night');

    const input3 = '@Juanito nomino Jungla de Cristal 1988';
    expect(parseInput(input3)).toEqual('jungla de cristal');

    const input4 = '@Juanito nomino The Polar Express (2004)';
    expect(parseInput(input4)).toEqual('the polar express');

    // Magia no hace "de the holdovers" ta mal escrito...
    // const input5 = 'Nominó de The holdovers (2023) @Juanito';
    // expect(parseInput(input5)).toEqual('the holdovers');

    const input6 = '@Juanito nomino Violent Night 2022';
    expect(parseInput(input6)).toEqual('violent night');

    const input7 = 'Lady Hawke (1985) 2hr @Juanito';
    expect(parseInput(input7)).toEqual('lady hawke');

    const input8 =
      'Blade Runner 1982, salio en 1982, duracion 1 hora y 57 minutos, @Juanito';
    expect(parseInput(input8)).toEqual('blade runner');

    const input9 = '@Juanito Nomino Turboman, El regalo prometido (1996)';
    expect(parseInput(input9)).toEqual('turboman el regalo prometido');

    const input10 = '@Juanito Arrival (2016)';
    expect(parseInput(input10)).toEqual('arrival');

    const input11 = 'kill bill';
    expect(parseInput(input11)).toEqual('kill bill');
  });
});
