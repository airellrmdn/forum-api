const CreatedComment = require('../CreatedComment');

describe('a CreatedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'id123',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrow('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'id123',
      content: 123,
      owner: true,
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrow('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createdComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'id-123',
      content: 'a comment',
      owner: 'usr123',
    };

    // Action
    const { id, content, owner } = new CreatedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
