import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import dns from 'dns'
import cookieParser from 'cookie-parser'
import customerRoutes from './routes/customer.route.js'
import cors from 'cors'
import productRoutes from './routes/product.route.js'
import wishlistRoutes from './routes/wishlist.route.js'
import cartRoutes from './routes/cart.route.js'
import orderRoutes from './routes/order.route.js'
const app = express()
const Port = 8085

dns.setServers([
  '8.8.8.8', // Google DNS
  '8.8.4.4'
]);

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))
app.use('/users', customerRoutes)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
mongoose.connect(process.env.dbUrl).then(() => {
    console.log("Db Connected")
}).catch((err) => {
    console.log(err)
})


app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(Port , ()=>{
    console.log(`Server Started at ${Port}`)
})
