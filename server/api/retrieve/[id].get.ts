import * as Path from "path";
import { DIR_PATH, readFile } from "~/utils/file-system";
import { getAgeFromDate } from "~/utils/utils";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  const path = Path.join(DIR_PATH, `${id}.json`);
  const data = readFile(path);
  data.age = getAgeFromDate(data.birthdate);

  return data;
});
