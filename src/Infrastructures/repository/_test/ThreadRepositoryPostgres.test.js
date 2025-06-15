const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'dicoding thread',
        body: 'a thread body',
        owner: 'user-123'
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'dicoding thread',
        body: 'a thread body',
        owner: 'user-123'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'dicoding thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadDetailsById', () => {
    it('should throw InvariantError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadDetailsById('thread-123'))
        .rejects
        .toThrow(InvariantError);
    });

    it('should return thread details when thread is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({
        title: 'dicoding thread',
        body: 'a thread body',
      });

      // Action & Assert
      const threadDetails = await threadRepositoryPostgres.getThreadDetailsById('thread-123');
      expect(threadDetails).toStrictEqual({
        id: 'thread-123',
        title: 'dicoding thread',
        body: 'a thread body',
        date: '2025-06-14T15:11:47.561Z',
        owner: 'user-123',
      });
    });
  });

  describe('verifyThreadById function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.verifyThreadById('thread-123'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw NotFoundErrorr when thread is found', async () => {
      await ThreadsTableTestHelper.addThread({
        title: 'dicoding thread',
        body: 'a thread body',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadById('thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });
});