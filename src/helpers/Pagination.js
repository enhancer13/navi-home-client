import ajaxRequest from './AjaxRequest';

export default class Pagination {
  #baseUrl;
  #sortFieldName;
  #searchFieldName;
  #extraSearchCondition;
  #currentPage = 1;
  #lastPage = 1;

  constructor({baseUrl, sortFieldName, searchFieldName, extraSearchCondition = ''}) {
    this.#baseUrl = baseUrl;
    this.#sortFieldName = sortFieldName;
    this.#searchFieldName = searchFieldName;
    this.#extraSearchCondition = extraSearchCondition;
  }

  #urlBuilder = (searchValue, page, size) => {
    return `${this.#baseUrl}?page=${page}&size=${size}&sort=${this.#sortFieldName},desc&${this.#searchFieldName}=${searchValue}${
      this.#extraSearchCondition
    }&equal=false`;
  };

  /*
   * "current_elements":18,
   * "current_page":1,
   * "data":[]
   * "elements_per_page":18,
   * "last_page":3,
   * "total_elements":40
   * */
  fetchPage = async (callback, searchValue = '', page = 1, size = 30) => {
    const response = await ajaxRequest.get(this.#urlBuilder(searchValue, page, size));
    this.#currentPage = response.current_page;
    this.#lastPage = response.last_page;
    callback(response, this.#currentPage);
  };

  fetchNextPage = async (callback, searchValue) => {
    if (this.#currentPage < this.#lastPage) {
      await this.fetchPage(callback, searchValue, this.#currentPage + 1);
    }
  };
}
