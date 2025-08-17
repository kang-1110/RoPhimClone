import { Col, Image, Row } from 'antd'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <Row align="middle" className="h-screen p-0 lg:p-5" wrap>
      <Col sm={24} md={24} lg={16} className="p-0 lg:p-5 lg:h-[95%]">
        <div className="w-full h-full">
          <Image
            wrapperClassName="w-full h-full"
            style={{
              transition: 'all 300ms ease',
              width: '100%',
              height: '100%',
              aspectRatio: '16/9',
            }}
            src="/images/banner-login.png"
            alt="img-background-login"
            className="object-contain rounded-md lg:rounded-xl"
            preview={false}
          />
        </div>
      </Col>
      <Outlet />
    </Row>
  )
}

export default AuthLayout