import Product from "../models/product.model"

export const createProduct = async (req,res)=>{
    try {

        const {name,description,price,category,image,stock} = req.body
        
        if(!name || !description || !category || !stock || !price){
            res.status(400).json({message: " Invalid product details"})
        }

        if(price<=0) res.staus(400).json({message: " Invalid Price"})
        if(stock<0) res.staus(400).json({message: " Invalid Stock"})
        
        const product = Product.create(req.body)

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

