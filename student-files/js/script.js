let employeeCards = [];
const search = document.querySelector('.search-container');
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');

/* HTML */
const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;
search.insertAdjacentHTML('beforeend', searchHTML);

//fetch data
async function getData() {
    try {
        const response = await fetch('https://randomuser.me/api/?nat=us&results=12');
        if(!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        employeeCards = data.results;
        displayEmployees(data.results);
    } catch (error) {
        console.log('Looks like there is an error', error);
    }
    
}

//makes sure only clicks on the card are targeted
//find a card that matches the name

gallery.addEventListener('click', (e) => {
    const currentValue = e.target.closest('.card'); //returns clicked card

    //currentValue.children[1].children[0].textContent -> gives the name
    if(currentValue) {
        employeeName = currentValue.children[1].children[0].textContent;
        
        const similarEmployee = employeeCards.find(employee => `${employee.name.first} ${employee.name.last}` === employeeName);
        //console.log(similarEmployee);
        displayEmployeeModal(similarEmployee);
    } else {
        return;
    }
});



//const overlay = document.querySelector('.overlay');

function displayEmployeeModal (card) {
    
    console.log(card);
    const modelHTML = `
        <div class="modal-container" data-index="${employeeCards.indexOf(card)}">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${card.picture.thumbnail}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${card.name.first} ${card.name.last}</h3>
                    <p class="modal-text">${card.email}</p>
                    <p class="modal-text cap">${card.location.city}</p>
                    <hr>
                    <p class="modal-text">${formatCell(card.cell)}</p>
                    <p class="modal-text">${card.location.street.number} ${card.location.street.name}, ${card.location.city}, ${card.location.state}, ${card.location.postcode}</p>
                    <p class="modal-text">Birthday: ${formatDOB(card.dob.date)}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    body.insertAdjacentHTML('beforeend', modelHTML);
    const currentValue = body.querySelector('.modal-container');
    //close modal when user clicks the X or button
    document.addEventListener('click', e => {
        if(e.target.className === 'modal-close-btn' || e.target.innerText === 'X') {
            currentValue.remove();
        }

        //close the modal when user clicks outside the modal
        if(e.target.className === 'modal-container') {
            const isOutside = !e.target.closest('.modal-info-container');
            
            if(isOutside) {
                currentValue.remove();
            }
        } 
    });

    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
          currentValue.remove();
        }
      });

}




document.addEventListener('click', e => {
    if(e.target.closest('.modal-prev')) {
        const prevButton = document.getElementById('modal-prev');
        const nextButton = document.querySelector('#modal-next');
        const cards = document.querySelectorAll('.card');
        
        const modelCont = document.querySelector('.modal-container');
        const currentIndex = +modelCont.dataset.index;
        const currentCardName = cards[currentIndex].querySelector('h3').textContent;
        const previousCardName = cards[currentIndex-1].querySelector('h3').textContent;
        
        const sameEmployee = employeeCards.find(employee => `${employee.name.first} ${employee.name.last}` === previousCardName);
        displayEmployeeModal(sameEmployee);
        // if(currentIndex === 0) {
        //     //cards[currentIndex].remove();
        //     currentIndex = cards.length - 1;
        //     displayEmployeeModal(cards[currentIndex]);
            
        // } 
        
    }
});

function formatCell (phoneString) {
    const cleaned = ('' + phoneString).replace(/\D/g, '');
    if(cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
    }   
}

function formatDOB (dob) {
    const cleaned = ('' + dob).replace(/\D/g, '');
    const date = cleaned.substring(0,8);
    return date.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
}

//search functionality

search.addEventListener('keyup', e => {
    let currentValue = e.target.value.toLowerCase();
    let employees = document.querySelectorAll('h3.card-name');

    employees.forEach(employee => {
        if(employee.textContent.toLowerCase().includes(currentValue)) {
            employee.parentNode.parentNode.style.display = 'block';
        } else {
            employee.parentNode.parentNode.style.display = 'none';
        }
    });
});

function displayEmployees(data) {
    data.map(item => {
        const galleryHTML = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${item.picture.thumbnail}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${item.name.first} ${item.name.last}</h3>
                <p class="card-text">${item.email}</p>
                <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
            </div>
        </div>
        `;
        gallery.insertAdjacentHTML('beforeend', galleryHTML);
    });

}
getData();

