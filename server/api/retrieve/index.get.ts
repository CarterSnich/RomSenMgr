import * as Path from "path";
import { DIR_PATH, readFile, retrieveFiles } from "~/utils/file-system";
import { Senior } from "~/utils/models";
import { getAgeFromDate } from "~/utils/utils";

export default defineEventHandler((_) => {
  try {
    const files = retrieveFiles();
    const seniorData: Senior[] = [];

    files.forEach((file) => {
      try {
        const data = readFile(Path.join(DIR_PATH, file));
        data.age = getAgeFromDate(data.birthdate);
        seniorData.push(data);
      } catch (error) {
        console.log(`[API] [GET /api/] ${error}`);
      }
    });

    return seniorData;
  } catch (error) {
    console.log(`[API] [GET /api/] ${error}`);
    setResponseStatus(_, 500, error as string);
  }
});
