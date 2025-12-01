import React from 'react';
import { Card, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Text } = Typography;

interface ProductCardProps {
  product: any;
  handleAddToCart: (product: any) => void;
  imageHeight?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, handleAddToCart, imageHeight = 200 }) => {
  return (
    <Card
      hoverable
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      cover={<img alt={product.name} src={product.image} style={{ height: imageHeight, objectFit: 'cover' }} />}
      actions={[
        <ShoppingCartOutlined key="cart" style={{ fontSize: '20px' }} onClick={() => handleAddToCart(product)} />,
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
  );
};

export default ProductCard;
