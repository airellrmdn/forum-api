const NewAuthentication = require('../../Domains/authentications/entities/NewAuth');
const UserLogin = require('../../Domains/users/entities/UserLogin');

class LoginUserUseCase {
  constructor({ userRepository, authenticationRepository, passwordHash, authenticationTokenManager }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._passwordHash = passwordHash;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(usecasePayload) {
    const userLogin = new UserLogin(usecasePayload);
    const encryptedPassword = await this._userRepository.getPasswordByUsername(userLogin.username);

    await this._passwordHash.comparePassword(userLogin.password, encryptedPassword);

    const id = await this._userRepository.getIdByUsername(userLogin.username);
    const accessToken = await this._authenticationTokenManager.createAccessToken({ username: userLogin.username, id });
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({ username: userLogin.username, id });

    await this._authenticationRepository.addToken(refreshToken);
    const newAuthentication = new NewAuthentication({ accessToken, refreshToken });

    return newAuthentication;
  }
}

module.exports = LoginUserUseCase;
