import React from 'react';
import { Row, Col, Typography, Button, Tooltip, Card } from 'antd';
import { ReloadOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { Product } from '../store/productsSlice';

const { Title, Text } = Typography;
const { Meta } = Card;

interface RecommendationsProps {
  products: Product[];
  onRefresh: () => void;
  onAddToCart: (product: Product) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ products, onRefresh, onAddToCart }) => {
  if (products.length === 0) return null;

  return (
    <div style={{ marginBottom: '40px' }}>
      <Row gutter={[24, 24]} style={{ margin: 0 }}>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
            <Title level={4} style={{ margin: 0 }}>You May Also Like</Title>
            <Tooltip title="Refresh Recommendations">
              <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} />
            </Tooltip>
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ margin: 0 }}>
        {products.map(product => (
          <Col key={`rec-${product.id}`} xs={24} sm={12} md={6} lg={6} xl={6}>
            <Card
              hoverable
              style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
              cover={<img alt={product.name} src={product.image} style={{ height: 160, objectFit: 'cover' }} />}
              bodyStyle={{ padding: '12px', flex: 1 }}
              actions={[
                <ShoppingCartOutlined key="cart" onClick={() => onAddToCart(product)} />,
              ]}
            >
              <Meta
                title={<Text strong style={{ fontSize: '14px' }} ellipsis>{product.name}</Text>}
                description={
                  <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                    ${product.price.toFixed(2)}
                  </Text>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Recommendations;
