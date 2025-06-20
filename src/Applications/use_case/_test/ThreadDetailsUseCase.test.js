/* eslint-disable camelcase */
const ThreadDetailsUseCase = require('../ThreadDetailsUseCase');
const DetailsThread = require('../../../Domains/threads/entities/DetailsThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('ThreadDetailsUseCase', () => {
  it('should orchestrating get thread details action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const mockThread = new DetailsThread({
      id: 'thread-123',
      title: 'a thread',
      body: 'a thread body',
      date: '2025-06-15T15:44:52.742Z',
      username: 'dicoding',
    });
    const mockComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-_123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: true,
      }
    ];
    const mockThreadDetail = {
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
        {
          id: 'comment-_123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: '**komentar telah dihapus**',
        }
      ]
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetailsById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    /** creating use case instance */
    const getThreadUseCase = new ThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetails = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetails).toEqual(mockThreadDetail);
    expect(mockThreadRepository.getThreadDetailsById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
