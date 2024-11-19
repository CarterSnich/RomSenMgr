import { DIR_PATH, Path, readFile, updateFile } from "~/utils/file-system";
import { Senior } from "~/utils/models";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { field, value } = await readBody<{
    field: keyof Senior;
    value: any;
  }>(event);

  try {
    const currentData = readFile(Path.join(DIR_PATH, `${id}.json`));
    const newData = { ...currentData };
    newData[field] = value;

    const path = Path.join(DIR_PATH, `${id}.json`);

    updateFile(path, newData);
  } catch (error) {
    throw error;
  }
});
