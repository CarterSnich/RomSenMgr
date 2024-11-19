import * as Path from "path";
import { DIR_PATH, readFile } from "~/utils/file-system";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  const path = Path.join(DIR_PATH, `${id}.json`);
  const data = readFile(path);

  return data;
});
