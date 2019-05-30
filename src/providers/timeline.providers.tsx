export default class API {
  static getEvents(): Promise<Response> {
    return fetch("https://storage.googleapis.com/dito-questions/events.json", {
      method: "GET",
      headers: {},
      cache: "default"
    });
    // return fetch("http://192.168.0.14:8080/events.json", {
    //   method: "GET",
    //   headers: {},
    //   cache: "default"
    // });
  }
}
