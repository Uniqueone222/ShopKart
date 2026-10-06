import express from 'express'
import { isAuthenticated } from '../middleware/auth.middleware.js'
import { addToCart, getCart, removeFromCart, updateQuantity } from '../controllers/cart.controller.js'


const cartRoutes = express.Router()

cartRoutes.get('/',isAuthenticated,getCart)
cartRoutes.post('/:productId',isAuthenticated,addToCart)
cartRoutes.patch('/:productId' , isAuthenticated, updateQuantity)
cartRoutes.delete('/:productId', isAuthenticated, removeFromCart)
export default cartRoutes