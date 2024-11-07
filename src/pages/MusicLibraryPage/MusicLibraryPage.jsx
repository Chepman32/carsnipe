import React, { useEffect, useState } from 'react';
import { list, getUrl } from '@aws-amplify/storage';
import { Table, Button, notification } from 'antd';
import { PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';

const MusicLibraryPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const fileData = await list('public/album/2024/'); // List files from the specified path
      const filesWithUrls = await Promise.all(
        fileData.map(async (file) => {
          const url = await getUrl(file.key); // Get public URL for each file
          return { ...file, url };
        })
      );
      setFiles(filesWithUrls);
    } catch (error) {
      console.error("Error fetching files:", error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch files from S3',
      });
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'key',
      key: 'key',
      render: (text) => text.replace('public/album/2024/', ''),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <div>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => window.open(record.url, '_blank')}
            style={{ marginRight: 8 }}
          >
            Play
          </Button>
          <Button
            type="default"
            icon={<DownloadOutlined />}
            href={record.url}
            target="_blank"
            download
          >
            Download
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Music Library</h2>
      <Table
        columns={columns}
        dataSource={files}
        rowKey="key"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default MusicLibraryPage;