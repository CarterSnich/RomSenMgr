import * as FileSystem from "fs";
import * as Path from "path";
import { type Senior } from "~/utils/models.js";

export { FileSystem, Path };

export const DIR_PATH = Path.join(
  `${process.env.USERPROFILE || process.env.HOME}`,
  "romsenmgr"
);

function _initDir() {
  const dirPath = Path.dirname(DIR_PATH);
  if (!FileSystem.existsSync(dirPath)) {
    FileSystem.mkdirSync(dirPath, { recursive: true });
  }
}

export function retrieveFiles() {
  try {
    return FileSystem.readdirSync(DIR_PATH);
  } catch (error) {
    throw error;
  }
}

export function readFile(path: string): Senior {
  try {
    const raw = FileSystem.readFileSync(path, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    throw error;
  }
}

export function createFile(data: Senior) {
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
  try {
    const stringed = JSON.stringify(data);
    FileSystem.writeFileSync(path, stringed);
  } catch (error) {
    throw error;
  }
}

export function deleteFile(path: string) {
  try {
    FileSystem.rmSync(path);
  } catch (error) {
    throw error;
  }
}
