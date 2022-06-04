// remove historical keys
import {deleteItemFromStorage} from "../state/storage";

const LEGACY_STORAGES_KEYS_TO_DELETE = [
  'data-source',
  'pull-requests',
  'pull-requests-last-update',
  'filter-free-text',
  'filter-project',
  'filter-repository',
  'filter-author',
];

export function cleanupLegacyDataFromStorage() {
  LEGACY_STORAGES_KEYS_TO_DELETE.forEach(deleteItemFromStorage);
}