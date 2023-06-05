export interface IPage<TData> {
    data: Array<TData> | TData;
    last_page: number;
    current_page: number;
    current_elements: number;
    elements_per_page: number;
    total_elements: number;
}
