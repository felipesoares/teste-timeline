import React, { useState, useEffect } from "react";

import styles from "./Home.module.scss";

import fn from "./../../utils/functions";

import API from "./../../providers/timeline.providers";

import moment from "moment";
import "moment/locale/pt-br";

export function HomePage(props) {
  const [results, setResults] = useState(); // Apresenta os resultados na Timeline
  const [feedback, setFeedback] = useState("Carregando eventos..."); // Feedback ao usuário

  useEffect(() => {
    getEvents(); // Ao montar o componente, buscar a lista de eventos
  }, []);

  // Método para consumir a lista de eventos da API em formato JSON
  function getEvents() {
    API.getEvents()
      .then(function(response) {
        if (response.ok) {
          var contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(function(json) {
              // console.log(json.events);

              let transactions = filterEventsComprou(json.events);
              transactions = filterEventsComprouProduto(
                json.events,
                transactions
              );

              // console.log(transactions);

              setResults(fn.sort(transactions, "timestamp").reverse()); // Reordena e apresenta as transações pelo timestamp em ordem decrescente (do mais recente para o mais antigo)
              setFeedback("Nenhum resultado encontrado"); // Muda o feedback padrão para o usuário quando o método não retornar dados
            });
          } else {
            setFeedback(`Formato inválido na resposta da requisição :(`);
          }
        } else {
          setFeedback(`Bad request :(`); // Erro na requisição.
        }
      })
      .catch(function(error) {
        setFeedback(`Erro ao tentar processar a requisição :(`); // Erro na requisição.
      });
  }

  // Método para agrupar as transações do tipo de evento 'comprou'
  function filterEventsComprou(events) {
    return events
      .filter(x => x.event == "comprou") // realiza o filtro pelo tipo de evento
      .map(x => {
        // para cada registro:
        x.transaction_id = x.custom_data.filter(
          y => y.key == "transaction_id"
        )[0].value; // pega o valor do id da transação da propriedade 'custom_data'
        x.store_name = x.custom_data.filter(
          y => y.key == "store_name"
        )[0].value; // pega o nome da loja da propriedade 'custom_data'
        x.products = []; // inicializa um vetor de produtos vazio para cada transação
        delete x.event; // remove a propriedade 'event'
        delete x.custom_data; // remove a propriedade 'custom_data'
        return x;
      }); // retorna o vetor de transações
  }

  // Método para agrupar os produtos do tipo de evento 'comprou-produto'
  function filterEventsComprouProduto(events, transactions) {
    events
      .filter(x => x.event == "comprou-produto") // realiza o filtro pelo tipo de evento
      // para cada registro:
      .map(x => {
        let transaction_id = x.custom_data.filter(
          y => y.key == "transaction_id"
        )[0].value; // pega o valor do id da transação da propriedade 'custom_data'
        let product_name = x.custom_data.filter(y => y.key == "product_name")[0]
          .value; // pega o nome do produto da propriedade 'custom_data'
        let product_price = x.custom_data.filter(
          y => y.key == "product_price"
        )[0].value; // pega o preço do produto da propriedade 'custom_data'
        let newProduct = {
          timestamp: x.timestamp,
          product_name: product_name,
          product_price: product_price
        }; // cria um novo objeto com as informações do produto
        transactions
          .filter(y => y.transaction_id == transaction_id) // realiza o filtro no vetor de transações conforme o id
          .map(z => z.products.push(newProduct)); // adiciona o produto no vetor de transações
      });
    return transactions; // retorna o vetor de transações atualizado com os produtos
  }

  return (
    <main className={"main " + styles.home}>
      <div className={styles.results}>
        {results && results.length ? (
          results.map((item, index) => (
            <div key={item.transaction_id} className={styles.itens}>
              <div className={styles.transacao}>
                <span>
                  <i className={"icon icon-calendar"} />
                  {moment(item.timestamp).format("DD/MM/YYYY")}
                </span>
                <span>
                  <i className={"icon icon-clock"} />
                  {moment(item.timestamp).format("HH:mm")}
                </span>
                <span>
                  <i className={"icon icon-place"} />
                  {item.store_name}
                </span>
                <span>
                  <i className={"icon icon-money"} />
                  {fn.formatMoney(item.revenue, 2, "R$ ", ".", ",")}
                </span>
              </div>
              <ul className={styles.produtos}>
                <li className={styles.item}>
                  <div className={styles.gridContainer}>
                    <div className={styles.gridItem}>
                      <span>
                        <strong>Produto</strong>
                      </span>
                    </div>
                    <div className={styles.gridItem}>
                      <span>
                        <strong>Preço</strong>
                      </span>
                    </div>
                  </div>
                </li>

                {item.products && item.products.length ? (
                  item.products.map((subItem, index2) => (
                    <li key={subItem.timestamp} className={styles.item}>
                      <div className={styles.gridContainer}>
                        <div className={styles.gridItem}>
                          <span className={styles.product_name}>
                            {subItem.product_name}
                          </span>
                        </div>
                        <div className={styles.gridItem}>
                          <span className={styles.product_price}>
                            {fn.formatMoney(
                              subItem.product_price,
                              2,
                              "R$ ",
                              ".",
                              ","
                            )}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className={styles.item}>{feedback}</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <div>{feedback}</div>
        )}
      </div>
    </main>
  );
}
export default HomePage;
