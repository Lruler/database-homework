import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Form } from 'antd';
import Server from '../server/server';
const { Search } = Input;


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const BookList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  useEffect(() => {
    Server.getBookList().then((res) => {
      let newD = res.data.map((u, i) => {
        return { key: `${i}`, ...u }
      })
      setData(newD)
    })
  }, [])


  const cancel = () => {
    setEditingKey('');
  };


  const onSearch = (id) => {
    if (id) {
      Server.searchBook(id).then((res) => {
        console.log(res)
        setData([{ key: '0', ...res.data }])
      })
    } else {
      Server.getBookList().then((res) => {
        let newD = res.data.map((u, i) => {
          return { key: `${i}`, ...u }
        })
        setData(newD)
      })
    }
  }

  const handleBorrow = (book) => {
    const userid = localStorage.getItem('id')
    Server.borrowBook(book.id, userid).then((data) => {
      console.log(data)
    })
  }

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '25%',
      editable: false,
    },
    {
      title: 'name',
      dataIndex: 'name',
      width: '15%',
      editable: true,
    },
    {
      title: 'author',
      dataIndex: 'author',
      width: '20%',
      editable: true,
    },
    {
      title: 'number',
      dataIndex: 'number',
      width: '20%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
            <a onClick={() => {handleBorrow(record)}}>
              借书
            </a>
          </span>)
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });
  return (
    <>
      <Search placeholder="input BookName" onSearch={onSearch} style={{ width: 200, marginLeft: 200 }} />
      <Form form={form} component={false}>
        <Table
          loadings
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
};

export default BookList;
