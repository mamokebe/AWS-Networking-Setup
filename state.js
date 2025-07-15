// ========================= state.js =========================
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs';
const STATE_FILE = './vpc-state.json';

export function saveState(newData) {
  const data = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE)) : {};
  const merged = { ...data, ...newData };
  writeFileSync(STATE_FILE, JSON.stringify(merged, null, 2));
}

export function loadState() {
  return existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE)) : {};
}

export function clearState() {
  if (existsSync(STATE_FILE)) unlinkSync(STATE_FILE);
}