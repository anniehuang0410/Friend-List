const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users'

const dataPanel = document.querySelector('#data-panel')

const friends = []

function renderFriendList(data) {
  let rawHTML = ''

  data.forEach(item => {
    rawHTML += `
    <div class="col-sm-2 m-3">
      <div class="mb-3">
        <div class="card p-2">
          <img src="${item.avatar}" class="img-thumbnail card-img-top" alt="friend-avatar">
          <div class="card-body row">
            <div class="container d-flex justify-content-center">
             <h5 class="card-title" id="friend-name">${item.name + ' ' + item.surname}</h5> 
            </div>
            <button class="btn btn-secondary text-align-center" data-bs-toggle="modal" data-bs-target="#friendInfoModal">click for more info</button>
          </div>
        </div>
      </div>
    </div>
  `
  })

  dataPanel.innerHTML = rawHTML
}

axios.get(INDEX_URL)
.then(response => {
  friends.push(...response.data.results)
  renderFriendList(friends)
})