import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Card, Typography, Spin, Alert, Row, Col } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import type { AppDispatch, RootState } from '../store/store';
import { fetchProducts } from '../store/productsSlice';

const { Meta } = Card;
const { Title, Text } = Typography;

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading products..." />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Featured Products
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {items.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
             <Card
                hoverable
                cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: 'cover' }} />}
                actions={[
                  <ShoppingCartOutlined key="cart" style={{ fontSize: '20px' }} />,
                ]}
              >
                <Meta
                  title={product.name}
                  description={
                    <>
                      <Text type="secondary" style={{ display: 'block', height: '44px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.description}
                      </Text>
                      <Text strong style={{ fontSize: '18px', color: '#1890ff', marginTop: '10px', display: 'block' }}>
                        ${product.price.toFixed(2)}
                      </Text>
                    </>
                  }
                />
              </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
