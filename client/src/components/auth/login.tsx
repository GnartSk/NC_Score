'use client'

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import Image from 'next/image';

const Login: React.FC = () => {
    const onFinish = (values: any) => {
      console.log('Received values of form: ', values);
    };
  return (
    <main className="bg-[#26313c] h-screen flex items-center justify-center p-10">
      <div className="grid w-full h-full grid-cols-1 bg-white box-anim md:grid-cols-2">
        <div className="bg-[#16202a] text-white flex items-center justify-center flex-col">
          <div className="my-4">
            <h1 className="text-3xl font-semibold ">Login</h1>
            <p className="mt-2 text-xs text-slate-400">
              See Your Growth and get consulting growth
            </p>
          </div>
          <Form
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a href="">Forgot password</a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Log in
        </Button>
        or <a href="">Register now!</a>
      </Form.Item>
    </Form>
          <p className="mt-4 text-xs text-slate-200">
            @2023 All rights reserved
          </p>
        </div>
        <div className="relative hidden md:block">
          <Image
            className="object-cover "
            fill={true}
            src="/bg.jpg"
            alt="bg-image"
          />
        </div>
      </div>
    </main>
  );
}
export default Login;