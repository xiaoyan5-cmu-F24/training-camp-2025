import React from 'react';
import { Layout, Menu, theme, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import { setCartOpen } from './store/cartSlice';
import type { RootState } from './store/store';
import './App.css';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const menuItems = [
    { key: '1', label: 'Products' },
    { 
      key: '2', 
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Cart
          <Badge count={cartItemCount} size="small" offset={[5, 0]}>
            <ShoppingCartOutlined style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.65)' }} />
          </Badge>
        </span>
      ) 
    }
  ];

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === '2') {
      dispatch(setCartOpen(true));
    }
  };

  return (
    <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CartDrawer />
      <Header style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <div className="demo-logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>
          E-Shop
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content className="responsive-content" style={{ padding: '24px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px'
          }}
        >
          <ProductList />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', flexShrink: 0 }}>
        E-Shop ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </Layout>
  );
};

export default App;
