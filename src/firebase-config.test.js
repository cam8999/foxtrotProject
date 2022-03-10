import { getPostIDs, getPostsByTag, getTopPosts } from "./firebase-config";

test('getPostIDs does not return undefined', () => {
    return getPostIDs().then(data => {
        expect(data).toBeDefined();
    });
});

test('getTopPosts does not return undefined', () => {
    return getTopPosts().then(data => {
        expect(data).toBeDefined();
    });
});

test('getPostsByTag does not return undefined', () => {
    return getPostsByTag('tag').then(data => {
        expect(data).toBeDefined();
    });
});