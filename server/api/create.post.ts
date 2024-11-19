import { createFile } from "~/utils/file-system";
import { Senior } from "~/utils/models";
import { generateId } from "~/utils/utils";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const id = generateId();
    const newSeniorData: Senior = {
      id: id,
      ...body,
    };

    createFile(newSeniorData);

    setResponseStatus(event, 200);
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
  }
});
