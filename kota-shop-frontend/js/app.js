document.addEventListener('DOMContentLoaded', () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
  let sortOrder = 'asc';

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const itemForm = document.getElementById('itemForm');
  const inventoryList = document.getElementById('inventoryList');
  const searchInput = document.getElementById('searchInput');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        alert(`Logged in as ${username}`);
        window.location.href = 'main.html';
      } else {
        alert('Invalid username or password');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('signupUsername').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;

      users.push({ username, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert(`Registered with username: ${username}`);
      window.location.href = 'login.html';
    });
  }

  if (itemForm) {
    itemForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const itemName = document.getElementById('itemDropdown').value;
      const itemQuantity = document.getElementById('itemQuantity').value;
      const itemComment = document.getElementById('itemComment').value;

      const item = {
        id: Date.now(),
        name: itemName,
        quantity: itemQuantity,
        comment: itemComment,
        dateAdded: new Date().toISOString().split('T')[0],
        image: `images/${itemName.toLowerCase()}.jpg`
      };

      inventory.push(item);
      localStorage.setItem('inventory', JSON.stringify(inventory));
      displayInventory();
    });
  }

  function displayInventory() {
    inventoryList.innerHTML = '';
    const filteredInventory = inventory.filter(item => 
      item.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    filteredInventory.forEach(item => {
      const li = document.createElement('div');
      li.className = 'inventory-item';
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <strong>${item.name}</strong> - ${item.quantity}
          <p>${item.comment}</p>
          <p>Date Added: ${item.dateAdded}</p>
          <p>${checkExpiration(item.dateAdded)}</p>
        </div>
        <button class="btn" onclick="editItem(${item.id})">Edit</button>
        <button class="btn" onclick="deleteItem(${item.id})">Delete</button>
      `;
      inventoryList.appendChild(li);
    });
  }

  function checkExpiration(dateAdded) {
    const addedDate = new Date(dateAdded);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - addedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return 'Expired';
    } else if (diffDays > 5) {
      return 'Expiring soon';
    } else {
      return 'Fresh';
    }
  }

  window.editItem = function(id) {
    const item = inventory.find(item => item.id === id);
    if (item) {
      document.getElementById('itemDropdown').value = item.name;
      document.getElementById('itemQuantity').value = item.quantity;
      document.getElementById('itemComment').value = item.comment;
      deleteItem(id);
    }
  };

  window.deleteItem = function(id) {
    const index = inventory.findIndex(item => item.id === id);
    if (index !== -1) {
      inventory.splice(index, 1);
      localStorage.setItem('inventory', JSON.stringify(inventory));
      displayInventory();
    }
  };

  window.sortInventory = function(criteria, order) {
    inventory.sort((a, b) => {
      if (order === 'asc') {
        return a[criteria] > b[criteria] ? 1 : -1;
      } else {
        return a[criteria] < b[criteria] ? 1 : -1;
      }
    });
    displayInventory();
  };

  if (inventoryList) {
    displayInventory();
  }

  if (searchInput) {
    searchInput.addEventListener('input', displayInventory);
  }
});