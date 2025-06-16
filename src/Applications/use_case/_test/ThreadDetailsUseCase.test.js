const ThreadDetailsUseCase = require('../ThreadDetailsUseCase');
const DetailsThread = require('../../../Domains/threads/entities/DetailsThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('ThreadDetailsUseCase', () => {
  it('should orchestrating get thread details action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const mockThreadDetails = new DetailsThread({
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2025-06-15T15:44:52.742Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
        },
      ]
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetailsById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadDetails));

    /** creating use case instance */
    const getThreadUseCase = new ThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadDetails = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetails).toStrictEqual(new DetailsThread({
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2025-06-15T15:44:52.742Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
        },
      ]
    }));
    expect(mockThreadRepository.getThreadDetailsById).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
