const NewComment = require('../../../Domains/comments/entities/NewComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'a comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'a comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: 'a comment',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment when comment is found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const id = 'comment-123';
      await CommentsTableTestHelper.addComment({ id, content: 'a comment' });

      // Action & Assert
      await commentRepositoryPostgres.deleteCommentById(id);
      const comment = await CommentsTableTestHelper.findCommentsById(id);
      expect(comment[0].is_delete).toEqual(true);
    });

    it('should throw NotFoundError when delete not found comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const id = 'comment-123';

      // Action & Assert
      return expect(commentRepositoryPostgres.deleteCommentById(id))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return all thread comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ content: 'a comment' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      const comment = await commentRepositoryPostgres.getCommentByThreadId('thread-123');
      expect(comment).toHaveLength(1);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when owner is different', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ content: 'a comment' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-125')).rejects.toThrow(AuthorizationError);
    });

    it('should throw NotFoundError when comment not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .rejects
        .toThrow(NotFoundError);
    });

    it('should not throw AuthorizationError when owner is correct', async () => {
      await CommentsTableTestHelper.addComment({ content: 'a comment' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });
});