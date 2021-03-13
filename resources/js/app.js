import moment from 'moment';
import axios from 'axios';
import Toastify from 'toastify-js';

/*
  toast
*/
window.infoToast = function infoToast(msg) {
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
window.successToast = function successToast(msg) {
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
window.dangerToast = function dangerToast(msg) {
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
let currentUrl = window.location.pathname

// cart
if (currentUrl == '/cart') {
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
}

//order
let statuses = document.querySelectorAll('.status')
let orderInput = document.querySelector('#Order')
let Order = orderInput ? orderInput.value : null
Order = JSON.parse(Order)
function updateStatus(order) {
    statuses.forEach(status => {
        status.classList.remove('text-success')
        status.classList.remove('text-primary')
        status.classList.remove('font-weight-bold')
        status.childNodes[1].innerText = ''
    })

    let stepCompleted = true
    statuses.forEach(status => {
        let dataProp = status.dataset.status
        if(stepCompleted) {
            status.classList.add('text-success')
        }
        if(dataProp == order.status) {
            stepCompleted = false
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add('text-primary')
                status.nextElementSibling.classList.add('font-weight-bold')
                status.childNodes[1].innerText = moment(order.updatedAt).format('hh:mm A')
            }
        }
    })
}
updateStatus(Order)

//socket
let socket = io()
if(Order)
    socket.emit('join', `order_${Order._id}`)

socket.on('orderUpdated', (order) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = order.status
    updateStatus(updatedOrder)
    successToast('Order updated')
})
// admin js
if (currentUrl == '/admin/orders') {
    const ordersTableBody = document.querySelector('#ordersTableBody')
    let orders = []
    let markup
    
    axios.get('/admin/orders', {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    }).then(result => {
        orders = result.data
        markup = generateMarkup(orders)
        ordersTableBody.innerHTML = markup
    }).catch((err) => {
        console.log(err)
    });
    
    
    
    function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr>
                    <td>
                        <p>${order._id}</p>
                        <div>${renderItems(order.items)}</div>
                    </td>
                    <td>${order.customerId.name}</td>
                    <td>${order.address}</td>
                    <td>
                        <form action="/admin/orders/status" method="POST">
                            <input type="hidden" name="orderId" value="${order._id}"></input>
                            <select name="status" id="status" class="custom-select" onchange="updateStatus(this.form, this)">
                                <option value="order_placed" ${order.status == 'order_placed' ? 'selected' : ''}>Order placed</option>
                                <option value="order_accepted" ${order.status == 'order_accepted' ? 'selected' : ''}>Order accepted</option>
                                <option value="order_preparation" ${order.status == 'order_preparation' ? 'selected' : ''}>Order preparation</option>
                                <option value="order_out_for_delivery" ${order.status == 'order_out_for_delivery' ? 'selected' : ''}>Order out for delivery</option>
                                <option value="completed" ${order.status == 'completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </form>
                    </td>
                    <td>${moment(order.createdAt).format('hh:mm A')}</td>
                </tr>
            `
        }).join('')
    }
    
    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map(menuItem => {
            return `
                <p>${menuItem.item.name} - ${menuItem.quantity} pcs</p>
            `
        }).join('')
    }
}