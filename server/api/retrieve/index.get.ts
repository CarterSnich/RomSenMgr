import * as Path from "path";
import { DIR_PATH, readFile, retrieveFiles } from "~/utils/file-system";
import { Senior } from "~/utils/models";

export default defineEventHandler((_) => {
  const files = retrieveFiles();
  const seniorData: Senior[] = [];

  files.forEach((file) => {
    const data = readFile(Path.join(DIR_PATH, file));
    seniorData.push(data);
  });

  return seniorData;
});
