import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../axiosCalls/axios.js'

function Profile() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    if (!user) return

    let active = true

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true)
        setOrdersError('')
        const response = await axiosInstance.get('/orders')
        if (active) setOrders(response.data.orders.slice(0, 3))
      } catch (error) {
        if (active) {
          setOrdersError(
            error.response?.data?.message || 'Unable to load your recent orders.'
          )
        }
      } finally {
        if (active) setOrdersLoading(false)
      }
    }

    fetchOrders()

    return () => {
      active = false
    }
  }, [user])

  if (!user) {
    return <main className="profile-page profile-loading">Loading profile...</main>
  }

  return (
    <main className="profile-page">
      <section className="profile-intro">
        <p className="eyebrow">Your account</p>
        <h1>Welcome, {user.fullName}</h1>
        <p>Keep your ShopKart details up to date and ready for your next order.</p>
        <Link className="primary-button profile-home-button" to="/home">
          Back to home <span aria-hidden="true">-&gt;</span>
        </Link>
      </section>

      <section className="profile-card" aria-labelledby="profile-details-title">
        <div className="profile-avatar" aria-hidden="true">
          {user.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-details">
          <div className="profile-card-heading">
            <div>
              <p className="eyebrow">Personal details</p>
              <h2 id="profile-details-title">Profile information</h2>
            </div>
            <span className="profile-status">Active</span>
          </div>
          <dl className="profile-fields">
            <div>
              <dt>Full name</dt>
              <dd>{user.fullName}</dd>
            </div>
            <div>
              <dt>Email address</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Phone number</dt>
              <dd>{user.phone}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="profile-orders" aria-labelledby="profile-orders-title">
        <div className="profile-orders-heading">
          <div>
            <p className="eyebrow">Your purchases</p>
            <h2 id="profile-orders-title">Recent orders</h2>
          </div>
          <Link className="profile-orders-link" to="/orders">
            View all orders <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>

        {ordersLoading ? (
          <p className="profile-orders-message">Loading recent orders...</p>
        ) : ordersError ? (
          <p className="profile-orders-message" role="alert">{ordersError}</p>
        ) : orders.length === 0 ? (
          <div className="profile-orders-empty">
            <p>You have not placed any orders yet.</p>
            <Link to="/products">Start shopping <span aria-hidden="true">-&gt;</span></Link>
          </div>
        ) : (
          <div className="profile-orders-list">
            {orders.map((order) => (
              <Link
                className="profile-order-item"
                key={order._id}
                to={`/orders/${order._id}`}
              >
                <span>
                  <strong>Order #{order._id.slice(-6)}</strong>
                  <small>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {' · '}
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </small>
                </span>
                <span className="profile-order-total">
                  <strong>₹{order.totalAmount}</strong>
                  <small>{order.status.replaceAll('_', ' ')}</small>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Profile