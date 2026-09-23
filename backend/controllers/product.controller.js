import Product from "../models/product.model.js"

export const createProduct = async (req,res)=>{
    try {

        const {name,description,price,category,image,stock} = req.body
        
        if(!name || !description || !category || stock===null || price===null || !image){
            return res.status(400).json({message: " Invalid product details"})
        }
        if(price<=0) return res.status(400).json({message: " Invalid Price"})
        if(stock<0) return res.status(400).json({message: " Invalid Stock"})
        
        const product = await Product.create({...req.body,category: category.toLowerCase()});

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

export const getProducts = async (req,res) =>{
    try {
        const { search, category } = req.query;

        const query = {};

        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            query.category = category.toLowerCase();
        }


        const products = await Product.find(query);
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

export const getProductById = async (req,res)=>{
    try {  

        const {id} = req.params
        const product = await Product.findById(id)

        if(!product) res.status(404).json({message:"Product not Found"})
        
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({
            message: "Invalid product ID"
        });
    }
}