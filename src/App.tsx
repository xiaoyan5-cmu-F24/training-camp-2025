import React from 'react';
import { Layout, Menu, theme } from 'antd';
import ProductList from './components/ProductList';
import { Typography } from 'antd';
import './App.css';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '20px' }}>
          E-Shop
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={[{ key: '1', label: 'Products' }, { key: '2', label: 'Cart' }]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content className="responsive-content">
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <ProductList />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        E-Shop ©{new Date().getFullYear()} Created with Ant Design
      </Footer>
    </Layout>
  );
};

export default App;
