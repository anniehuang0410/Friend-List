const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users'

const dataPanel = document.querySelector('#data-panel')

const friends = []

// 函式：呼叫朋友清單
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
            <button id="show-info" class="btn btn-secondary text-align-center" data-bs-toggle="modal" data-bs-target="#friendInfoModal" data-id="${item.id}">click for more info</button>
          </div>
        </div>
      </div>
    </div>
  `
  })

  dataPanel.innerHTML = rawHTML
}

function showFriendDetail(id) {
  const ModalName = document.querySelector('#friend-modal-name')
  const ModalAvatar = document.querySelector('#friend-modal-avatar')  
  const ModalGender = document.querySelector('#friend-modal-gender') 
  const ModalBdayAge = document.querySelector('#friend-modal-bday-age') 
  const ModalRegion = document.querySelector('#friend-modal-region') 
  const ModalEmail = document.querySelector('#friend-modal-email') 
  const ModalUpdate = document.querySelector('#friend-modal-update') 
  
  axios.get(INDEX_URL + '/' + id)
  .then(response => {
    const data = response.data
    
    ModalName.innerText = data.name + ' ' + data.surname
    ModalGender.innerText = data.gender
    ModalBdayAge.innerText = data.birthday + ' (age: ' + data.age + ')'
    ModalRegion.innerText = 'From: ' + data.region
    ModalEmail.innerText = 'Contact: ' + data.email
    ModalAvatar.innerHTML = `
      <img src=${data.avatar} alt="Friend-avatar">
    `

    ModalUpdate.innerText = 'Last updated date: ' + data.updated_at.slice(0, data.updated_at.indexOf('T'))
  })
}

// friend info 監聽器
dataPanel.addEventListener('click', function onPanelClick(event){
  if (event.target.matches('#show-info')){
    showFriendDetail(Number(event.target.dataset.id))
  }
})

axios.get(INDEX_URL)
.then(response => {
  friends.push(...response.data.results)
  renderFriendList(friends)
})