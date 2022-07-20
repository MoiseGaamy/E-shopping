import React, { Fragment }from 'react'

const Footer = () =>
{
    const date = new Date().getFullYear()
  return (
      <Fragment>
           <footer className="py-1">
                <p className="text-center  mt-1">
                    E-Shop- 2021-{date}, All Rights Reserved
                </p>
    </footer>
    </Fragment>
  )
}

export default Footer