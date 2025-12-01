import React from 'react';
import { Drawer, List, Button, InputNumber, Typography, Image, Empty, Grid } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { removeFromCart, updateQuantity, setCartOpen } from '../store/cartSlice';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const CartDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);
  const screens = useBreakpoint();

  const handleClose = () => {
    dispatch(setCartOpen(false));
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const drawerWidth = screens.xs ? '100%' : 400;

  return (
    <Drawer
      title={`Shopping Cart (${items.length} items)`}
      placement="right"
      onClose={handleClose}
      open={isOpen}
      width={drawerWidth}
      extra={
        <Button type="primary" onClick={handleClose}>
          Close
        </Button>
      }
      footer={
        items.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '16px' }}>
              Total: ${totalPrice.toFixed(2)}
            </Text>
            <Button type="primary" size="large">
              Checkout
            </Button>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item) => (
            <List.Item>
              <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px' }}>
                <Image 
                  width={80} 
                  height={80} 
                  src={item.image} 
                  alt={item.name} 
                  preview={false} 
                  style={{ borderRadius: '8px', objectFit: 'cover', border: '1px solid #f0f0f0' }} 
                />
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {/* Header: Name and Remove */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text strong style={{ fontSize: '14px', lineHeight: '1.4', maxWidth: '160px' }} ellipsis={{ tooltip: item.name }}>
                      {item.name}
                    </Text>
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => dispatch(removeFromCart(item.id))}
                        style={{ marginRight: -4 }} 
                    />
                  </div>

                  {/* Price info */}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Unit Price: ${item.price.toFixed(2)}
                  </Text>

                  {/* Footer: Qty and Total */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                     <InputNumber
                        min={1}
                        max={99}
                        size="small"
                        value={item.quantity}
                        onChange={(value) => {
                            if (value) {
                                dispatch(updateQuantity({ id: item.id, quantity: value }));
                            }
                        }}
                        style={{ width: '60px' }}
                    />
                     <Text strong style={{ fontSize: '15px' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                     </Text>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default CartDrawer;
