import React,{Fragment,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { MDBDataTable } from "mdbreact";
import Loader from '../layouts/Loader.js';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { getAdminProducts, clearError, deleteProduct } from '../../actions/productActions.js';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstant.js';
const ProductList = () =>
{
    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, products } = useSelector((state) => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.deleteProduct);

    useEffect(() =>
    {
        dispatch(getAdminProducts())
        if (error)
        {
            alert.error(error)
            dispatch(clearError())
        }
        if (deleteError)
        {
            alert.error(deleteError)
            dispatch(clearError())
        }
        if (isDeleted)
        {
            alert.success('Product deleted successfully');
            navigate('/admin/products');
            dispatch({type: DELETE_PRODUCT_RESET})
        }
    }, [dispatch, alert, error,deleteError,isDeleted,navigate])
    
    const setProducts = () =>
    {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort:'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort:'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort:'asc'
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort:'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                    sort:'asc'
                }
            ],
            rows: []
        }
       
        products.forEach((product) =>
        {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                actions: <Fragment>
                    <Link  to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2"><i className='fa fa-pencil'></i></Link>
                    <button className='btn btn-danger py-1 px-2 ' onClick={()=>deleteProductHandler(product._id)}>
                        <i className='fa fa-trash'></i>
                    </button>
                </Fragment>
            })

        })
        return data 
    }
    const deleteProductHandler = (id) =>
    {
      dispatch(deleteProduct(id))   
    }
  return (
      <Fragment>
          <div className='row'>
              <div className='col-12 col-md-2'>
                  <Sidebar />
              </div>
              <div className='col-12 col-md-10'>
                  <Fragment>
                      <h1 className='my-5'>All Producs</h1>
                      {loading ? <Loader /> : (
                          <MDBDataTable
                              data={setProducts()}
                              className="px-3"
                              bordered
                              striped
                              hover
                          />
                      )}
                  </Fragment>
              </div>
          </div>
    </Fragment>
  )
}

export default ProductList