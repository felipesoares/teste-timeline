import { any } from "prop-types";

// Função que remove registros duplicados de um vetor de objetos conforme o atributo informado
const getUnique = (arr, comp) => {
  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e])
    .map(e => arr[e]);

  return unique;
};

// Função que remove acentos de uma string
const removeAccents = s => {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, "");
};

// Função que ordena um vetor de objetos conforme o atributo informado
const sort = (arr, attribute) => {
  return arr.sort((a, b) => {
    let c = removeAccents(a[attribute]).toLowerCase();
    let d = removeAccents(b[attribute]).toLowerCase();
    if (c < d) return -1;
    if (c > d) return 1;
    return 0;
  });
};

// Função que filtra um vetor de objetos conforme o termo pesquisado
const filter = (q, arr, attribute) => {
  q = removeAccents(q).toLowerCase();

  return arr.filter(
    item =>
      removeAccents(item[attribute])
        .toLowerCase()
        .indexOf(q) != -1
  );
};

const formatMoney = (number, places, symbol, thousand, decimal) => {
  places = !isNaN((places = Math.abs(places))) ? places : 2;
  symbol = symbol !== undefined ? symbol : "$";
  thousand = thousand || ",";
  decimal = decimal || ".";
  let negative: any = number < 0 ? "-" : "";
  let i: any =
    parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + "";
  let j: any;
  j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    symbol +
    negative +
    (j ? i.substr(0, j) + thousand : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
    (places
      ? decimal +
        Math.abs(number - i)
          .toFixed(places)
          .slice(2)
      : "")
  );
};

export default { getUnique, removeAccents, sort, filter, formatMoney };
