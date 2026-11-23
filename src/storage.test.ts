import { describe, expect, it } from 'vitest';
import { createFavorite, createGroup } from './storage';

describe('storage factories', () => {
  it('creates a favorite with a stable local shape', () => {
    const favorite = createFavorite('Jira', 'https://jira.example.com', 'work');

    expect(favorite).toMatchObject({
      name: 'Jira',
      url: 'https://jira.example.com',
      groupId: 'work',
      pinned: false,
    });
    expect(favorite.id).toEqual(expect.any(String));
    expect(favorite.createdAt).toEqual(expect.any(String));
    expect(favorite.updatedAt).toEqual(expect.any(String));
  });

  it('creates an ordered group', () => {
    expect(createGroup('Trabalho', 2)).toEqual({
      id: expect.any(String),
      name: 'Trabalho',
      position: 2,
    });
  });
});
