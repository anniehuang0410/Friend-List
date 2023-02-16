const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users'
const FRIEND_PER_PAGE = 10

const dataPanel = document.querySelector('#data-panel')
const searchInput = document.querySelector('#search-input')
const searchButton = document.querySelector('#search-button')
const paginator = document.querySelector('#paginator')

const friends = JSON.parse(localStorage.getItem('closeFriend'))
let filteredFriend = []

// 呼叫朋友清單
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
              <button id="remove-friend" href="#" class="btn btn-danger" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  })

  dataPanel.innerHTML = rawHTML
}

// 計算分頁數量
function renderPaginator(number) {
  let numberOfPage = Math.ceil(number / FRIEND_PER_PAGE)
  let rawHTML = ''

  for (let pageNum = 1; pageNum <= numberOfPage; pageNum++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${pageNum}">${pageNum}</a></li>
  `

    paginator.innerHTML = rawHTML
  }
}

// 分頁功能啟動
function slicePages(pageNumber) {
  const startIndex = (pageNumber - 1) * FRIEND_PER_PAGE
  const endIndex = startIndex + FRIEND_PER_PAGE

  const filterData = filteredFriend.length ? filteredFriend : friends

  return filterData.slice(startIndex, endIndex)
}

// 移除摯友名單功能
function removeFriendFromCloseFriendList(id) {
  const selectedFriendIndex = friends.findIndex(friend => friend.id === id)
 
  friends.splice(selectedFriendIndex, 1)
  localStorage.setItem('closeFriend', JSON.stringify(friends))
  renderFriendList(friends)
}

// 搜尋關鍵字功能
function searchMyFriend() {
  const input = searchInput.value.trim().toLowerCase()

  filteredFriend = friends.filter((friend) => friend.name.toLowerCase().includes(input) || friend.surname.toLowerCase().includes(input))

  if (filteredFriend.length === 0) {
    alert(`Cannot find the search result with keyword '${input}'`)
  }

  const filterData = filteredFriend.length ? filteredFriend : friends

  renderPaginator(filterData.length)
  renderFriendList(slicePages(1))
}

// more 按鈕功能：顯示更多朋友資訊
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

// paginator 監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  const pageNumber = Number(event.target.dataset.page)

  renderFriendList(slicePages(pageNumber))
})

// more info 監聽器
dataPanel.addEventListener('click', function onPanelClick(event){
  // friend info modal 監聽器
  if(event.target.matches('#show-info')){
    showFriendDetail(Number(event.target.dataset.id))
  } 
  // remove from close friend list 監聽器
  else if (event.target.matches('#remove-friend')){
    removeFriendFromCloseFriendList(Number(event.target.dataset.id))
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

renderFriendList(slicePages(1))
renderPaginator(friends.length)