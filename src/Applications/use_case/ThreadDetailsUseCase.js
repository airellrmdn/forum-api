class ThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(usecasePayload) {
    const { threadId } = usecasePayload;
    const thread =  await this._threadRepository.getThreadDetailsById(threadId);
    const comment =  await this._commentRepository.getCommentByThreadId(threadId);

    thread.comments = comment.map((comment) => {
      if (comment.is_delete === true) {
        comment.content = '**komentar telah dihapus**';
      }
      return {
        id: comment.id,
        username:comment.username,
        date:comment.date,
        content:comment.content,
      };
    });

    return thread;
  }
}

module.exports = ThreadDetailsUseCase;
