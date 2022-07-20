import React, { Fragment, useEffect } from 'react';
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { myOrders,clearError } from '../../actions/orderAction.js'; 
import { MDBDataTable } from 'mdbreact';
import Loader from "../layouts/Loader.js";

const ListOrder = () =>
{
    
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector((state) => state.myOrders);

    useEffect(() =>
    {
        dispatch(myOrders())
        if (error)
        {
            alert.error(error)
            dispatch(clearError())
        }
    }, [dispatch, alert, error])
    
    const setOrders = () =>
    {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort:'asc'
                },
                {
                    label: 'Num Of Items',
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
                actions:  <Link to={`/order/${order._id}`} className="btn btn-primary"><i className='fa fa-eye'></i></Link>
            })

        })
        return data 
    }
  return (
      <Fragment>
          <h1 className='my-5'>My orders</h1>
          {loading ? <Loader /> : (
              <MDBDataTable
              data={setOrders()}
              className="px-3"
              bordered
              striped
              hover
          />)}
    </Fragment>
  )
}

export default ListOrder