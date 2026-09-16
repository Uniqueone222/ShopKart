import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { user } = useAuth()

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
    </main>
  )
}

export default Profile