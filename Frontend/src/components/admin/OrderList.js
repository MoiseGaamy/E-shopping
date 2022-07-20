import React,{Fragment,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { MDBDataTable } from "mdbreact";
import Loader from '../layouts/Loader.js';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { clearError } from '../../actions/productActions.js';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import { allOrders,deleteOrder } from '../../actions/orderAction.js';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants.js';

const OrderList = () =>
{
      const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, orders } = useSelector((state) => state.allOrders);
    const { isDeleted } = useSelector(state => state.order);
    useEffect(() =>
    {
        dispatch(allOrders())
        if (error)
        {
            alert.error(error)
            dispatch(clearError())
        }
        if (isDeleted)
        {
            alert.success('order deleted successfully');
            navigate('/admin/orders');
            dispatch({type: DELETE_ORDER_RESET})
        }
    }, [dispatch, alert, error,isDeleted,navigate])
    
     const deleteOrderHandler = (id) =>
    {
        dispatch(deleteOrder(id))
    }
    const setOrders = () =>
    {
        const data = {
            columns: [
                {
                    label: 'order ID',
                    field: 'id',
                    sort:'asc'
                },
                {
                    label: 'No of items',
                    field: 'numofitems',
                    sort:'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort:'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
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
       
        orders.forEach((order) =>
        {
            data.rows.push({
                id: order._id,
                numofitems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered') ? <p style={{ color: 'green' }}>{order.orderStatus}</p> : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions:<Fragment>
                     <Link to={`/admin/order/${order._id}`} className="btn btn-primary py-1 px-2"><i className='fa fa-eye'></i></Link>           
                    <button className='btn btn-danger py-1 px-2 ml-2 ' onClick={()=> deleteOrderHandler(order._id)} >
                        <i className='fa fa-trash'></i>
                    </button>
                </Fragment>
                   
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
                      <h1 className='my-5'>All Orders</h1>
                      {loading ? <Loader /> : (
                          <MDBDataTable
                              data={setOrders()}
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

export default OrderList