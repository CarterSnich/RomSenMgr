import { DIR_PATH, Path, deleteFile } from "~/utils/file-system";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  try {
    const path = Path.join(DIR_PATH, `${id}.json`);
    deleteFile(path);
    setResponseStatus(event, 200);
  } catch (error) {
    setResponseStatus(event, 500);
  }
});
