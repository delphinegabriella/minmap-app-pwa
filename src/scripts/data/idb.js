import { openDB } from "idb";

const DATABASE_NAME = 'story-app-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'stories';

export const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
        if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
            database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
        }
    }
});

export const saveStory = async (story) => {
    const db = await dbPromise;

    const storyWithId = {
        ...story,
        id: story.id || new Date().toISOString(),
    };
    console.log('SAVING STORY:', storyWithId);

    return db.put(OBJECT_STORE_NAME, storyWithId);

};

export const getAllStories = async () => {
    const db = await dbPromise;
    return db.getAll(OBJECT_STORE_NAME);
};

export const deleteStory = async (id) => {
    const db = await dbPromise;
    return db.delete(OBJECT_STORE_NAME, id);
};