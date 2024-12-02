import * as FileSystem from "fs";
import * as Path from "path";
import { type Senior } from "~/utils/models.js";

export { FileSystem, Path };

const FOLDER_NAME = "romsenmgr";
export const DIR_PATH = Path.join(
  `${process.env.USERPROFILE || process.env.HOME}`,
  FOLDER_NAME
);

function _initDir() {
  console.log("[FILE SYSTEM] Initializing directory");
  try {
    const isPathExists = FileSystem.existsSync(DIR_PATH);
    console.log(`[FILE SYSTEM] ${DIR_PATH} exists: ${isPathExists}`);

    if (!isPathExists) {
      console.log(`[FILE SYSTEM] Creating ${DIR_PATH}`);
      FileSystem.mkdirSync(DIR_PATH, { recursive: true });
      console.log(`[FILE SYSTEM] Done`);
    }
  } catch (error) {
    throw error;
  }
}

export function retrieveFiles() {
  console.log("[FILE SYSTEM] Retrieving files");
  try {
    _initDir();
    const files = FileSystem.readdirSync(DIR_PATH);
    console.log(`[FILE SYSTEM] ${files.length} file(s) retrieved`);
    return files;
  } catch (error) {
    throw error;
  }
}

export function readFile(path: string): Senior {
  console.log(`[FILE SYSTEM] Reading file ${path}`);

  try {
    const raw = FileSystem.readFileSync(path, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    throw error;
  }
}

export function createFile(data: Senior) {
  console.log("[FILE SYSTEM] Creating file");
  try {
    _initDir();
    const stringed = JSON.stringify(data);
    const fileName = `${data.id}.json`;
    FileSystem.writeFileSync(Path.join(DIR_PATH, fileName), stringed);
  } catch (error) {
    throw error;
  }
}

export function updateFile(path: string, data: Senior) {
  console.log(`[FILE SYSTEM] Updating file ${path}`);
  try {
    const stringed = JSON.stringify(data);
    FileSystem.writeFileSync(path, stringed);
  } catch (error) {
    throw error;
  }
}

export function deleteFile(path: string) {
  console.log(`[FILE SYSTEM] Deleting ${path}`);

  try {
    FileSystem.rmSync(path);
  } catch (error) {
    throw error;
  }
}
