"use client";

import { Button, Divider, Flex, Form, Input } from "antd";
import React from "react";
import Image from "next/image";
import { setCookie } from "@/utils/cookie";
import { STORAGES } from "@/constant/storages";
import { useRouter } from "next/navigation";
import { APP_ROUTE } from "@/constant/route";
import { LoginType } from "../_types";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = (values: LoginType) => {
    console.log("Login values:", values);
    // Handle login logic here
    setCookie(STORAGES.ACCESS_TOKEN, "mocked_access_token");
    router.replace(APP_ROUTE.home);
  };

  return (
    <Flex justify="center" align="center" className="h-full">
      <Flex vertical align="center" gap={32} className="w-full max-w-[400px]">
        <Form
          layout="vertical"
          className="min-w-[400px]"
          onFinish={handleLogin}
        >
          <Form.Item label="Email">
            <Input size="large" />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item noStyle>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="w-full"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <Flex vertical align="stretch" gap={16} className="w-full">
          <Button
            type="text"
            variant="filled"
            size="large"
            className="w-full relative"
            icon={
              <Image
                src="/icons/google.svg"
                alt="Google Icon"
                width={20}
                height={20}
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2"
              />
            }
            iconPosition="start"
          >
            Login with Google
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
