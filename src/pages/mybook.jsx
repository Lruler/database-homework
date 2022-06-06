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

const MyBook = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('id')
    Server.showHistoryById(id).then((res) => {
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

  const returnBook = (book) => {
    // 获取当前日期
    var date = new Date();

    // 获取当前月份
    var nowMonth = date.getMonth() + 1;

    // 获取当前是几号
    var strDate = date.getDate();

    // 添加分隔符“-”
    var seperator = "-";

    // 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth >= 1 && nowMonth <= 9) {
      nowMonth = "0" + nowMonth;
    }

    // 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }

    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
    Server.returnBook(book.id, book.book_id, nowDate).then((data) => {
      console.log(data)
    })
  }
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '10%',
      editable: false,
    },
    {
      title: 'book_name',
      dataIndex: 'book_name',
      width: '15%',
      editable: true,
    },
    {
      title: 'user_name',
      dataIndex: 'user_name',
      width: '20%',
      editable: true,
    },
    {
      title: 'borrow_date',
      dataIndex: 'borrow_date',
      width: '20%',
      editable: true,
    },
    {
      title: 'return_date',
      dataIndex: 'return_date',
      width: '20%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span onClick={() => {returnBook(record)}}>
            <a>
              还书
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

export default MyBook;
