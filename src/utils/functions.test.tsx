import fn from "./functions";

it("remove registros duplicados de um vetor de objetos conforme o atributo informado", () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }, { id: 3 }];
  const attribute = "id";

  expect(fn.getUnique(data, attribute)).toEqual([
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ]);
});

it("remove acentos de uma string", () => {
  const data = "ÁéÃõÔôÇçÀà";
  expect(fn.removeAccents(data)).toEqual("AeAoOoCcAa");
});

it("ordena um vetor de objetos conforme o atributo informado", () => {
  const data = [
    { name: "2016-09-22T13:57:32.2311892-03:00" },
    { name: "2016-09-22T13:57:31.2311892-03:00" },
    { name: "2016-09-22T13:57:33.2311892-03:00" },
    { name: "2016-10-02T11:37:35.2300892-03:00" },
    { name: "2016-10-02T11:37:31.2300892-03:00" }
  ];
  const attribute = "name";

  expect(fn.sort(data, attribute)).toEqual([
    { name: "2016-09-22T13:57:31.2311892-03:00" },
    { name: "2016-09-22T13:57:32.2311892-03:00" },
    { name: "2016-09-22T13:57:33.2311892-03:00" },
    { name: "2016-10-02T11:37:31.2300892-03:00" },
    { name: "2016-10-02T11:37:35.2300892-03:00" }
  ]);
});

describe("filtra um vetor de objetos conforme o termo pesquisado", () => {
  const data = [
    { name: "de" },
    { name: "bc" },
    { name: "a" },
    { name: "cd" },
    { name: "ab" }
  ];
  const attribute = "name";

  it("termo 'a'", () => {
    let q = "a";
    expect(fn.filter(q, data, attribute)).toEqual([
      { name: "a" },
      { name: "ab" }
    ]);
  });

  it("termo 'bc'", () => {
    let q = "bc";
    expect(fn.filter(q, data, attribute)).toEqual([{ name: "bc" }]);
  });

  it("termo 'fg'", () => {
    let q = "fg";
    expect(fn.filter(q, data, attribute)).toEqual([]);
  });
});

it("formata valores em moeda brasileira", () => {
  const data = [0, 0.00, 1, 1.00, 1000, 1000.00, 1000000, 1000000.00];

  expect(data.map(item => fn.formatMoney(item, 2, "R$ ", ".", ","))).toEqual([
    "R$ 0,00",
    "R$ 0,00",
    "R$ 1,00",
    "R$ 1,00",
    "R$ 1.000,00",
    "R$ 1.000,00",
    "R$ 1.000.000,00",
    "R$ 1.000.000,00"
  ]);
});
