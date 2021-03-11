import axios from 'axios';
import Toastify from 'toastify-js'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCount = document.querySelector('#cartCount')

function updateCart(pizza, btn) {
    return axios.post('/update-cart', pizza).then(res => {
        if(res.data == 'unauthorized')
            return dangerToast('Login to add to cart')

        cartCount.innerText = res.data.totalQuantity
        let quantity = res.data.items[pizza._id].quantity
        btn.innerText = `+ ADD ${quantity}`
        successToast(`${pizza.name} added to cart`)
    })
}

addToCart.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza, btn)
    })
});



/*
  toast
*/
function infoToast(msg) {
    new Toastify({
        text: msg,
        newWindow: true,
        offset: {
            y: 60
        },
        className: 'bg-primary',
        stopOnFocus: true,
    }).showToast();
}
function successToast(msg) {
    new Toastify({
        text: msg,
        newWindow: true,
        offset: {
            y: 60
        },
        className: 'bg-success',
        stopOnFocus: true,
    }).showToast();
}
function dangerToast(msg) {
    new Toastify({
        text: msg,
        newWindow: true,
        offset: {
            y: 60
        },
        destination: '/login',
        className: 'bg-danger',
        backgroundColor: "linear-gradient(to right, #ff2323, #fb9e13)",
        stopOnFocus: true,
    }).showToast();
}