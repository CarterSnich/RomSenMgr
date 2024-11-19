import * as Path from "path";
import { DIR_PATH, readFile, retrieveFiles } from "~/utils/file-system";
import { Senior } from "~/utils/models";
import { getAgeFromDate } from "~/utils/utils";

export default defineEventHandler((_) => {
  const files = retrieveFiles();
  const seniorData: Senior[] = [];

  files.forEach((file) => {
    const data = readFile(Path.join(DIR_PATH, file));
    data.age = getAgeFromDate(data.birthdate);
    seniorData.push(data);
  });

  return seniorData;
});
