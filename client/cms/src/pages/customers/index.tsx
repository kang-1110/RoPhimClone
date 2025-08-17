import { Card, Col, Form, Input, Row, Select, TableColumnsType } from "antd";
import { CustomerType } from "../../type/CustomerType";
import FilterTable from "../../components/table/FilterTable";

import { useState } from "react";
import { customerHooks } from "../../hooks/useCustomers";

const mockCustomers: CustomerType[] = [
	{
		id: "1",
		name: "Nguyen Van A",
		type: "Gold",
		address: "123 Le Loi, HCM",
		point: 1200,
		numberOfRefueling: 15,
		lastRefuel: "2024-06-01",
	},
	{
		id: "2",
		name: "Tran Thi B",
		type: "Silver",
		address: "456 Tran Hung Dao, HN",
		point: 800,
		numberOfRefueling: 8,
		lastRefuel: "2024-05-28",
	},
	{
		id: "3",
		name: "Le Van C",
		type: "Bronze",
		address: "789 Nguyen Trai, DN",
		point: 400,
		numberOfRefueling: 3,
		lastRefuel: "2024-05-20",
	},
	// ...add more mock data as needed
];

function useMockCustomersQuery() {
	const [rows] = useState<CustomerType[]>(mockCustomers);
	return {
		data: {
			rows,
			total: mockCustomers.length,
		},
	};
}

const Customers = () => {
	const columns: TableColumnsType<CustomerType> = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Customer Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Grade",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
		},
		{
			title: "Point",
			dataIndex: "point",
			key: "point",
		},
		{
			title: "Number of Refueling",
			dataIndex: "numberOfRefueling",
			key: "numberOfRefueling",
		},
		{
			title: "Last Refuel",
			dataIndex: "lastRefuel",
			key: "lastRefuel",
		},
	];

	const filterRender = () => {
		return (
      <Card>
        <Row gutter={[16, 16]}>
          <Col>
            <Form.Item
              name="search"
            >
              <Input placeholder="Search by name" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="select"
            >
              <Select placeholder="Select a customer type" options={[]} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    )
	};

	return (
			<FilterTable<CustomerType>
				title="Customers"
				columns={columns}
				useQueryHook={customerHooks.useGetListCustomers}
				tableInfo={{
					// actions: [
					//   {
					//     type: "edit",
					//     func: undefined
					//   },
					//   {
					//     type: "delete",
					//     func: undefined
					//   }
					// ],
					createAndUpdate: {
						// isCreate: true,
						// modal: ModalCreateEdit
					},
				}}
        filterRender={filterRender()}
			/>
	);
};

export default Customers;
