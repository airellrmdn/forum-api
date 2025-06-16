const DetailsThread = require('../DetailsThread');

describe('a DetailsThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new DetailsThread(payload)).toThrow('DETAILS_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'a thread body',
      date: 2021,
      username: 'dicoding',
      comments: [],
    };

    // Action and Assert
    expect(() => new DetailsThread(payload)).toThrow('DETAILS_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailsThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'abc',
      body: 'a thread body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    // Action
    const { id, title, body, date, username, comments } = new DetailsThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
