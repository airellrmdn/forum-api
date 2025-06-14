const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'id123',
      title: 'abc',
    };

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrow('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'id123',
      title: 123,
      owner: true,
    };

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrow('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createdThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'id-123',
      title: 'a thread',
      owner: 'usr123',
    };

    // Action
    const { id, title, owner } = new CreatedThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
  });
});
