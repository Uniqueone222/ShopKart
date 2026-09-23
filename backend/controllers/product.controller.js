import Product from "../models/product.model.js"

export const createProduct = async (req,res)=>{
    try {

        const {name,description,price,category,image,stock} = req.body
        
        if(!name || !description || !category || stock===null || price===null){
            res.status(400).json({message: " Invalid product details"})
        }

        if(price<=0) res.status(400).json({message: " Invalid Price"})
        if(stock<0) res.status(400).json({message: " Invalid Stock"})
        
        const product = await Product.create(req.body)

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

export const getProducts = async (req,res) =>{
    try {
        const products = await Product.find();
        res.status(200).json({
            success : true,
            count : products.length,
            products : products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}