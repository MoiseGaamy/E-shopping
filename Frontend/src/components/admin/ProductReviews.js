import React,{Fragment,useEffect, useState} from 'react'
import { MDBDataTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { clearError, deleteReview, getProductReviews } from '../../actions/productActions.js';
import Sidebar from './Sidebar.js';
import { DELETE_REVIEW_RESET } from '../../constants/productConstant.js';


const ProductReviews = () =>
{    
    const[productId,setProductId] =useState('')
    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, reviews } = useSelector((state) => state.productReviews);
    const { isDeleted } = useSelector(state => state.deleteReview);
    useEffect(() =>
    {
        if (error)
        {
            alert.error(error)
            dispatch(clearError())
        }
        if (productId !== '')
        {
            dispatch(getProductReviews(productId))
        }
        if (isDeleted)
        {
            alert.success('review deleted successfully');
            dispatch({type: DELETE_REVIEW_RESET})
        }
    }, [dispatch, alert, error,productId,isDeleted])
    
    const deleteReviewHandler = (id) =>
    {
        dispatch(deleteReview(id,productId))
    }
     const sumbmitHandler = (e) =>
     {
         e.preventDefault()
        dispatch(getProductReviews(productId))
    }
    const setReviews = () =>
    {
        const data = {
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort:'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort:'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort:'asc'
                },
                {
                    label: 'Users',
                    field: 'user',
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
       
        reviews.forEach((review) =>
        {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,
                actions: <button className='btn btn-danger py-1 px-2 ml-2 ' onClick={()=>deleteReviewHandler(review._id)} >
                        <i className='fa fa-trash'></i>
                    </button>    
            })

        })
        return data 
    }

  return (
    <Fragment>
          <div className='row'>
              <div className='col-12 col-md-2'>
                  <Sidebar />
              </div>
              <div className='col-12 col-md-10'>
                  <Fragment>
                    <div className="row justify-content-center mt-5">
			          <div className="col-5">
                            <form onSubmit={sumbmitHandler}>
                                <div className="form-group">
                                    <label htmlFor="productId_field">Enter Product ID</label>
                                    <input
                                        type="text"
                                        id="productId_field"
                                        className="form-control"
                                        value={productId}
                                        onChange={(e)=>setProductId(e.target.value)}
                                    />
                                </div>

                                <button
                                    id="search_button"
                                    type="submit"
                                    className="btn btn-primary btn-block py-2"
                                >
                                    SEARCH
								</button>
                            </ form>
                          </div>
                        </div>
                    {reviews && reviews.length > 0 ? <MDBDataTable
                              data={setReviews()}
                              className="px-3"
                              bordered
                              striped
                              hover
                          />: ( <p className='mt-5 text-center'>No Reviews</p>
                          
                      )}
                  </Fragment>
              </div>
          </div>
    </Fragment>
  )
}

export default ProductReviews