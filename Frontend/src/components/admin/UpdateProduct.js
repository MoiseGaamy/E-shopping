import React,{Fragment,useEffect,useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { updateProduct,productDetailAction, clearError } from '../../actions/productActions.js';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstant.js';
import { useParams} from 'react-router-dom';

const UpdateProduct = () =>
{   
    const { id } = useParams();
    const [name,setName] = useState('')
    const [price, setPrice] = useState(0); 
    const [description, setDescription] = useState(''); 
    const [category, setCategory] = useState(''); 
    const [stock, setStock] = useState(0); 
    const [seller, setSeller] = useState(''); 
    const [images, setImages] = useState([]); 
    const [imagesPreview, setImagesPreview] = useState([]); 
    const [oldimages, setOldimages] = useState([])
   


    const categories = [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                 'Home'
    ]


    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error: updateError, isUpdated } = useSelector(state => state.deleteProduct);
    const { error, product } = useSelector(state => state.productDetail);


     useEffect(() =>
     {     
         if (product && product._id !== id)
         {
             dispatch(productDetailAction(id))
         } else
         {
             setName(product.name)
             setPrice(product.price)
             setDescription(product.description)
             setCategory(product.category)
             setSeller(product.seller)
             setStock(product.stock)
             setOldimages(product.images)
         }
        if (error)
        {
            alert.error(error)
            dispatch(clearError())
         }
         if (updateError)
         {
             alert.error(updateError);
             dispatch(clearError())
         }
        if (isUpdated)
        {
            navigate('/admin/products')
            alert.success('product updated successfully');
            dispatch({type:UPDATE_PRODUCT_RESET})
        }
    }, [dispatch, alert, error,navigate,isUpdated,updateError,product,id])
      const handleSubmit = (e) =>
    {
        e.preventDefault();
           
        // const formData = new FormData()
        // formData.append('name',name)
        // formData.append('email',price)
        // formData.append('description',description)
        // formData.append('category',category)
        // formData.append('stock',stock)
        // formData.append('seller',seller)
         const productObj = { name, price, description, category, stock, seller}
         
         images.forEach(image =>
         {
             productObj.images = image;
         })
        console.log(productObj)
        dispatch(updateProduct(id,productObj))
        
    }
    const onChange = (e) =>
    {
        const files = Array.from(e.target.files)
          
        setImagesPreview([])
        setImages([])
        setOldimages([])

        files.forEach(file =>
        {
             const reader = new FileReader()
             
            reader.onload = () =>
            {
                if (reader.readyState === 2)
                {
                    setImagesPreview((oldArray)=> [...oldArray,reader.result])
                    setImages((oldArray)=>[...oldArray,reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
           
        
        
    }
   

  return (
    <Fragment>
          <div className='row'>
              <div className='col-12 col-md-2'>
                  <Sidebar />
              </div>
              <div className='col-12 col-md-10'>
                  <Fragment>
                         <div className="container container-fluid">
                    <div className="wrapper my-5"> 
                    <form className="shadow-lg"  onSubmit={handleSubmit}>
                        <h1 className="mb-4">New Product</h1>

                        <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="form-control"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price_field">Price</label>
                            <input
                            type="text"
                            id="price_field"
                            className="form-control"
                           value={price}
                            onChange={(e)=>setPrice(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description_field">Description</label>
                             <textarea className="form-control" id="description_field" rows="8" value={description} onChange={(e) =>setDescription(e.target.value)}></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category_field">Category</label>
                            <select className="form-control" id="category_field" value={category} onChange={(e)=>setCategory(e.target.value)}>
                               
                               {categories.map((category)=>(
                                
                                   <option key={category} value={category}>{category}</option>
                               ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="stock_field">Stock</label>
                            <input
                            type="number"
                            id="stock_field"
                            className="form-control"
                           value={stock}
                            onChange={(e)=>setStock(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="seller_field">Seller Name</label>
                            <input
                            type="text"
                            id="seller_field"
                            className="form-control"
                           value={seller}
                            onChange={(e)=>setSeller(e.target.value)}
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label>Images</label>
                            
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='customFile'
                                        multiple
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Images
                                    </label>
                                    
                                     {oldimages && oldimages.map(old=>(<img key={old} alt="old" src={old.url} className="mt-3 mr-2" width="55" height="52" />))}     
                                    {imagesPreview.map(imagePreview=>(
                                    <img src={imagePreview} alt="preview" key={imagePreview} className="mt-3 mr-2" width="55" height="52"/>))}
                                    
                                </div>
                        </div>

            
                        <button
                        id="login_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={loading ? true : false}
                        >
                        CREATE
                        </button>

                    </form>
                </div>
</div>
                      
                  </Fragment>
              </div>
          </div>
    </Fragment>
  )
}

export default UpdateProduct