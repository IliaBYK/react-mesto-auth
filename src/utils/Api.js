class Api {
  constructor(options) {
    this._url = options.url;
    this._headers = options.headers;
  }

  _checkDataResponse(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }

  _getResponse(url, options) {
    return fetch(url, options).then(this._checkDataResponse);
  }

  getInitialCards() {
    return this._getResponse(this._url + '/cards', {
      headers: this._headers
    })
  }

  getServerUserInfo() {
    return this._getResponse(this._url + '/users/me', {
      headers: this._headers
    })
  }

  setServerUserInfo(inputs) {
    return this._getResponse(this._url + '/users/me', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: inputs.name,
        about: inputs.about
      })
    })
  }

  postServerCard(inputs) {
    return this._getResponse(this._url + '/cards', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: inputs.name,
        link: inputs.link
      })
    })
  }

  deleteCard(cardId) {
    return this._getResponse(this._url + '/cards/' + cardId, {
      method: 'DELETE',
      headers: this._headers,
    })
  }

  changeLikeCardStatus(cardId, isLiked) {
    if(isLiked) {
      return this._getResponse(this._url + '/cards/' + cardId + '/likes', {
        method: 'PUT',
        headers: this._headers,
      })
    }
    return this._getResponse(this._url + '/cards/' + cardId + '/likes', {
      method: 'DELETE',
      headers: this._headers,
    })
  }

  setUserAvatar(inputs) {
    return this._getResponse(this._url + '/users/me/avatar', {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: inputs.avatar
      })
    })
  }
}

const api = new Api({
  url: 'https://mesto.nomoreparties.co/v1/cohort-52',
  headers: {
    authorization: '42488cc5-fe94-4fe0-b1f0-0d91c1eb8880',
    'Content-Type': 'application/json'
  }
});

export default api;
