import { describe, it, expect } from 'vitest';
import { Entity } from './Entity';
import { UniqueEntityID } from './UniqueEntityID';

interface UserProps {
  name: string;
}

class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): User {
    return new User(props, id);
  }
}

describe('Entity', () => {
  it('should compare two entities with the same ID as equal', () => {
    const id = new UniqueEntityID('test-id');
    const user1 = User.create({ name: 'Alice' }, id);
    const user2 = User.create({ name: 'Bob' }, id); // Different props, same ID

    expect(user1.equals(user2)).toBe(true);
  });

  it('should compare two entities with different IDs as not equal', () => {
    const user1 = User.create({ name: 'Alice' });
    const user2 = User.create({ name: 'Alice' }); // Same props, different IDs

    expect(user1.equals(user2)).toBe(false);
  });
});
