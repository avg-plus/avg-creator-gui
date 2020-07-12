import got from "../../../common/got-request";

export async function apiGetManifest<T>() {
  const { body } = await got.get<T>(`bundle-update/manifest`);

  return body;
}
