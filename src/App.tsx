import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Typography, Space } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import type { RootState } from './store/store';
import { increment, decrement } from './store/counterSlice';
import './App.css';

const { Title, Text } = Typography;

function App() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <Title level={2}>Redux Toolkit + Ant Design</Title>
      <Card title="Counter Card" style={{ width: 300, textAlign: 'center' }}>
        <Space direction="vertical" size="large">
          <Text strong style={{ fontSize: '24px' }}>Count: {count}</Text>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => dispatch(increment())}
            >
              Increment
            </Button>
            <Button 
              danger 
              icon={<MinusOutlined />} 
              onClick={() => dispatch(decrement())}
            >
              Decrement
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
}

export default App;