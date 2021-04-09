import got from "../../got-request";

const API_PREFIX = "creator-gui";
export async function apiGetUpdate<T>() {
  const { body } = await got.get<T>(`${API_PREFIX}/check-update`);
  return body;
}
