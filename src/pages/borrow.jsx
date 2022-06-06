import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useOutlet } from 'react-router';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import './home.css'

const { Header, Sider, Content } = Layout;


const Borrow = () => {
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate()
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: '我的图书',
              onClick: () => {
                nav('mybook')
              }
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: '图书列表',
              onClick: () => {
                nav('books')
              }
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {useOutlet()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Borrow;
