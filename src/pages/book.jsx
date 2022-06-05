import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Space, Button } from 'antd';
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

const Book= () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    Server.getBookList().then((res) => {
      let newD = res.data.map((u, i) => {
        return { key: `${i}`, ...u }
      })
      setData(newD)
    })
  }, [])

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      id: '',
      name: '',
      author: '',
      number: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
      if (newData[index].id) {
        Server.modifyBook(newData[index]).then((data) => {
          console.log(data)
        })
      } else {
        Server.addBook(newData[index]).then(() => {
          Server.getBookList().then((res) => {
            let newD = res.data.map((u, i) => {
              return { key: `${i}`, ...u }
            })
            setData(newD)
          })
        })
      }

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    for (let u of data) {
      if (u.key === key) {
        Server.deleteBook(u.id).then((data) => {
          console.log(data)
        })
        continue;
      }
    }
    setData(newData);
  };

  const handleAdd = () => {
    const newData = {
      key: `${data.length}`,
      name: '',
      author: '',
      number: ``,
    };
    setData([...data, newData])
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
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        );
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
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a Book
      </Button>
      <Search placeholder="input Bookid" onSearch={onSearch} style={{ width: 200, marginLeft: 200 }} />
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

export default Book;
