import type { Score21State } from "../domain/scoring/score21Engine";
import type { StandardState } from "../domain/scoring/standardEngine";
import { deleteFromStore, readFromStore, STORE_ACTIVE_MATCH, writeToStore } from "./indexedDb";

const ACTIVE_SCORE21_KEY = "score21";
const ACTIVE_STANDARD_KEY = "standard";

export async function loadActiveScore21Match(): Promise<Score21State | null> {
  return readFromStore<Score21State>(STORE_ACTIVE_MATCH, ACTIVE_SCORE21_KEY);
}

export async function saveActiveScore21Match(match: Score21State): Promise<void> {
  await writeToStore(STORE_ACTIVE_MATCH, match, ACTIVE_SCORE21_KEY);
}

export async function clearActiveScore21Match(): Promise<void> {
  await deleteFromStore(STORE_ACTIVE_MATCH, ACTIVE_SCORE21_KEY);
}

export async function loadActiveStandardMatch(): Promise<StandardState | null> {
  return readFromStore<StandardState>(STORE_ACTIVE_MATCH, ACTIVE_STANDARD_KEY);
}

export async function saveActiveStandardMatch(match: StandardState): Promise<void> {
  await writeToStore(STORE_ACTIVE_MATCH, match, ACTIVE_STANDARD_KEY);
}

export async function clearActiveStandardMatch(): Promise<void> {
  await deleteFromStore(STORE_ACTIVE_MATCH, ACTIVE_STANDARD_KEY);
}
