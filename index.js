const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users'

const dataPanel = document.querySelector('#data-panel')
const searchInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-button')

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
             <h5 class="card-title mb-2" id="friend-name">${item.name + ' ' + item.surname}</h5> 
            </div>
            <div class="d-flex justify-content-around footer">
              <button id="show-info" href="#" class="btn btn-secondary " data-bs-toggle="modal" data-bs-target="#friendInfoModal" data-id="${item.id}">more info</button>
              <button id="add-as-close-friend" href="#" class="btn btn-primary" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  })

  dataPanel.innerHTML = rawHTML
}

function searchMyFriend() {
  const input = searchInput.value.trim().toLowerCase()
  let filteredFriend = []
  
  filteredFriend = friends.filter((friend) => friend.name.toLowerCase().includes(input) || friend.surname.toLowerCase().includes(input))

  if(filteredFriend.length === 0){
    alert(`Cannot find the search result with keyword '${input}'`)
  }

  const filterData = filteredFriend.length === 0 ? friends : filteredFriend

  renderFriendList(filterData)
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

// friend info modal 監聽器
dataPanel.addEventListener('click', function onPanelClick(event){
  if (event.target.matches('#show-info')){
    showFriendDetail(Number(event.target.dataset.id))
  }
})

// search button 監聽器
searchButton.addEventListener('click', function onSearchButtonClicked(event){
  event.preventDefault()
  searchMyFriend()
})

// search input enter 監聽器
searchInput.addEventListener('keydown', function onSearchInputEntered(event){
  if (event.key === 'Enter') {
    event.preventDefault()
    searchMyFriend()
  }
})

axios.get(INDEX_URL)
.then(response => {
  friends.push(...response.data.results)
  renderFriendList(friends)
})