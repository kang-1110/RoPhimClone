"use client";

import { languageOptions } from '@/constant/languages';
import { APP_ROUTE } from '@/constant/route';
import { Flex, Layout, Select } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const AuthLayout = ({ children } : { children: React.ReactNode }) => {

    const { Header, Content } = Layout // do sử dụng sub component của layout nên phải là client component

    return (
        <Layout className='!h-screen'>
            <Header className='sticky top-0 z-10 w-full'>
                <Flex align='center' gap={8} className='h-full'>
                    <Link href={APP_ROUTE.home}>
                        <Image
                            src={"/icons/penguin.svg"}
                            alt='Next.js Logo'
                            width={50}
                            height={50}
                        />
                    </Link>
                    <Select
                     options={languageOptions}
                     defaultValue={languageOptions[0].value}
                     className='min-w-[150px]'
                    />
                </Flex>
            </Header>
            <Content>
                {children}
            </Content>
        </Layout>
    )
}

export default AuthLayout

