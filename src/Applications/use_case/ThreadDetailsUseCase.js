class ThreadDetailsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(usecasePayload) {
    const { threadId } = usecasePayload;
    return this._threadRepository.getThreadDetailsById(threadId);
  }
}

module.exports = ThreadDetailsUseCase;
